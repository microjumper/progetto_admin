import { Component, HostListener } from '@angular/core';

import { SidebarModule } from "primeng/sidebar";

import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  sidebarVisible = true;
  sidebarModal = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sidebarVisible = window.innerWidth > 768;
    this.sidebarModal = true;
  }
}
