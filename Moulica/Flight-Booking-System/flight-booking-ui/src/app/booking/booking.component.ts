import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';

import { BookingService } from '../services/booking.service';
import { BookingResponse } from '../models/booking-response';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PassengerDetailsComponent,
    PaymentComponent,
    BookingSuccessComponent,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  currentStep = 1;

  passengerData: any;
  paymentData: any;
  bookingData: any;

  bookingId: number | null = null;
  bookingCode: string = '';

  flightId: number = 0;

  // Use the same amount shown by your booking system
  totalAmount = 4599;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
  ) {
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
  }

  goToPayment(data: any) {
    this.passengerData = data;

    console.log('Passenger Data:', data);
    console.log('Flight ID:', this.flightId);

    const bookingRequest = {
      userId: 1, // temporary; later take this from logged-in user
      flightId: this.flightId,
      totalAmount: this.totalAmount,
    };

    console.log('Creating booking:', bookingRequest);

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (response: BookingResponse) => {
        console.log('Booking Created:', response);

        this.bookingData = response;

        this.bookingId = response.bookingId;
        this.bookingCode = response.bookingCode;

        this.currentStep = 2;
      },

      error: (error) => {
        console.error('Booking creation failed:', error);
      },
    });
  }

  goBack() {
    this.currentStep = 1;
  }

  completeBooking(data: any) {
    this.paymentData = data;

    console.log('Payment completed:', data);

    this.currentStep = 3;
  }
}
