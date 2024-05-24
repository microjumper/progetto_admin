import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";

import { SidebarModule } from "primeng/sidebar";

import { CalendarComponent } from "../calendar/calendar.component";
import { EventService } from "../../services/event/event.service";
import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DraggableComponent } from "../draggable/draggable.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent,
    NgForOf,
    DraggableComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  legalServices: LegalService[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getLegalServices().subscribe({
      next: (legalServices) => {
        this.legalServices = legalServices;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}