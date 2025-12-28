// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login.component/login.component';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'manager',
    loadComponent: () => import('./components/manager/manager-dashboard/manager-dashboard').then(m => m.ManagerDashboardComponent)
  },
  {
    path: 'client',
    loadComponent: () => import('./components/client/client-dashboard/client-dashboard').then(m => m.ClientDashboardComponent)
  },

  // Wildcard route
  { path: '**', redirectTo: '' }
];
