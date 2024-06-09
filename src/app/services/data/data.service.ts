import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { forkJoin, Observable } from "rxjs";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getLegalServices(): Observable<LegalService[]>
  {
    return this.httpClient.get<LegalService[]>('http://localhost:7071/api/legalservices');
  }

  addLegalService(legalService: LegalService): Observable<LegalService>
  {
    return this.httpClient.post<LegalService>('http://localhost:7071/api/legalServices/add', legalService);
  }

  deleteLegalServices(legalServiceIds: string[]): Observable<LegalService[]>
  {
    return forkJoin(legalServiceIds.map(id => this.deleteLegalService(id)));
  }

  deleteLegalService(legalServiceId: string): Observable<LegalService>
  {
    return this.httpClient.delete<LegalService>(`http://localhost:7071/api/legalServices/delete/${legalServiceId}`);
  }
}
