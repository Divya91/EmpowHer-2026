import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  protected readonly authService = inject(AuthService);

  userInfo = {
    name: '',
    email: '',
    phone: '+1 (555) 234-5678',
    dob: '1992-08-15',
    passportNumber: 'N84930219',
    passportExpiry: '2030-10-25',
    preferredCabin: 'Economy',
    mealPreference: 'Standard',
    seatPreference: 'Window'
  };

  saved = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userInfo.name = user.name;
      this.userInfo.email = user.email;
    }
  }

  saveProfile(): void {
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }
}
