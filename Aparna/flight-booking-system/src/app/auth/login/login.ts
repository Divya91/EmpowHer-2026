import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({

      next: (user) => {

        this.isLoading = false;

        this.router.navigate(
          ['/home'],
          {
            queryParams: {
              role: user.role
            }
          }
        );

      },

      error: () => {

        this.isLoading = false;

      }

    });

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
