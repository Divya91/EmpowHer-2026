import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../core/models/booking';
import { BookingService } from '../../core/services/booking';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings implements OnInit {

  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {

    this.bookingService.getBookings().subscribe(data => {
      this.bookings = data;
    });

  }

  get upcomingBookings() {
    return this.bookings.filter(
      b => b.status === 'CONFIRMED' || b.status === 'CANCEL_REQUESTED'
    );
  }

  get pastBookings() {
    return this.bookings.filter(
      b => b.status === 'COMPLETED'
    );
  }

  get cancellationRequests() {
    return this.bookings.filter(
      b => b.status === 'CANCEL_REQUESTED'
    );
  }

}