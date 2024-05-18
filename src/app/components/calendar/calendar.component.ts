import { AfterViewInit, Component } from '@angular/core';

import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable, EventReceiveArg } from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements AfterViewInit{

  calendarOptions: CalendarOptions | undefined;

  constructor() {
    this.initCalendar();
  }

  ngAfterViewInit(): void {
    this.initExternalEventsDraggable();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      initialView: 'listWeek',
      selectable: true,
      editable: true,
      droppable: true,
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
      select: selectInfo => this.handleSelect(selectInfo),
      eventClick: clickInfo => this.handleClick(clickInfo),
      eventsSet: events => this.handleSet(events),
      eventReceive: info => this.handleReceive(info),
      drop: dropArg => console.log(dropArg)
    };
  }

  private initExternalEventsDraggable(): void {
    const externalEventsElement = document.getElementById('external-events');
    if (externalEventsElement) {
      const externalEvents = new Draggable(externalEventsElement, {
        itemSelector: '.fc-event',
        eventData: (eventEl) => {
          const title = eventEl.innerText.trim();
          console.info(`Dragging ${title}`);
          return { title };
        }
      });
    }
    else {
      console.error("External events container not found.");
    }
  }

  private handleSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: "1",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  private handleClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
  }

  private handleSet(events: EventApi[]) {
    console.log(events);
  }

  private handleReceive(info: EventReceiveArg): void
  {
    console.log(info)
  }
}
