import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../../model/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';

  showPassword = false;
  rememberMe = false;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  login() {
    console.log('Login button clicked');
    this.isLoading = true;

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    console.log(request);

    this.authService.login(request).subscribe({
      next: (response) => {
        this.isLoading = false;

        localStorage.setItem('token', response.token);
        localStorage.setItem('name', response.name);
        localStorage.setItem('email', response.email);
        localStorage.setItem('role', response.role);

        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        this.router.navigate(['/home']);
      },

      error: (error) => {
        this.isLoading = false;

        this.snackBar.open('Invalid Email or Password', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        console.error(error);
      },
    });
  }
}
