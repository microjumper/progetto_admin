import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

import { SidebarModule } from "primeng/sidebar";
import { ToolbarModule } from "primeng/toolbar";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { Subscription } from "rxjs";

import { CalendarComponent } from "../calendar/calendar.component";
import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DraggableComponent } from "../draggable/draggable.component";
import { DataService } from "../../services/data/data.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SidebarModule,
    CalendarComponent,
    DraggableComponent,
    ToolbarModule,
    RouterLink,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  items: MenuItem[] | undefined;
  legalServices: LegalService[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    const dataSubscription = this.dataService.getLegalServices().subscribe({
      next: (legalServices) => {
        this.legalServices = legalServices;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.initMenu();

    this.subscriptions.push(dataSubscription);
  }

  private initMenu(): void {
    this.items = [
      {
        label: this.authService.getActiveAccount()?.username || 'user',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-refresh',
            command: () => this.authService.logout()
          }
        ]
      }
    ];
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
