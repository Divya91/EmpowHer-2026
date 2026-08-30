import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FlightService } from '../../services/flight-service';
import { SearchCriteria } from '../../model/searchCriteria';
import { flightResult } from '../../model/flightResult';
import {Router} from '@angular/router';
@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search {

  private flightService = inject(FlightService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  loading = false;

  flights: flightResult[] = [];

  searchCriteria: SearchCriteria = {
    fromAirport: '',
    toAirport: '',
    departureDate: new Date(),
    passengers: 1
  };

  searchFlights(): void {

    this.loading = true;

    this.flightService.searchFlights(this.searchCriteria)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: (response) => {
          this.flights = response;
          this.loading = false;
        },

        error: (error) => {
          console.error(error);
          this.loading = false;
        }

      });

  }
  viewDetails(flightId: string): void {
  this.router.navigate(['/flight-detail', flightId]);
  }

}