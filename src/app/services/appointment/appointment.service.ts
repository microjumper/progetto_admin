import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly baseUrl: string = 'https://appointment-scheduler.azurewebsites.net/api';
  private readonly getCurrentDateCode: string = `?code=${process.env['GET_CURRENT_DATE_CODE']}`;
  private readonly getAppointmentByIdCode: string = `?code=${process.env['GET_APPOINTMENT_BY_ID_CODE']}`;

  constructor(private httpClient: HttpClient) {
    if (window.location.hostname === "localhost") {
      this.baseUrl = 'http://localhost:7071/api';
      this.getCurrentDateCode = '';
      this.getAppointmentByIdCode = '';
    }
  }

  public getDate(): Observable<{ dateISO: string }>
  {
    return this.httpClient.get<{ dateISO: string }>(`${this.baseUrl}/date${this.getCurrentDateCode}`);
  }

  public getAppointmentById(id: string): Observable<Appointment>
  {
    return this.httpClient.get<Appointment>(`${this.baseUrl}/appointments/${id}${this.getAppointmentByIdCode}`);
  }
}
