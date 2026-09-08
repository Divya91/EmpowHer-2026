import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  isLoading = false;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required
        ]
      ]

    });
  }

  onLogin(): void {

    // Clear previous error
    this.errorMessage = '';

    // Check form validation
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log('Login request started');

    this.authService.login(email, password).subscribe({

      // =========================
      // LOGIN SUCCESS
      // =========================
      next: (user) => {

        console.log('Login successful:', user);

        localStorage.setItem(
          'currentUser',
          JSON.stringify(user)
        );

        this.isLoading = false;

        // ADMIN
        if (user.role === 'ADMIN') {

          this.router.navigate(['/admin-dashboard']);

        }

        // PASSENGER
        else {

          this.router.navigate(['/flight-search']);

        }
      },

      // =========================
      // LOGIN FAILED
      // =========================
      error: (error) => {

        console.error('Login failed:', error);

        // VERY IMPORTANT
        // Stop loading immediately
        this.isLoading = false;

        // Wrong email/password
        if (error.status === 401) {

          this.errorMessage =
            'Incorrect email or password. Please try again.';

        }

        // Other server errors
        else if (error.status === 400) {

          this.errorMessage =
            'Invalid login request. Please check your details.';

        }

        // Backend not running / connection problem
        else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please make sure Spring Boot is running.';

        }

        // Any unexpected error
        else {

          this.errorMessage =
            'Something went wrong. Please try again.';
        }
      }

    });
  }

  goToSignup(): void {

    this.router.navigate(['/auth/signup']);

  }
}