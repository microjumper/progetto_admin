import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

import { SidebarModule } from "primeng/sidebar";
import { ToolbarModule } from "primeng/toolbar";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { Subscription } from "rxjs";

import { CalendarComponent } from "../calendar/calendar.component";
import { LegalService } from "../../../../progetto_shared/legalService.type";
import { DraggableComponent } from "../draggable/draggable.component";
import { DataService } from "../../services/data/data.service";
import { AuthService } from "../../services/auth/auth.service";
import { WaitingListComponent } from "../waiting-list/waiting-list.component";

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

  ref: DynamicDialogRef | undefined;

  private subscriptions: Subscription[] = [];

  constructor(private dataService: DataService, private authService: AuthService, public dialogService: DialogService) { }

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
            label: 'Liste d\'attesa',
            icon: 'pi pi-list',
            command: () => this.showDialog()
          },
          {
            label: 'Logout',
            icon: 'pi pi-refresh',
            command: () => this.authService.logout()
          }
        ]
      }
    ];
  }

  private showDialog() {
    return this.ref = this.dialogService.open(WaitingListComponent, {
      dismissableMask: true,
      header: 'Liste d\'attesa',
      modal: true
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
