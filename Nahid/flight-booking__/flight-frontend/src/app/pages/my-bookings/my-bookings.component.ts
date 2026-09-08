import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../model/booking';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  bookings: Booking[] = [];
  isLoading = true;
  cancellingRef: string | null = null;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load bookings');
      },
    });
  }

  cancelBooking(reference: string) {
    if (!confirm('Cancel this booking? Refund will be processed in 5-7 days.')) return;

    this.cancellingRef = reference;
    this.bookingService.cancelBooking(reference).subscribe({
      next: (res) => {
        this.cancellingRef = null;
        alert(res.message || 'Booking cancelled');
        this.loadBookings();
      },
      error: (err) => {
        this.cancellingRef = null;
        alert(err.error?.message || 'Could not cancel booking');
      },
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
