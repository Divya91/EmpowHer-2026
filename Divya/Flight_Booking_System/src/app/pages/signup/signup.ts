import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { User, UserRole } from '../../model/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
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
      role: UserRole.USER
    };

    this.auth.registerUser(payload).subscribe({
      next: () => {
        alert('Registration Successful');
        this.router.navigate(['/login'], { queryParams: { role: 'USER' } });
      },
      error: (err) => {
        console.error('Registration failed', err);
        alert('Registration failed');
      }
    });
  }
}
