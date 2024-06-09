import { Component, OnInit, ViewChild } from '@angular/core';

import { ContextMenu, ContextMenuModule } from "primeng/contextmenu";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventApi, EventClickArg, EventInput } from "@fullcalendar/core";
import interactionPlugin, { EventReceiveArg } from '@fullcalendar/interaction';

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';

import itLocale from '@fullcalendar/core/locales/it';

import { EventService } from "../../services/event/event.service";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    ContextMenuModule,
    ConfirmDialogModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;
  @ViewChild(ContextMenu) contextMenu: ContextMenu | undefined;

  calendarOptions: CalendarOptions | undefined;
  contextMenuItems: MenuItem[] = [
    { label: 'Elimina', icon: 'pi pi-trash', command: () => this.deleteEvent(), disabled: false }
  ];
  eventClickedOn: EventApi | null = null;

  constructor(private eventService: EventService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.initCalendar();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      initialView: 'timeGridDay',
      nowIndicator: true,
      selectable: true,
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
      events: 'http://localhost:7071/api/events',
      eventDataTransform: eventData => {
        for (let prop in eventData) {
          if (eventData[prop] === null) {
            delete eventData[prop];
          }
        }
        return eventData
      },
      eventClick: clickInfo => this.handleClick(clickInfo), // click on an event
      eventReceive: info => this.handleReceive(info), // drag and drop an external event
      eventDrop: eventDropInfo => this.handleDrop(eventDropInfo), // event update after dragging it
    };
  }

  private handleClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    this.eventClickedOn = clickInfo.event;

    // if there's an appointment, admin can't delete the event
    this.contextMenuItems[0].disabled = this.eventClickedOn.extendedProps["appointment"] !== undefined;

    this.contextMenu?.show(clickInfo.jsEvent);
  }

  private handleReceive(info: EventReceiveArg): void
  {
    const event = info.event;

    this.confirmationService.confirm({
      message: 'Aggiungere l\'evento al calendario?',
      header: 'Conferma aggiunta evento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.eventService.addEvent(event).subscribe({
          next: (response) => {
            event.remove(); // remove draggable
            this.calendarComponent?.getApi().refetchEvents();
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento aggiunto al calendario', life: 1500 });
          },
          error: (error) => {
            event.remove(); // revert
            console.error(error.message);
          }
        })
      },
      reject: () => info.revert()
    });
  }

  private handleDrop(eventDropInfo: any): void
  {
    const event = eventDropInfo.event;

    this.confirmationService.confirm({
      message: 'Procedere con le modifiche?',
      header: 'Conferma modifica evento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.eventService.updateEvent(event).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento modificato', life: 3000 });
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
              this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Evento eliminato',  life: 3000 });
            },
            error: (error) => console.error(error.message)
          });
        }
      },
      reject: () => this.eventClickedOn = null
    });
  }
}
