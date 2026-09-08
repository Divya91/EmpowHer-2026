import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { PassengerFormServices } from '../../services/passenger-formService';

import { BookingService } from '../../services/booking.service';


@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    Navbar
  ],
  templateUrl: './passenger-form.html',
  styleUrl: './passenger-form.css'
})
export class PassengerForm implements OnInit {
  passengerForm!: FormGroup;
  currentStep = 1;
  loading = false;
  errorMessage = '';
  numberOfPassengers = 1;

  constructor(
    private fb: FormBuilder,
    private passengerFormServices: PassengerFormServices,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.numberOfPassengers = this.bookingService.getNumberOfSeats();
  }


  buildForm(): void {
    this.passengerForm = this.fb.group({
      firstName: ['',[ Validators.required, Validators.minLength(2)]],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      dateOfBirth: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ]

    });

  }


  onPassengerSubmit(): void {

    if (this.passengerForm.invalid) {

      this.passengerForm.markAllAsTouched();

      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const passenger = this.passengerForm.value;
    console.log(
      'Saving passenger:',
      passenger
    );
    this.passengerFormServices
      .addPassenger(passenger)
      .subscribe({
        next: (savedPassenger) => {
          console.log(
            'Passenger saved:',
            savedPassenger
          );
          // Store passenger information
          this.bookingService.setPassengerDetails(
            savedPassenger
          );
          // Store passenger ID
          this.bookingService.setPassengerId(
            savedPassenger.id
          );
          this.loading = false;
          this.currentStep = 2;
          console.log('Passenger ID:', savedPassenger.id);
          console.log('Number of passengers:', this.numberOfPassengers);
          // Go to payment
          this.router.navigate(['/payment-form']);
        },
        error: (error) => {
          console.error(
            'Passenger save error:',
            error
          );
          this.loading = false;
          this.errorMessage =
            'Unable to save passenger details. Please try again.';
        }
      });
  }
}