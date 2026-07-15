import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Flight,
  FlightService
} from '../../core/services/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css'
})
export class FlightSearchComponent implements OnInit {

  airports: string[] = [];

  flights: Flight[] = [];
  filteredFlights: Flight[] = [];

  from = '';
  to = '';
  travelDate = '';
  cabinClass = 'ECONOMY';

  isLoading = false;
  searched = false;
  errorMessage = '';

  selectedAirlines: string[] = [];
  selectedTime = 'ANY';
  selectedMaxPrice = 20000;
  maxPrice = 20000;
  sortBy = 'LOWEST_PRICE';

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.flightService.getAirports().subscribe({
      next: airports => {
        this.airports = airports;
      },
      error: () => {
        this.errorMessage = 'Unable to load airports.';
      }
    });
  }

  searchFlights(): void {

    this.errorMessage = '';
    this.searched = false;

    if (!this.from || !this.to || !this.travelDate || !this.cabinClass) {
      this.errorMessage = 'Please fill all search fields.';
      return;
    }

    if (this.from === this.to) {
      this.errorMessage =
        'Departure and destination airports cannot be the same.';
      return;
    }

    this.isLoading = true;

    this.flightService.searchFlights(
      this.from,
      this.to,
      this.travelDate,
      this.cabinClass
    ).subscribe({
      next: flights => {
        this.flights = flights;
        this.filteredFlights = [...flights];

        if (flights.length > 0) {

  this.maxPrice = Math.ceil(
    Math.max(...flights.map(flight => flight.price))
  );

  this.selectedMaxPrice = this.maxPrice;

} else {

  this.maxPrice = 20000;
  this.selectedMaxPrice = 20000;

}

        this.isLoading = false;
        this.searched = true;

        this.applyFilters();
      },
      error: () => {
        this.isLoading = false;
        this.searched = true;
        this.errorMessage = 'Unable to search flights.';
      }
    });
  }

  get airlines(): string[] {
    return [...new Set(this.flights.map(flight => flight.airline))];
  }

  toggleAirline(airline: string): void {
    if (this.selectedAirlines.includes(airline)) {
      this.selectedAirlines =
        this.selectedAirlines.filter(item => item !== airline);
    } else {
      this.selectedAirlines.push(airline);
    }

    this.applyFilters();
  }

  applyFilters(): void {

    let result = [...this.flights];

    if (this.selectedAirlines.length > 0) {
      result = result.filter(flight =>
        this.selectedAirlines.includes(flight.airline)
      );
    }

    result = result.filter(
      flight => flight.price <= this.selectedMaxPrice
    );

    if (this.selectedTime !== 'ANY') {
      result = result.filter(flight =>
        this.matchesTimeFilter(
          flight.departureTime,
          this.selectedTime
        )
      );
    }

    result.sort((first, second) => {
      if (this.sortBy === 'LOWEST_PRICE') {
        return first.price - second.price;
      }

      if (this.sortBy === 'EARLIEST_DEPARTURE') {
        return first.departureTime.localeCompare(
          second.departureTime
        );
      }

      if (this.sortBy === 'LATEST_DEPARTURE') {
        return second.departureTime.localeCompare(
          first.departureTime
        );
      }

      return 0;
    });

    this.filteredFlights = result;
  }

  resetFilters(): void {

  this.selectedAirlines = [];

  this.selectedTime = 'ANY';

  this.sortBy = 'LOWEST_PRICE';

  this.selectedMaxPrice = this.maxPrice;

  this.applyFilters();

}

  viewDetails(flight: Flight): void {
    this.router.navigate(
      ['/flights', flight.id],
      {
        state: {
          flight
        }
      }
    );
  }

  private matchesTimeFilter(
    departureTime: string,
    filter: string
  ): boolean {

    const hour = Number(departureTime.split(':')[0]);

    if (filter === 'MORNING') {
      return hour >= 5 && hour < 12;
    }

    if (filter === 'AFTERNOON') {
      return hour >= 12 && hour < 18;
    }

    if (filter === 'EVENING') {
      return hour >= 18 && hour < 23;
    }

    return true;
  }
}