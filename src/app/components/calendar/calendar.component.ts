import {AfterViewInit, ChangeDetectorRef, Component, signal} from '@angular/core';

import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin, {Draggable} from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    NgForOf
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements AfterViewInit{

  calendarOptions: CalendarOptions | undefined;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.initCalendar();
  }

  ngAfterViewInit(): void {
    const externalEventsElement = document.getElementById('external-events');
    if (externalEventsElement) {
      const externalEvents = new Draggable(externalEventsElement, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          return {
            title: eventEl.innerText.trim()
          };
        }
      });
    } else {
      console.error("External events container not found.");
    }
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
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventReceive: (info) => {
        // Handle event dropping here, for example, add the dropped event to the calendar
        console.log("event receinved")
      },
      drop: (info) => {
        console.log('Dropped event:', info);
      }
    };
  }

  private handleDateSelect(selectInfo: DateSelectArg) {
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

  private handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
  }

  private handleEvents(events: EventApi[]) {
    console.log(events);
  }
}
