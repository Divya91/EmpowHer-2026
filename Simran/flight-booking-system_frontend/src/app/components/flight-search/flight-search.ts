import { Component, DestroyRef, inject } from '@angular/core';
import { FlightServices } from '../../services/flight.services';
import { SearchCriteria } from '../../models/searchCriteria';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlightResults } from '../../models/flightResults';
import { FlightResultsComponent } from '../flight-results/flight-results';

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, FlightResultsComponent],
  standalone: true,
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css',
})
export class FlightSearch {
  flightService = inject(FlightServices);
  destroyRef = inject(DestroyRef);
  loading = false;
  flightResults: FlightResults[] = [];

  searchCriteria: SearchCriteria = {
    fromAirport: 'JFK',
    toAirport: 'LAX',
    departureDate: new Date('2026-06-07'),
    passengers: 1,
  };

  searchFlights() {
    this.loading = true;
    this.flightService.searchFlights(this.searchCriteria)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((flightResults: FlightResults[]) => {
      this.flightResults = flightResults;
      this.loading = false;
    });
  }
}
