import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
 
const routes: Routes = [
 { path: 'login', component: Login },
 { path: '', redirectTo: 'login', pathMatch: 'full' }
];
 
@NgModule({
 declarations: [],
 imports: [
   CommonModule, FormsModule, RouterModule.forChild(routes), Login
 ]
})
export class AuthModule { }