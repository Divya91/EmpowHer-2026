import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User, UserRole } from '../../model/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-signup.html',
  styleUrl: '../signup/signup.css'
})
export class AdminSignup {
  firstName = '';
  lastName = '';
  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router) {}

  onRegister() {
    const payload: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: UserRole.ADMIN
    };

    this.auth.registerUser(payload).subscribe({
      next: () => {
        alert('Admin Registration Successful');
        this.router.navigate(['/login'], { queryParams: { role: 'ADMIN' } });
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed');
      }
    });
  }
}
