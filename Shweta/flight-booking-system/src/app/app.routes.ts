import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { MyBookingsComponent } from './components/booking/booking';

export const routes: Routes = [
  {
    path: 'bookings',
    component: MyBookingsComponent
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'bookings',
    pathMatch: 'full'
  }
];
