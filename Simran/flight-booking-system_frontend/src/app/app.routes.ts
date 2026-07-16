import { Routes } from '@angular/router';
import { Home } from './home/home';
import { FlightSearch } from './components/flight-search/flight-search';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-module').then(m => m.AuthModule)
  },

  {
    path: 'home',
    component: Home
  },

  {
    path: 'flight-search',
    component: FlightSearch
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }

];