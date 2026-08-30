import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { authGuard } from './auth/auth.guard';

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
    path: 'flights/search-with-filters',
    loadComponent: () =>
      import('./components/search-with-filters/search-with-filters').then(m => m.SearchWithFilters)
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth').then(m => m.AuthComponent)
  },
  {
    path: 'booking/:flightId',
    loadComponent: () =>
      import('./booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'booking-confirmation/:ticketId',
    loadComponent: () =>
      import('./booking/booking-confirmation/booking-confirmation').then(m => m.BookingConfirmationComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
