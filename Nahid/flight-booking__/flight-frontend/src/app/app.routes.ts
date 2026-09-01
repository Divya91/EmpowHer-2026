import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { BookingConfirmationComponent } from './pages/booking-confirmation/booking-confirmation.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'payment/:flightId', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'confirmation/:reference', component: BookingConfirmationComponent, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
