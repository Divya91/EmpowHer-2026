import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'flights',
    loadComponent: () =>
      import('./flights/flights').then(m => m.FlightsComponent)
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth').then(m => m.AuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
