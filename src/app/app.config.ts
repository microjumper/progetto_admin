import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { DatePipe, registerLocaleData } from "@angular/common";
import localeIt from '@angular/common/locales/it';

import { ConfirmationService, MessageService } from "primeng/api";

import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from "@azure/msal-browser";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard, MsalGuardConfiguration,
  MsalInterceptor,
  MsalService
} from "@azure/msal-angular";

import { routes } from './app.routes';
import { environment } from "../environments/environment";


registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: LOCALE_ID, useValue: 'it-IT',
    },
    {
      provide: DatePipe
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      useValue: {
        interactionType: 'popup'
      },
      multi: true
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    ConfirmationService,
    MessageService
  ]
};

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      redirectUri: '/',
      postLogoutRedirectUri: '/login'
    },
    cache: {
      cacheLocation : BrowserCacheLocation.LocalStorage
    }
  });
}
function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: [ 'User.Read' ]
    },
    loginFailedRoute: '/login'
  };
}
