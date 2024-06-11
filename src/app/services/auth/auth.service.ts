import { Injectable, OnDestroy } from '@angular/core';

import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";

import { Observable, Subscription, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService) {
    const msalSubscription = this.msalService.initialize().subscribe({
      next: () => this.msalService.instance.getActiveAccount(),
      error: err => console.error('MsalService initialization failed:', err.message)
    });
    this.subscriptions.push(msalSubscription);
  }

  getActiveAccount(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  loginWithMicrosoft(): Observable<AuthenticationResult> {
    return this.msalService.loginPopup().pipe(
      tap(response => {
        this.msalService.instance.setActiveAccount(response.account);
      })
    );
  }

  logout() {
    this.msalService.logoutPopup({
      mainWindowRedirectUri: "/login"
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
