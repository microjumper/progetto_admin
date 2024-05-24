import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { EventApi } from "@fullcalendar/core";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private httpClient: HttpClient) { }

  getLegalServices(): Observable<LegalService[]>
  {
    return this.httpClient.get<LegalService[]>('http://localhost:7071/api/legalservices/all');
  }

  getEvents(): Observable<EventApi[]>
  {
    return this.httpClient.get<EventApi[]>('http://localhost:7071/api/events/all');
  }

  addEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.post<EventApi>('http://localhost:7071/api/events/add', event);
  }

  updateEvent(event: EventApi): Observable<EventApi>
  {
    return this.httpClient.put<EventApi>('', event);
  }
}
