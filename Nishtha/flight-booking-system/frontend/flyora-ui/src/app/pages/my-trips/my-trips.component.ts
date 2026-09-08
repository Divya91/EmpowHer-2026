import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Booking } from '../../core/models/booking';
import { BookingService } from '../../core/services/booking.service';
import { Router } from '@angular/router';
export type TripFilter = 'ALL' | 'UPCOMING' | 'PAST' | 'CONFIRMED' | 'CANCELLED';

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

  activeFilter: TripFilter = 'ALL';

  constructor(
  private bookingService: BookingService,
  private router: Router
) {}
  ngOnInit(): void {

  console.log("MyTrips Loaded");

  this.loadBookings();

}

  private isUpcoming(booking: Booking): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(booking.travelDate) >= today;
  }

  get filteredBookings(): Booking[] {
    switch (this.activeFilter) {
      case 'UPCOMING':
        return this.bookings.filter(
          b => b.bookingStatus !== 'CANCELLED' && this.isUpcoming(b)
        );
      case 'PAST':
        return this.bookings.filter(
          b => b.bookingStatus !== 'CANCELLED' && !this.isUpcoming(b)
        );
      case 'CONFIRMED':
        return this.bookings.filter(b => b.bookingStatus === 'CONFIRMED');
      case 'CANCELLED':
        return this.bookings.filter(b => b.bookingStatus === 'CANCELLED');
      default:
        return this.bookings;
    }
  }

  setFilter(filter: TripFilter): void {
    this.activeFilter = filter;
  }

  get filterCounts() {
    return {
      ALL: this.bookings.length,
      UPCOMING: this.bookings.filter(b => b.bookingStatus !== 'CANCELLED' && this.isUpcoming(b)).length,
      PAST: this.bookings.filter(b => b.bookingStatus !== 'CANCELLED' && !this.isUpcoming(b)).length,
      CONFIRMED: this.bookings.filter(b => b.bookingStatus === 'CONFIRMED').length,
      CANCELLED: this.bookings.filter(b => b.bookingStatus === 'CANCELLED').length,
    };
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