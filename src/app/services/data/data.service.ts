import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { forkJoin, Observable } from "rxjs";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly baseUrl: string = 'https://appointment-scheduler.azurewebsites.net/api';
  private readonly getLegalServicesCode: string = `?code=${process.env['GET_LEGAL_SERVICES_CODE']}`;
  private readonly addLegalServiceCode: string = `?code=${process.env['ADD_LEGAL_SERVICE_CODE']}`
  private readonly deleteLegalServiceCode: string = `?code=${process.env['DELETE_LEGAL_SERVICE_CODE']}`

  constructor(private httpClient: HttpClient) {
    if (window.location.hostname === "localhost") {
      this.baseUrl = 'http://localhost:7071/api';
      this.getLegalServicesCode = '';
      this.addLegalServiceCode = '';
      this.deleteLegalServiceCode = ';'
    }
  }

  getLegalServices(): Observable<LegalService[]>
  {
    return this.httpClient.get<LegalService[]>(`${this.baseUrl}/legalservices${this.getLegalServicesCode}`);
  }

  addLegalService(legalService: LegalService): Observable<LegalService>
  {
    return this.httpClient.post<LegalService>(`${this.baseUrl}/legalServices/add${this.addLegalServiceCode}`, legalService);
  }

  deleteLegalServices(legalServiceIds: string[]): Observable<LegalService[]>
  {
    return forkJoin(legalServiceIds.map(id => this.deleteLegalService(id)));
  }

  deleteLegalService(legalServiceId: string): Observable<LegalService>
  {
    return this.httpClient.delete<LegalService>(`${this.baseUrl}/legalServices/delete/${legalServiceId}${this.deleteLegalServiceCode}`);
  }
}
