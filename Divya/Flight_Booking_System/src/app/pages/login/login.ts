import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { UserRole } from '../../model/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  role: UserRole = UserRole.USER;

  UserRole = UserRole;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onLogin() {

    const user = this.auth.login(
      this.email,
      this.password,
      this.role
    );

    if (user) {

      alert('Login Successful');

      if (user.role === UserRole.ADMIN) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }

    } else {
      alert('Invalid Email, Password or Role');
    }
  }
}
