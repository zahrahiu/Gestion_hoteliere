import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { LoginComponent } from './login.component/login.component';
import {register} from 'node:module';
import {Register} from './register/register';

export const routes: Routes = [
    { path: '', component: HomeComponent } ,
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register }


];
