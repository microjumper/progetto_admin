import { Component, OnInit } from '@angular/core';

import { SidebarModule } from "primeng/sidebar";

import { CalendarComponent } from "../calendar/calendar.component";

import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DraggableComponent } from "../draggable/draggable.component";
import { DataService } from "../../services/data/data.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent,
    DraggableComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  legalServices: LegalService[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getLegalServices().subscribe({
      next: (legalServices) => {
        this.legalServices = legalServices;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
