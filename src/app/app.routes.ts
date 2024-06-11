import { Routes } from '@angular/router';

import { MsalGuard } from "@azure/msal-angular";

import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";

export const routes: Routes = [
    {
      path: '', component: HomeComponent, pathMatch: "full", canActivate: [MsalGuard]
    },
    {
      path: 'login', component: LoginComponent
    },
    {
      path: '**',
      redirectTo: ''
    }
];
