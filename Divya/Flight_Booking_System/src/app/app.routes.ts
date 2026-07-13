import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signup } from './pages/signup/signup';
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
    }
];
