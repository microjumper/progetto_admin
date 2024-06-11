import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";

import { Subscription } from "rxjs";

import { AuthService } from "../../services/auth/auth.service";

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
export class LoginComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const authSubscription = this.authService.loginWithMicrosoft().subscribe({
      next: (response) => {
        this.router.navigate(['/']).then();
      },
      error: (error) => {
        console.error(error.message);
      }
    });

    this.subscriptions.push(authSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
