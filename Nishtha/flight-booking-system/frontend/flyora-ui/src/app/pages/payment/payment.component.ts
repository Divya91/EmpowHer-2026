import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../core/models/payment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  payment: Payment = {
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: 0
  };

  // Toast state (replaces native alert())
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any;

 constructor(
  private paymentService: PaymentService,
  private bookingService: BookingService,
  private router: Router
) {

  const flight = history.state.flight;

  if (flight) {
    this.payment.amount = flight.price;
  }

}

  makePayment(form: NgForm) {

  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  this.paymentService.savePayment(this.payment)
    .subscribe({

      next: () => {

        const passenger = history.state.passenger;
        const flight = history.state.flight;

        const booking: Booking = {

          bookingId:
            "FY" +
            Math.floor(100000 + Math.random() * 900000),

          passengerName:
            passenger.firstName + " " + passenger.lastName,

          airline: flight.airline,

          flightNumber: flight.flightNumber,

          fromAirport: flight.fromAirport,

          toAirport: flight.toAirport,

          travelDate: flight.travelDate,

          departureTime: flight.departureTime,

          seatNumber: this.generateSeat(),

          amount: this.payment.amount,

          paymentStatus: "SUCCESS",

          bookingStatus: "CONFIRMED"

        };

        this.bookingService
          .saveBooking(booking)
          .subscribe({

            next: (savedBooking) => {

              this.router.navigate(
                ['/booking-confirmation'],
                {
                  state: {
                    booking: savedBooking
                  }
                }
              );

            },

            error: (err) => {

              console.error(err);

              this.showToast('Booking failed', 'error');

            }

          });

      },

      error: () => {

        this.showToast('Payment Failed', 'error');

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

generateSeat(): string {

  const row =
    Math.floor(Math.random() * 30) + 1;

  const seats =
    ['A', 'B', 'C', 'D', 'E', 'F'];

  const seat =
    seats[Math.floor(Math.random() * 6)];

  return row + seat;

}

  onlyLetters(event: KeyboardEvent) {

    if (!/^[A-Za-z ]$/.test(event.key)) {
      event.preventDefault();
    }

  }

  onlyNumbers(event: KeyboardEvent) {

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }

  }

  limitCardNumber(event: Event) {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    input.value = value;

    this.payment.cardNumber = value;

  }

  limitCVV(event: Event) {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (value.length > 3) {
      value = value.substring(0, 3);
    }

    input.value = value;

    this.payment.cvv = value;

  }

  formatExpiry(event: Event) {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    // Month validation
    if (value.length >= 2) {

      let month = Number(value.substring(0, 2));

      if (month > 12) {
        month = 12;
      }

      if (month === 0) {
        month = 1;
      }

      value =
        month.toString().padStart(2, '0') +
        value.substring(2);

    }

    if (value.length >= 3) {

      value =
        value.substring(0, 2) +
        "/" +
        value.substring(2);

    }

    input.value = value;

    this.payment.expiryDate = value;

  }

  isExpiryValid(): boolean {

    if (!this.payment.expiryDate) {
      return false;
    }

    const parts = this.payment.expiryDate.split('/');

    if (parts.length !== 2) {
      return false;
    }

    const month = Number(parts[0]);
    const year = Number(parts[1]);

    if (month < 1 || month > 12) {
      return false;
    }

    const today = new Date();

    const currentMonth = today.getMonth() + 1;

    const currentYear =
      Number(today.getFullYear().toString().slice(-2));

    if (year < currentYear) {
      return false;
    }

    if (
      year === currentYear &&
      month < currentMonth
    ) {
      return false;
    }

    return true;

  }

}