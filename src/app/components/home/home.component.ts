import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";

import { SidebarModule } from "primeng/sidebar";

import { CalendarComponent } from "../calendar/calendar.component";
import { AppointmentService } from "../../services/appointment/appointment.service";
import { LegalService } from "../../../../progetto_shared/legalService.type";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  legalServices: LegalService[] = [];

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.appointmentService.getLegalServices().subscribe({
      next: (legalServices) => {
        this.legalServices = legalServices;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
