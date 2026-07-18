import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule]
})
export class Login {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

 onLogin() {
  if (this.username.trim() && this.password.trim()) {
    this.authService.login(this.username); // Pass both arguments here
    this.router.navigate(['/welcome']);
  }
}
}