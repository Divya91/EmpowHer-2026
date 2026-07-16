import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

import {
  FlightSearchComponent
} from './pages/flight-search/flight-search.component';

import {
  FlightDetailsComponent
} from './pages/flight-details/flight-details.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'flights',
    component: FlightSearchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'flights/:id',
    component: FlightDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: FlightSearchComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN']
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];