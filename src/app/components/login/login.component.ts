import { Component } from '@angular/core';

import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor() { }

  login(): void {

  }
}
