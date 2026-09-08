import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { SignupRequest } from '../../model/signup-request';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  signup() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;

    const request: SignupRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService.signup(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(response.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.error?.message || 'Signup failed. Please try again.';
        alert(message);
      },
    });
  }
}
