import { AfterViewInit, Component } from '@angular/core';

import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { EventReceiveArg } from '@fullcalendar/interaction';

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
export class CalendarComponent {

  calendarOptions: CalendarOptions | undefined;

  constructor() {
    this.initCalendar();
  }

  private initCalendar(): void {
    this.calendarOptions = {
      locale: itLocale,
      initialView: 'timeGridDay',
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
      drop: dropArg => this.handleDrop(dropArg)
    };
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
    // handle appointment repositioning
    console.log(events);

    events.forEach((event) => {
      const startDate = event.start;
      const endDate = event.end;

      console.log("Event start date:", startDate);
      console.log("Event end date:", endDate);
    });
  }

  private handleReceive(info: EventReceiveArg): void
  {
    const event =  info.event;

    console.log(event.title)
    console.log(event.startStr)
    console.log(event.endStr)
    console.log(event.allDay)
    console.log(event.url)
  }

  private handleDrop(dropInfo: any): void
  {
    //console.log(dropInfo)
  }
}
