import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from "@angular/common";

import { ContextMenu, ContextMenuModule } from "primeng/contextmenu";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { Dialog, DialogModule } from "primeng/dialog";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventApi, EventClickArg } from "@fullcalendar/core";
import interactionPlugin, { EventReceiveArg } from '@fullcalendar/interaction';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import itLocale from '@fullcalendar/core/locales/it';

import { firstValueFrom, Subscription } from "rxjs";

import { EventService } from "../../services/event/event.service";
import { AppointmentService } from "../../services/appointment/appointment.service";
import { Appointment } from "../../../../progetto_shared/appointment.type";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    ContextMenuModule,
    ConfirmDialogModule,
    DialogModule,
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;
  @ViewChild(ContextMenu) contextMenu: ContextMenu | undefined;
  @ViewChild(Dialog) dialog: Dialog | undefined

  calendarOptions: CalendarOptions | undefined;
  contextMenuItems: MenuItem[] = [
    { label: 'Dettagli', icon: 'pi pi-info-circle', command: () => this.displayInfo(), disabled: true },
    { label: 'Elimina', icon: 'pi pi-trash', command: () => this.deleteEvent(), disabled: false }
  ];
  dialogVisible: boolean = false;
  appointment: Appointment | undefined;

  private eventClickedOn: EventApi | null = null;

  constructor(private eventService: EventService, private confirmationService: ConfirmationService, private messageService: MessageService, private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.initCalendar();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      initialView: 'timeGridDay',
      slotMinTime: '08:30',
      slotMaxTime: '18:30',
      nowIndicator: true,
      selectable: false,
      editable: true,
      droppable: true,
      allDaySlot: false,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next,today',
        center: 'title',
        right: 'listWeek,timeGridDay,timeGridWeek,dayGridMonth'
      },
      views: {
        timeGridWeek: {
          type: 'timeGrid',
          duration: { weeks: 1 }
        },
        timeGridDay: {
          type: 'timeGrid',
          duration: { days: 1 }
        },
        listWeek: {
          type: 'list',
          duration: { weeks: 1 }
        }
      },
      lazyFetching: true,
      events: window.location.hostname === "localhost" ? 'http://localhost:7071/api/events' :
        `https://appointment-scheduler.azurewebsites.net/api/events?code=${process.env['GET_EVENTS_CODE']}`,
      eventClick: clickInfo => this.handleClick(clickInfo), // click on an event
      eventReceive: info => this.handleReceive(info), // drag and drop an external event
      eventDrop: eventDropInfo => this.handleDrop(eventDropInfo), // event update after dragging it
    };
  }

  private handleClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    this.eventClickedOn = clickInfo.event;

    const isBooked: boolean = this.eventClickedOn.extendedProps["appointment"] !== undefined;
    // if there's an appointment, admin can't delete the event
    this.contextMenuItems[1].disabled = isBooked;
    // if there's an appointment, admin can display appointment info
    this.contextMenuItems[0].disabled = !isBooked;

    this.contextMenu?.show(clickInfo.jsEvent);
  }

  private async handleReceive(info: EventReceiveArg): Promise<void>
  {
    const event = info.event;

    if(await this.isDatePassed(event)) {
      event.remove();
      this.messageService.add({
        severity: 'error',
        summary: 'Operazione annullata',
        detail: 'Impossibile associare un servizio ad una data passata', life: 1500
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Aggiungere l\'evento al calendario?',
      header: 'Conferma aggiunta evento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        if(this.calendarComponent?.getApi()?.view.type === 'dayGridMonth') { // event dropped on a month view
          event.setDates(event.start!, event.end!);
          event.moveDates('08:30'); // avoid the event to be set at midnight
        }

        const subscription: Subscription = this.eventService.addEvent(event).subscribe({
          next: (response) => {
            event.remove(); // remove draggable
            this.calendarComponent?.getApi()?.refetchEvents();
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento aggiunto al calendario', life: 1500 });
          },
          error: (error) => {
            event.remove(); // revert
            console.error(error.message);
          },
          complete: () => subscription.unsubscribe()
        })
      },
      reject: () => info.revert()
    });
  }

  private async handleDrop(eventDropInfo: any): Promise<void>
  {
    const event = eventDropInfo.event;

    if(await this.isDatePassed(event)) {
      eventDropInfo.revert();
      this.messageService.add({
          severity: 'error',
          summary: 'Operazione annullata',
          detail: 'Impossibile modificare un servizio associato ad una data passata', life: 1500
        });
      return;
    }

    this.confirmationService.confirm({
      message: 'Procedere con le modifiche?',
      header: 'Conferma modifica evento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.eventService.updateEvent(event).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento modificato', life: 1500 });
          },
          error: (error) => console.error(error.message)
        })
      },
      reject: () => eventDropInfo.revert()
    });
  }

  private deleteEvent() {
    this.confirmationService.confirm({
      message: 'Procedere con l\'eliminazione?',
      header: 'Conferma eliminazione evento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        if(this.eventClickedOn?.id) {
          this.eventService.deleteEvent(this.eventClickedOn.id).subscribe({
            next: (response) => {
              this.eventClickedOn?.remove();
              this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento eliminato',  life: 1500 });
            },
            error: (error) => console.error(error.message)
          });
        }
      },
      reject: () => this.eventClickedOn = null
    });
  }

  private displayInfo(): void
  {
    const id = this.eventClickedOn?.extendedProps["appointment"];
    const subscription: Subscription = this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment: Appointment) => this.appointment = appointment,
      error: error => console.log(error.message),
      complete: () => subscription.unsubscribe()
    });

    this.dialogVisible = true;
  }

  onHide(): void {
    this.appointment = undefined;
  }

  private async isDatePassed(event: EventApi): Promise<boolean> {
    const eventDate = event.start!;

    const response = await firstValueFrom(this.appointmentService.getDate());
    const currentDate = new Date(response.dateISO);

    return eventDate < currentDate
  }
}
