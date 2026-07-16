import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';

  password = '';

  errorMessage = '';

  loading = false;

  private auth = inject(AuthService);

  private router = inject(Router);

  login() {

    this.loading = true;

    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({

      next: (user: any) => {

        this.loading = false;

        this.router.navigate(['/home'], {

          queryParams: {

            role: user.role

          }

        });

      },

      error: (err: any) => {

        this.loading = false;

        this.errorMessage = err.message;

      }

    });

  }

}