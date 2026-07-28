import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { PaymentComponent } from './payment/payment.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';

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

  goToPayment(data: any) {
    this.passengerData = data;

    this.currentStep = 2;
  }

  goBack() {
    this.currentStep = 1;
  }

  completeBooking(data: any) {
    this.paymentData = data;

    this.currentStep = 3;
  }
}
