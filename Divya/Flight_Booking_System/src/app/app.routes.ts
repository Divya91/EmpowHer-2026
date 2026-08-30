import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signup } from './pages/signup/signup';
import { Search } from './pages/search/search';
import { FlightDetail } from './pages/flight-detail/flight-detail';
export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component: Login
    },
    {
        path:'signup',
        component:Signup
    },
    {
        path:'',
        component:Layout,
        children:[
            {
                path:'dashboard',
                component:Dashboard
            }
        ]
    },
    {
        path:'search',
        component: Search
    },
    {
        path: 'flight-detail/:id',
        component: FlightDetail
    }
];
