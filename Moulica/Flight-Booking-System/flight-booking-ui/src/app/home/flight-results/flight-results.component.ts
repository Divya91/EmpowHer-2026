import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../models/flight';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.css',
})
export class FlightResultsComponent implements OnChanges {
  @Input()
  flights: Flight[] = [];

  cheapestPrice = 0;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.flights.length > 0) {
      this.cheapestPrice = Math.min(...this.flights.map((f) => f.basePrice));
    }
  }

  bookFlight(flight: Flight): void {
    this.router.navigate(['/booking', flight.flightId]);
  }
}
