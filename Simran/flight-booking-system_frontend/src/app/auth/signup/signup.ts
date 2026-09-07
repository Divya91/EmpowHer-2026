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
  selector: 'app-signup',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './signup.html',

  styleUrl: './signup.css'
})
export class Signup implements OnInit {

  signupForm!: FormGroup;

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.signupForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

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
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }


  onSignup(): void {

    if (this.signupForm.invalid) {

      this.signupForm.markAllAsTouched();

      return;
    }


    const name = this.signupForm.value.name;

    const email = this.signupForm.value.email;

    const password = this.signupForm.value.password;

    const confirmPassword =
      this.signupForm.value.confirmPassword;


    // CHECK PASSWORD

    if (password !== confirmPassword) {

      this.errorMessage = 'Passwords do not match';

      return;
    }


    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.authService
      .signup(name, email, password)
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.successMessage =
            'Account created successfully!';

          this.signupForm.reset();


          // Go to login after 1.5 seconds

          setTimeout(() => {

            this.router.navigate(['/auth/login']);

          }, 1500);

        },


        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error.message || 'Signup failed';

        }

      });

  }


  goToLogin(): void {

    this.router.navigate(['/auth/login']);

  }

}