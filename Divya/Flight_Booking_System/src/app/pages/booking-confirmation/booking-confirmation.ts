import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { flightResult } from '../../model/flightResult';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css',
})
export class BookingConfirmation {
  flight: flightResult | null = null;
  amount = 0;
  bookingRef = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.flight = nav.extras.state['flight'] ?? null;
      this.amount = nav.extras.state['amount'] ?? 0;
      this.bookingRef = nav.extras.state['bookingRef'] ?? '';
    }
  }
}
