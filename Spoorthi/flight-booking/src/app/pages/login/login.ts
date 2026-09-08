import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email ='';
  password = '';
  isLoading = false;

  constructor (private authService: AuthService,private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.login(this.email,this.password).subscribe({
      next:(user:User)=>{
        this.isLoading = false;
        this.router.navigate(['/home'],{queryParams:{role:user.role}});

      },
      error:(err: any)=>{
        this.isLoading = false;
        console.error(err)
      }
    });
}
}
