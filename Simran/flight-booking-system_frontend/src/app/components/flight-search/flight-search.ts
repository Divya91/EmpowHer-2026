import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FlightServices } from '../../services/flight.services';
import { SearchCriteria } from '../../models/searchCriteria';
import { FlightResults } from '../../models/flightResults';
import { FlightResultsComponent } from '../flight-results/flight-results';
import { FlightFilterPanel } from '../flight-filter-panel/flight-filter-panel';

@Component({
  selector: 'app-flight-search',
  standalone: true,

  imports: [
    FormsModule,
    FlightResultsComponent,
    FlightFilterPanel
  ],

  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css'
})
export class FlightSearch {

  private flightService = inject(FlightServices);
  private destroyRef = inject(DestroyRef);

  loading = false;

  errorMessage = '';

  flightResults: FlightResults[] = [];

  searchCriteria: SearchCriteria = {
    fromAirport: 'DEL',
    toAirport: 'BOM',
    departureDate: new Date('2026-09-10'),
    passengers: 1
  };


  searchFlights(): void {

  console.log('SEARCH BUTTON CLICKED');
  console.log('Search criteria:', this.searchCriteria);

  this.loading = true;
  this.errorMessage = '';
  this.flightResults = [];

  this.flightService
    .searchFlights(this.searchCriteria)
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({

      next: (results: FlightResults[]) => {

        console.log('RESULT RECEIVED:', results);

        this.flightResults = results;

        // API successfully responded but found no flights
        if (results.length === 0) {
          this.errorMessage = '';
        }

        // Stop spinner immediately
        this.loading = false;
      },

      error: (error) => {

        console.error('FLIGHT SEARCH FAILED:', error);

        // VERY IMPORTANT
        this.loading = false;
        this.flightResults = [];

        if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please make sure Spring Boot is running.';

        } else if (error.status === 404) {

          this.errorMessage =
            'No flights found for the selected route and date.';

        } else if (error.name === 'TimeoutError') {

          this.errorMessage =
            'The server is taking too long to respond. Please try again.';

        } else {

          this.errorMessage =
            'Unable to search flights. Please try again.';
        }
      },

      complete: () => {

        console.log('SEARCH REQUEST COMPLETED');

        this.loading = false;
      }

    });
}


  resetSearch(): void {

    this.searchCriteria = {
      fromAirport: 'DEL',
      toAirport: 'BOM',
      departureDate: new Date('2026-09-10'),
      passengers: 1
    };

    this.flightResults = [];

    this.errorMessage = '';

    this.loading = false;
  }
}