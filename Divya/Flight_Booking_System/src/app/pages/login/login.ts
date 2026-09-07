import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { UserRole } from '../../model/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}



  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        if (response && response.userId) {
          alert(`Login Successful! Welcome back, ${response.firstName} (${response.role})`);
          this.router.navigate(['/home']);
        } else {
          alert('Invalid Response from Server');
        }
      },
      error: (err: any) => {
        console.error('Login error', err);
        alert('Invalid Email or Password');
      }
    });
  }
}
