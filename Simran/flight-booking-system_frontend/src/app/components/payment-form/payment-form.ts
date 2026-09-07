import { CommonModule } from '@angular/common';
import { FlightResults } from '../../models/flightResults';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { PaymentFormService } from '../../services/payment-form-service';

import {
  Booking,
  BookingService
} from '../../services/booking.service';


@Component({
  selector: 'app-payment-form',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule,
    Navbar
  ],

  templateUrl: './payment-form.html',

  styleUrl: './payment-form.css'
})
export class PaymentForm implements OnInit {

  paymentForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  // Store completed booking
  confirmedBooking: Booking | null = null;
  // Show confirmation screen
  showConfirmation = false;
  // Show thank-you popup
  showThankYouPopup = false;
  flight: FlightResults | null = null;
  numberOfPassengers = 1;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private paymentFormService: PaymentFormService,
    private bookingService: BookingService,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.buildForm();

    this.flight =
      this.bookingService.getSelectedFlight();

    this.numberOfPassengers =
      this.bookingService.getNumberOfSeats();

    if (this.flight) {

      this.totalAmount =
        this.flight.price * this.numberOfPassengers;

    }

    console.log('Payment page flight:', this.flight);

    console.log(
      'Number of passengers:',
      this.numberOfPassengers
    );

    console.log(
      'Total amount:',
      this.totalAmount
    );

  }

  buildForm(): void {
    this.paymentForm = this.fb.group({
      cardHolderName: [
        '',
        Validators.required
      ],

      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{16}$')
        ]
      ],

      expiryMonth: [
        '',
        Validators.required
      ],

      expiryYear: [
        '',
        Validators.required
      ],

      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{3}$')
        ]
      ]
    });
  }


  onPaymentSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    const flight =
      this.bookingService.getSelectedFlight();

    const passengerId =
      this.bookingService.getPassengerId();


    if (!flight) {
      this.errorMessage =
        'No flight has been selected.';
      return;
    }
    if (!passengerId) {
      this.errorMessage =
        'Passenger details are missing.';
      return;
    }
    const userJson =
      localStorage.getItem('currentUser');


    if (!userJson) {

      this.errorMessage =
        'Please login before booking a flight.';

      this.router.navigate(['/auth/login']);

      return;
    }


    const user =
      JSON.parse(userJson);


    const numberOfSeats =
      this.bookingService.getNumberOfSeats();


    const amount =
      flight.price * numberOfSeats;


    const payment = {

      ...this.paymentForm.value,

      amount: amount

    };


    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    console.log(
      'Processing payment...'
    );


    // =========================
    // PAYMENT
    // =========================

    this.paymentFormService
      .processPayment(payment)
      .subscribe({

        next: (paymentResponse) => {

          console.log(
            'Payment response:',
            paymentResponse
          );


          if (!paymentResponse.success) {

            this.loading = false;

            this.errorMessage =
              paymentResponse.message;

            return;
          }


          console.log(
            'Payment successful:',
            paymentResponse.transactionId
          );


          // =========================
          // CREATE BOOKING
          // =========================

          const bookingRequest = {

            userId: user.id,

            flightId: flight.id,

            passengerId: passengerId,

            numberOfSeats: numberOfSeats

          };


          console.log(
            'Creating booking:',
            bookingRequest
          );


          this.bookingService
            .createBooking(bookingRequest)
            .subscribe({

              next: (booking) => {

                console.log(
                  'Booking created:',
                  booking
                );


                // IMPORTANT:
                // Store complete booking
                this.confirmedBooking =
                  booking;


                this.loading = false;

                this.successMessage =
                  'Payment successful!';


                // Show confirmation screen
                this.showConfirmation = true;


                // Clear payment form
                this.paymentForm.reset();


                // Show thank-you popup after
                // confirmation screen appears
                setTimeout(() => {

                  this.showThankYouPopup = true;

                }, 1500);


              },


              error: (error) => {

                console.error(
                  'Booking creation failed:',
                  error
                );


                this.loading = false;

                this.errorMessage =
                  'Payment was successful but booking creation failed. Please contact support.';

              }

            });

        },


        error: (error) => {

          console.error(
            'Payment error:',
            error
          );


          this.loading = false;

          this.errorMessage =
            'Payment failed. Please try again.';

        }

      });

  }

  bookAnotherFlight(): void {
  this.showThankYouPopup = false;
  this.bookingService.clearBooking();
  this.router.navigate(['/flight-search']);
}
  goToMyBookings(): void {

    this.showThankYouPopup = false;

    this.bookingService.clearBooking();

    this.router.navigate([
      '/my-bookings'
    ]);

  }
  logout(): void {
    this.bookingService.clearBooking();
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

}