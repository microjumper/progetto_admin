import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { EventApi } from "@fullcalendar/core";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  addEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.post<EventApi>('http://localhost:7071/api/events/add', event);
  }

  updateEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.put<EventApi>(` http://localhost:7071/api/events/update/${event.id}`, event);
  }

  deleteEvent(id: string): Observable<EventApi>
  {
    return this.httpClient.delete<EventApi>(`http://localhost:7071/api/events/delete/${id}`);
  }
}
