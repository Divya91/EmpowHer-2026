import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Welcome } from './welcome/welcome';
import { FlightSearch } from './flight-search/flight-search';
import { FlightDetail } from './flight-detail/flight-detail';

export const routes: Routes = [
  // 1. Redirect empty root URL directly to the login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Define your actual page route maps
  { path: 'login', component: Login },
  { path: 'welcome', component: Welcome },
  { path: 'flight-search', component: FlightSearch },
  { path: 'flight-detail/:id', component: FlightDetail },
  
  // 3. Wildcard fallback (optional - routes broken URLs back to login)
  { path: '**', redirectTo: 'login' }
];