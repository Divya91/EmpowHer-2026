import { Routes } from '@angular/router';
import { PassengerComponent } from './pages/passenger/passenger.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { PaymentComponent } from './pages/payment/payment.component';
import {
  FlightSearchComponent
} from './pages/flight-search/flight-search.component';
import {
  FlightDetailsComponent
} from './pages/flight-details/flight-details.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { BookingConfirmationComponent } from './pages/booking-confirmation/booking-confirmation.component';
import { MyTripsComponent } from './pages/my-trips/my-trips.component';
export const routes: Routes = [
  {
  path: '',
  redirectTo: 'flights',
  pathMatch: 'full'
},
{
  path: 'assistant',
  component: ChatbotComponent
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
{
  path: 'my-trips',
  component: MyTripsComponent,
  canActivate: [authGuard]
},
  {
    path: '**',
    redirectTo: ''
  }
];