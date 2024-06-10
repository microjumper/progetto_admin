import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private httpClient: HttpClient) { }

  public getDate(): Observable<{ dateISO: string }>
  {
    return this.httpClient.get<{ dateISO: string }>(`http://localhost:7071/api/date`);
  }

  public getAppointmentById(id: string): Observable<Appointment>
  {
    return this.httpClient.get<Appointment>(`http://localhost:7071/api/appointments/${id}`);
  }
}
