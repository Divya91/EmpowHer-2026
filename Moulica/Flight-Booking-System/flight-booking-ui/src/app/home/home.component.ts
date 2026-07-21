import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FlightSearchComponent } from '../components/flight-search/flight-search.component';
import { FlightResultsComponent } from '../components/flight-results/flight-results.component';
import { Flight } from '../model/flight';
import { FlightFiltersComponent } from './flight-filters/flight-filters.component';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FlightSearchComponent,
    FlightResultsComponent,
    FlightFiltersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userName: string = '';

  flights: any[] = [];
  allFlights: Flight[] = [];
  searchedFlights: Flight[] = [];
  airlines: any[] = [];
  maxPriceLimit = 1000;

  constructor(
    private router: Router,
    private flightService: FlightService,
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') || 'User';

    this.loadAllFlights();
  }

  onFlightsFound(flights: Flight[]): void {
    this.searchedFlights = flights;

    this.flights = [...flights];
  }

  onFilterChanged(filters: any): void {
    console.log(filters);

    // If user searched, filter search results.
    // Otherwise filter all flights.
    let source =
      this.searchedFlights.length > 0 ? this.searchedFlights : this.allFlights;

    let filteredFlights = [...source];

    // Airline
    if (filters.airline) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.airlineCode === filters.airline,
      );
    }

    // Price
    if (filters.maxPrice) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.basePrice <= Number(filters.maxPrice),
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'priceLow':
        filteredFlights.sort((a, b) => a.basePrice - b.basePrice);

        break;

      case 'priceHigh':
        filteredFlights.sort((a, b) => b.basePrice - a.basePrice);

        break;

      case 'departure':
        filteredFlights.sort(
          (a, b) =>
            new Date(a.departureTime).getTime() -
            new Date(b.departureTime).getTime(),
        );

        break;

      case 'duration':
        filteredFlights.sort((a, b) => a.durationMinutes - b.durationMinutes);

        break;
    }

    this.flights = filteredFlights;
  }
  logout(): void {
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  loadAllFlights(): void {
    this.flightService.getAllFlights().subscribe({
      next: (response) => {
        this.allFlights = response;

        this.flights = [...response];
        this.maxPriceLimit = Math.max(
          ...response.map((flight) => flight.basePrice),
        );
        this.airlines = response.filter(
          (flight, index, self) =>
            index ===
            self.findIndex((f) => f.airlineCode === flight.airlineCode),
        );
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
}
