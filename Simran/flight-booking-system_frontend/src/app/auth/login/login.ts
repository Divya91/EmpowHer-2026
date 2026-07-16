import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password= '';
  isLoading = false;
  constructor( private authService: Auth, private router: Router) {}
  onSubmit() {
  console.log("Submit button clicked");

  this.router.navigate(['/flight-search']);
}
//   onSubmit() {
//   this.isLoading = true;

//   this.authService.login(this.email, this.password).subscribe({
//     next: (user) => {
//       console.log('Login successful');
//       this.isLoading = false;
//       this.router.navigate(['/flight-search']);
//     },
//     error: (err) => {
//       console.log(err);
//       this.isLoading = false;
//     }
//   });
// }

} 
