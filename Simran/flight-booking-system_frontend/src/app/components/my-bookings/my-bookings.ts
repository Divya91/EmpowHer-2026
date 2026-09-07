import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Booking, BookingService } from '../../services/booking.service';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, 
    Navbar,
    RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit {

  bookings: Booking[] = [];

  // This is used by my-bookings.html
  upcomingBookings: Booking[] = [];

  loading = false;
  errorMessage = '';
  cancellingId: number | null = null;

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    const userJson = localStorage.getItem('currentUser');

    if (!userJson) {
      this.errorMessage = 'Please login to view your bookings.';
      return;
    }

    const user = JSON.parse(userJson);

    this.loading = true;
    this.errorMessage = '';

    this.bookingService.getUserBookings(user.id).subscribe({

      next: (bookings) => {

        console.log('User bookings:', bookings);

        this.bookings = bookings;

        // Show only confirmed bookings as upcoming bookings
        this.upcomingBookings = bookings.filter(
          booking => booking.status === 'CONFIRMED'
        );

        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load bookings:', error);

        this.loading = false;
        this.errorMessage = 'Unable to load your bookings.';
      }
    });
  }

  cancelBooking(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) {
      return;
    }

    this.cancellingId = id;

    this.bookingService.cancelBooking(id).subscribe({

      next: (booking) => {

        console.log('Booking cancelled:', booking);

        this.cancellingId = null;

        // Reload bookings after cancellation
        this.loadBookings();
      },

      error: (error) => {

        console.error('Cancellation failed:', error);

        this.cancellingId = null;

        alert('Unable to cancel booking.');
      }
    });
  }
}