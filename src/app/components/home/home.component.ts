import { Component } from '@angular/core';

import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import itLocale from '@fullcalendar/core/locales/it';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  calendarOptions: CalendarOptions = {
    locale: itLocale,
    initialView: 'listWeek',
    selectable: true,
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
    dateClick: function(info) {
      console.log('Clicked on: ' + info.dateStr);
      console.log(new Date(info.dateStr));
    }
  };
}
