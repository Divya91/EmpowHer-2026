import { Routes } from '@angular/router';

import { PassengerComponent } from './pages/passenger/passenger.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PaymentComponent } from './pages/payment/payment.component';

import { FlightSearchComponent } from './pages/flight-search/flight-search.component';
import { FlightDetailsComponent } from './pages/flight-details/flight-details.component';

import { ChatbotComponent } from './pages/chatbot/chatbot.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { BookingConfirmationComponent } from './pages/booking-confirmation/booking-confirmation.component';
import { MyTripsComponent } from './pages/my-trips/my-trips.component';

import { AdminComponent } from './pages/admin/admin.component';


export const routes: Routes = [

  // ================= HOME =================

  {
    path: '',
    redirectTo: 'flights',
    pathMatch: 'full'
  },


  // ================= ADMIN =================

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN']
    }
  },


  // ================= USER =================

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
    path: 'my-trips',
    component: MyTripsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'assistant',
    component: ChatbotComponent,
    canActivate: [authGuard]
  },


  // ================= AUTH =================

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },


  // ================= BOOKING =================

  {
    path: 'passenger',
    component: PassengerComponent,
    canActivate: [authGuard]
  },

  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [authGuard]
  },

  {
    path: 'booking-confirmation',
    component: BookingConfirmationComponent,
    canActivate: [authGuard]
  },


  // ================= ERROR =================

  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },


  // ================= FALLBACK =================

  {
    path: '**',
    redirectTo: ''
  }

];