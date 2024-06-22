import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { EventApi } from "@fullcalendar/core";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly baseUrl: string = 'https://appointment-scheduler.azurewebsites.net/api';
  private readonly addEventCode: string = `?code=${process.env['ADD_EVENT_CODE']}`;
  private readonly updateEventCode: string = `?code=${process.env['UPDATE_EVENT_CODE']}`;
  private readonly deleteEventCode: string = `?code=${process.env['DELETE_EVENT_CODE']}`;

  constructor(private httpClient: HttpClient) {
    if (window.location.hostname === "localhost") {
      this.baseUrl = 'http://localhost:7071/api';
      this.addEventCode = '';
      this.updateEventCode = '';
      this.deleteEventCode = '';
    }
  }

  addEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.post<EventApi>(`${this.baseUrl}/events/add${this.addEventCode}`, event);
  }

  updateEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.put<EventApi>(`${this.baseUrl}/events/update/${event.id}${this.updateEventCode}`, event);
  }

  deleteEvent(id: string): Observable<EventApi>
  {
    return this.httpClient.delete<EventApi>(`${this.baseUrl}/events/delete/${id}${this.deleteEventCode}`);
  }
}
