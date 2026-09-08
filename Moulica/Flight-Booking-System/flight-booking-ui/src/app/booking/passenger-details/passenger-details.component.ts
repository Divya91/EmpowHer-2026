import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PassengerService } from '../../services/passenger.service';
import { PassengerRequest } from '../../models/passenger-request';
import { PassengerResponse } from '../../models/passenger-response';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger-details.component.html',
  styleUrl: './passenger-details.component.css',
})
export class PassengerDetailsComponent {
  @Output() continueBooking = new EventEmitter<any>();

  passengerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private passengerService: PassengerService,
  ) {
    // 1️⃣ Create the form first
    this.passengerForm = this.fb.group({
      title: ['', Validators.required],

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z ]+$'),
        ],
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z ]+$'),
        ],
      ],

      gender: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      age: [
        {
          value: '',
          disabled: true,
        },
      ],

      nationality: ['', Validators.required],

      passportNumber: [
        '',
        [Validators.required, Validators.pattern('^[A-Z][0-9]{7}$')],
      ],

      email: ['', [Validators.required, Validators.email]],

      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')],
      ],
    });

    // 2️⃣ AFTER creating the form, listen for DOB changes
    this.passengerForm.get('dateOfBirth')?.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }

      const dob = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();

      const monthDifference = today.getMonth() - dob.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      this.passengerForm.patchValue(
        {
          age: age,
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  continue() {
    console.log(this.passengerForm.value);

    console.log(this.passengerForm.valid);

    console.log(this.passengerForm.errors);

    console.log(this.passengerForm);

    if (this.passengerForm.invalid) {
      console.log(this.passengerForm.controls);

      this.passengerForm.markAllAsTouched();

      return;
    }

    const passenger: PassengerRequest = this.passengerForm.getRawValue();

    this.passengerService.createPassenger(passenger).subscribe({
      next: (response: PassengerResponse) => {
        console.log('Passenger Saved:', response);

        this.continueBooking.emit(response);
      },

      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
