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
    redirectTo: 'flights',
    pathMatch: 'full'
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
    path: 'my-bookings',
    loadComponent: () =>
      import('./booking/my-bookings/my-bookings').then(m => m.MyBookingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    redirectTo: 'my-bookings',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
