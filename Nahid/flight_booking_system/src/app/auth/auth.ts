import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {

  mode: AuthMode = 'login';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {

    const requestedMode = this.route.snapshot.queryParamMap.get('mode');

    if (requestedMode === 'signup') {
      this.mode = 'signup';
    }

  }

  setMode(mode: AuthMode): void {
    this.mode = mode;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    this.errorMessage = '';

    if (this.mode === 'signup' && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    const request$ = this.mode === 'login'
      ? this.authService.login(this.email, this.password)
      : this.authService.signup(this.name, this.email, this.password);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      }
    });

  }

}
