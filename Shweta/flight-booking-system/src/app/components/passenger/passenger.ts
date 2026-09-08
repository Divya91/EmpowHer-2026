import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Passenger } from '../../models/passenger';

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger.html',
  styleUrls: ['./passenger.css']
})
export class PassengerComponent implements OnInit {

  passengerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.passengerForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      lastName: [
        '',
        Validators.required
      ],

      gender: [
        '',
        Validators.required
      ],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      emailId: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      dateOfBirth: [
        '',
        Validators.required
      ],

      aadharNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{12}$')
        ]
      ]

    });

    this.loadDraft();

    this.passengerForm.valueChanges.subscribe(() => {
      this.saveDraft();
    });

  }

  savePassenger() {

    if (this.passengerForm.valid) {

      const passenger: Passenger = this.passengerForm.value;

      console.log(passenger);

      alert("Passenger Details Saved Successfully");

    } else {

      this.passengerForm.markAllAsTouched();

    }

  }

  saveDraft() {

    localStorage.setItem(
      'passengerDraft',
      JSON.stringify(this.passengerForm.value)
    );

  }

  loadDraft() {

    const draft = localStorage.getItem('passengerDraft');

    if (draft) {

      this.passengerForm.patchValue(
        JSON.parse(draft)
      );

    }

  }

}