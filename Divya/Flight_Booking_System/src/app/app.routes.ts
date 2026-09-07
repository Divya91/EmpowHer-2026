import { Routes } from '@angular/router';
import { LandingHome } from './pages/landing-home/landing-home';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signup } from './pages/signup/signup';
import { AdminSignup } from './pages/admin-signup/admin-signup';
import { Search } from './pages/search/search';
import { FlightDetail } from './pages/flight-detail/flight-detail';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { PaymentForm } from './pages/payment-form/payment-form';
import { BookingConfirmation } from './pages/booking-confirmation/booking-confirmation';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landing-home',
        pathMatch: 'full'
    },
    {
        path: 'landing-home',
        component: LandingHome
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'admin-signup',
        component: AdminSignup
    },
    {
        path: '',
        component: Layout,
        children: [
            {
                path: 'home',
                component: Dashboard
            },
            {
                path: 'search',
                component: Search
            },
            {
                path: 'flight-detail/:id',
                component: FlightDetail
            },
            {
                path: 'payment',
                component: PaymentForm
            },
            {
                path: 'booking-confirmed',
                component: BookingConfirmation
            },
            {
                path: 'my-bookings',
                component: MyBookings
            }
        ]
    }
];
