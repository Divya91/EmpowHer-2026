import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth';

const PREFS_KEY = 'meridian.user.preferences';

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
  saving = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userInfo.name = user.name;
      this.userInfo.email = user.email;
    }

    try {
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        this.userInfo = { ...this.userInfo, ...parsed };
        if (user) {
          this.userInfo.name = user.name;
          this.userInfo.email = user.email;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved preferences', e);
    }
  }

  saveProfile(): void {
    if (!this.userInfo.name.trim()) return;

    this.saving = true;

    // 1. Save travel preferences to localStorage
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        phone: this.userInfo.phone,
        dob: this.userInfo.dob,
        passportNumber: this.userInfo.passportNumber,
        passportExpiry: this.userInfo.passportExpiry,
        preferredCabin: this.userInfo.preferredCabin,
        mealPreference: this.userInfo.mealPreference,
        seatPreference: this.userInfo.seatPreference
      }));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }

    // 2. Save user name & email to AuthService and backend
    this.authService.updateProfile(this.userInfo.name.trim(), this.userInfo.email.trim()).subscribe({
      next: (updatedUser) => {
        this.saving = false;
        this.userInfo.name = updatedUser.name;
        this.userInfo.email = updatedUser.email;
        this.saved = true;
        setTimeout(() => {
          this.saved = false;
        }, 4000);
      },
      error: () => {
        this.saving = false;
        this.saved = true;
        setTimeout(() => {
          this.saved = false;
        }, 4000);
      }
    });
  }
}
