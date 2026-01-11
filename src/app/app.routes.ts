// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login.component/login.component';
import { Register } from './register/register';
import { Catalogue } from './catalogue/catalogue';
import { ProfileComponent } from './components/client/profil-client/profil-client';
import { ProfilManager } from './components/manager/profil-manager/profil-manager';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'catalogue', component: Catalogue },
  { path: 'catalogue/profil', component: ProfileComponent },
  { path: 'managerprofil', component: ProfilManager },
  
  // Route Admin
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.Admin),
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/user-list/user-list')
            .then(m => m.UserListComponent)
      },
      // SUPPRIMEZ OU COMMENTEZ CETTE LIGNE :
       {
      path: 'users/edit/:id',
      loadComponent: () =>
        import('./admin/edit-user/edit-user')
          .then(m => m.EditUserComponent)
    },
      {
        path: 'users/add',
        loadComponent: () =>
          import('./admin/add-user/add-user')
            .then(m => m.AddUserComponent)
      }
    ]
  },

  {
    path: 'manager',
    loadComponent: () => import('./components/manager/manager-dashboard/manager-dashboard').then(m => m.ManagerDashboardComponent)
  },

  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },

  { path: '**', redirectTo: '' }
];