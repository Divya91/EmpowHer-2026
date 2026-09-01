import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.css',
})
export class FlightResultsComponent implements OnChanges {
  private router = inject(Router);

  @Input() flights: Flight[] = [];
  @Input() passengers = 1;

  cheapestPrice = 0;

  ngOnChanges() {
    if (this.flights.length > 0) {
      this.cheapestPrice = Math.min(...this.flights.map((f) => f.basePrice));
    }
  }

  bookFlight(flight: Flight) {
    this.router.navigate(['/payment', flight.flightId], {
      queryParams: { passengers: this.passengers },
    });
  }
}
