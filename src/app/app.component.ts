import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SharedModule } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, ButtonModule, ConfirmDialogModule, SharedModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent { }
