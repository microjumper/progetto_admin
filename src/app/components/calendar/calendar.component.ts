import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventApi, EventClickArg } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { EventReceiveArg } from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';

import { ConfirmationService, MenuItem, MessageService } from "primeng/api";

import { EventService } from "../../services/event/event.service";
import { ContextMenu, ContextMenuModule } from "primeng/contextmenu";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    ContextMenuModule,
    ToastModule,
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
    { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editEvent() },
    { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteEvent() }
  ];
  eventClickedOn: EventApi | null = null;

  constructor(private eventService: EventService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.initCalendar();
  }

  private editEvent() {
    console.log("Edit event");
  }

  private deleteEvent() {
    this.confirmationService.confirm({
      message: 'Procedere con l\'eliminazione?',
      header: 'Conferma Eliminazione',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.eventClickedOn?.remove();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Evento eliminato',  life: 3000 });
      },
      reject: () => this.eventClickedOn = null
    });
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
      events: 'http://localhost:7071/api/events/all',
      eventDataTransform: eventData => {
        for (let prop in eventData) {
          if (eventData[prop] === null) {
            delete eventData[prop];
          }
        }
        return eventData
      },
      eventClick: clickInfo => this.handleClick(clickInfo),
      eventsSet: events => this.handleSet(events),
      eventReceive: info => this.handleReceive(info),
      eventDrop: eventDropInfo => this.handleDrop(eventDropInfo),
    };
  }

  private handleClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();

    if (clickInfo.event.url) {
      window.open(clickInfo.event.url);
    }

    this.eventClickedOn = clickInfo.event;
    this.contextMenu?.show(clickInfo.jsEvent);
  }

  private handleSet(events: EventApi[]) {
/*    console.log(events);

    events.forEach((event) => {
      const startDate = event.start;
      const endDate = event.end;

      console.log("Event start date:", startDate);
      console.log("Event end date:", endDate);
    });*/
  }

  private handleReceive(info: EventReceiveArg): void
  {
    const event = info.event;

    this.eventService.addEvent(event).subscribe(
      (response) => {
        console.log(response);
      })
  }

  private handleDrop(eventDropInfo: any): void
  {
    console.log(eventDropInfo.event)

    // update event in database
  }
}
