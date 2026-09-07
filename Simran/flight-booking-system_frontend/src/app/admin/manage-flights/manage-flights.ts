import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  AdminFlight,
  AdminService
} from '../../services/admin.services';

import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-manage-flights',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './manage-flights.html',

  styleUrl: './manage-flights.css'
})
export class ManageFlights implements OnInit {

  flights: AdminFlight[] = [];

  flightForm!: FormGroup;

  showForm = false;

  editMode = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.createForm();

    this.loadFlights();
  }


  createForm(): void {

    this.flightForm = this.fb.group({

      flightId: [
        '',
        Validators.required
      ],

      airline: [
        '',
        Validators.required
      ],

      fromAirport: [
        '',
        Validators.required
      ],

      toAirport: [
        '',
        Validators.required
      ],

      departureTime: [
        '',
        Validators.required
      ],

      arrivalTime: [
        '',
        Validators.required
      ],

      duration: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      stops: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      price: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      availableSeats: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]

    });
  }


  loadFlights(): void {

    this.adminService
      .getFlights()
      .subscribe(flights => {

        this.flights = flights;

      });
  }


  openAddForm(): void {

    this.editMode = false;

    this.showForm = true;

    this.flightForm.reset({
      stops: 0,
      duration: 0,
      price: 0,
      availableSeats: 0
    });
  }


  editFlight(flight: AdminFlight): void {

    this.editMode = true;

    this.showForm = true;

    this.flightForm.patchValue(flight);
  }


  saveFlight(): void {

    if (this.flightForm.invalid) {

      this.flightForm.markAllAsTouched();

      return;
    }

    const flight =
      this.flightForm.value as AdminFlight;


    if (this.editMode) {

      this.adminService.updateFlight(flight);

    } else {

      this.adminService.addFlight(flight);

    }


    this.loadFlights();

    this.showForm = false;

    this.flightForm.reset();

  }


  deleteFlight(flightId: string): void {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this flight?'
      );

    if (!confirmDelete) {
      return;
    }

    this.adminService.deleteFlight(flightId);

    this.loadFlights();
  }


  cancelForm(): void {

    this.showForm = false;

    this.flightForm.reset();

  }

}