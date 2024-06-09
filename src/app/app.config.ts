import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { DatePipe, registerLocaleData } from "@angular/common";
import localeIt from '@angular/common/locales/it';

import { ConfirmationService, MessageService } from "primeng/api";

import { routes } from './app.routes';


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
    ConfirmationService,
    MessageService
  ]
};
