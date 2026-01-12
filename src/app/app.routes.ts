// src/app/app.routes.ts
import { Register } from './register/register';
import { Catalogue } from './catalogue/catalogue';
import { ProfileComponent } from './components/client/profil-client/profil-client';
import { ProfilManager } from './components/manager/profil-manager/profil-manager';
import { AdminGuard } from './guards/admin.guard';
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home';
import {LoginComponent} from './login.component/login.component';
import {RoomDetails} from './room-details/room-details';
import {ReceptionProfile} from './components/reception-profile/reception-profile';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'catalogue', component: Catalogue },
  { path: 'catalogue/profil', component: ProfileComponent },
  { path: 'managerprofil', component: ProfilManager },
  { path: 'room/:id', component: RoomDetails },
  { path: 'reception', component: ReceptionProfile },

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
      },
{
        path: 'roles',
        loadComponent: () =>
          import('./admin/roles/roles')
            .then(m => m.RolesComponent)
      },
      {
  path: 'profile',
  loadComponent: () =>
    import('./admin/admin-profile/admin-profile')
      .then(m => m.AdminProfileComponent)
}

    ]
  },


  {
    path: 'manager',
    loadComponent: () => import('./components/manager/profil-manager/profil-manager').then(m => m.ProfilManager)
  },

  {
    path: 'reception',
    loadComponent: () => import('./components/reception-profile/reception-profile').then(m => m.ReceptionProfile)
  },

  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },

  { path: '**', redirectTo: '' }
];
