import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Booking } from '../../core/models/booking';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.css'
})
export class BookingConfirmationComponent {

  booking!: Booking;

  today = new Date();

  constructor(private router: Router) {

    this.booking = history.state.booking;

    if (!this.booking) {
      this.router.navigate(['/']);
    }

  }

}