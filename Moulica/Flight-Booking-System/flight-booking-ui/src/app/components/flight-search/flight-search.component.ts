import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlightService } from '../../services/flight.service';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  @Output()
  flightsFound = new EventEmitter<Flight[]>();

  search = {
    from: '',
    to: '',
    date: '',
    passengers: 1,
    stops: '',
  };

  searchFlights() {
    this.flightService.searchFlights(this.search).subscribe({
      next: (response) => {
        console.log(response);

        this.flightsFound.emit(response.content);
      },

      error: (error) => {
        console.error(error);
      },
    });

    console.log('Searching with:', this.search);

    this.flightService.searchFlights(this.search).subscribe({
      next: (response) => {
        console.log('Backend response:', response);

        this.flightsFound.emit(response.content);
      },

      error: (err) => {
        console.error('Search Error:', err);
      },
    });
  }
}
