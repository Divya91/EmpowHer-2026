import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Booking } from '../../core/models/booking';
import { BookingService } from '../../core/services/booking.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.css'
})
export class MyTripsComponent implements OnInit {

  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;

showCancelPopup = false;

  // Toast state (replaces native alert())
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

  constructor(
  private bookingService: BookingService,
  private router: Router
) {}
  ngOnInit(): void {

  console.log("MyTrips Loaded");

  this.loadBookings();

}


  loadBookings() {

  console.log("Calling GET /api/bookings...");

  this.bookingService
    .getBookings()
    .subscribe({

      next: (data) => {

        console.log("Bookings received:", data);

        this.bookings = data;

      },

      error: (err) => {

        console.error("Booking Error:", err);

      }

    });

}

 openCancelPopup(booking: Booking) {

  this.selectedBooking = booking;

  this.showCancelPopup = true;

}

closePopup() {

  this.showCancelPopup = false;

  this.selectedBooking = null;

}

confirmCancelBooking() {

  if (!this.selectedBooking) {
    return;
  }

  this.bookingService
    .cancelBooking(this.selectedBooking.id!)
    .subscribe({

      next: () => {

        this.showToast('Booking Cancelled Successfully ✈', 'success');

        this.closePopup();

        this.loadBookings();

      },

      error: (err) => {

        console.error(err);

        this.showToast('Failed to cancel booking', 'error');

      }

    });

}

  private showToast(message: string, type: 'success' | 'error', duration = 3000) {

    clearTimeout(this.toastTimer);

    this.toast = { message, type };

    this.toastTimer = setTimeout(() => {
      this.toast = null;
    }, duration);

  }

  goToCancelPage(booking: Booking) {

  this.router.navigate(['/cancel-booking'], {
    state: {
      booking: booking
    }
  });

}

}