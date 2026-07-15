import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful. Please login.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: error => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Registration failed. Please try again.';
      }
    });
  }
}