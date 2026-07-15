import { Component, DestroyRef, inject } from '@angular/core';
import { FlightService } from '../../services/flight.service';
import { SearchCriteria } from '../../models/searchCriteria';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlightResults } from '../../models/flightResults';
import { FlightResultsComponent } from "../flight-results/flight-results.component";

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, FlightResultsComponent],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent {
  flightService = inject(FlightService);
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
