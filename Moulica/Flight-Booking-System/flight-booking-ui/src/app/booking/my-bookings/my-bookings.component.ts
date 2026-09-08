import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelBookingDialogComponent } from '../cancel-booking-dialog/cancel-booking-dialog.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  constructor(private dialog: MatDialog) {}
  bookings = [
    {
      bookingId: 'BK20260001',
      airline: 'IndiGo',
      flightNumber: '6E2451',
      from: 'BLR',
      to: 'DEL',
      departureDate: '25 Jul 2026',
      departureTime: '08:30 AM',
      arrivalTime: '11:15 AM',
      passenger: 'Akhil R',
      seat: '12A',
      price: 4599,
      status: 'Confirmed',
    },

    {
      bookingId: 'BK20260002',
      airline: 'Air India',
      flightNumber: 'AI502',
      from: 'BLR',
      to: 'HYD',
      departureDate: '29 Jul 2026',
      departureTime: '04:00 PM',
      arrivalTime: '05:15 PM',
      passenger: 'Akhil R',
      seat: '7C',
      price: 2899,
      status: 'Confirmed',
    },
  ];

  cancelBooking(booking: any): void {
    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '500px',
      disableClose: true,
      data: booking,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        booking.status = 'Cancelled';

        // Backend API call will go here later
      }
    });
  }
}
