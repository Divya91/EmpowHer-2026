import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.flights.length > 0) {
      this.cheapestPrice = Math.min(...this.flights.map((f) => f.basePrice));
    }
  }
}
