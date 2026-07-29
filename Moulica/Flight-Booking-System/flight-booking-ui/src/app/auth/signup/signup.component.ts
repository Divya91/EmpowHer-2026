import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { SignupRequest } from '../../model/signup-request';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  passwordStrength = '';
  passwordStrengthClass = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[A-Za-z ]+$'),
          ],
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[A-Za-z ]+$'),
          ],
        ],

        email: ['', [Validators.required, Validators.email]],

        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
        ],

        password: ['', [Validators.required, Validators.minLength(8)]],

        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    this.signupForm.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordStrength(value);
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true,
      };
    }

    return null;
  }

  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const request: SignupRequest = {
      firstName: this.signupForm.value.firstName,

      lastName: this.signupForm.value.lastName,

      email: this.signupForm.value.email,

      phoneNumber: this.signupForm.value.phoneNumber,

      password: this.signupForm.value.password,
    };

    this.authService.signup(request).subscribe({
      next: (response) => {
        console.log(response);

        this.isLoading = false;

        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        this.router.navigate(['/login']);
      },

      error: (error) => {
        this.isLoading = false;

        this.snackBar.open(error.error || 'Signup Failed', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        console.error(error);
      },
    });
  }

  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = '';
      this.passwordStrengthClass = '';
      return;
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      this.passwordStrength = 'Weak';
      this.passwordStrengthClass = 'weak';
    } else if (score <= 4) {
      this.passwordStrength = 'Medium';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrength = 'Strong';
      this.passwordStrengthClass = 'strong';
    }
  }
}
