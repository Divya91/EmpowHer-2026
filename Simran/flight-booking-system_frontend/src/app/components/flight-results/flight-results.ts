import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FlightResults } from '../../models/flightResults';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-flight-results',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './flight-results.html',
  styleUrl: './flight-results.css'
})
export class FlightResultsComponent {

  @Input() flightResults: FlightResults[] = [];

  @Input() numberOfPassengers = 1;

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  selectFlight(flight: FlightResults): void {

    console.log('Selected flight:', flight);

    console.log(
      'Number of passengers:',
      this.numberOfPassengers
    );

    // Save selected flight
    this.bookingService.setSelectedFlight(flight);

    // Save passenger count
    this.bookingService.setNumberOfSeats(
      this.numberOfPassengers
    );

    // Go to passenger form
    this.router.navigate(['/passenger-form']);

  }
}