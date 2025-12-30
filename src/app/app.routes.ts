import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { LoginComponent } from './login.component/login.component';
import {Register} from './register/register';
import {Catalogue} from './catalogue/catalogue';
import {ProfileComponent} from '../app/components/client/profil-client/profil-client';

export const routes: Routes = [
    { path: '', component: HomeComponent } ,
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register },
    { path: 'catalogue', component: Catalogue },
  { path: 'catalogue/profil', component: ProfileComponent },


  {
    path: 'manager',
    loadComponent: () => import('./components/manager/manager-dashboard/manager-dashboard').then(m => m.ManagerDashboardComponent)
  },

  // Wildcard route
  { path: '**', redirectTo: '' }
];


