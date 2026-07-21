import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';

const routes: Routes = [
  { path: '', component: Login }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    Login, // standalone component can be imported here
  ],
})
export class AuthModule {}