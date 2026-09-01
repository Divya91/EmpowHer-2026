import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
    RouterLink,
    FlightSearchComponent,
    FlightResultsComponent,
    FlightFiltersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private flightService = inject(FlightService);

  userName = '';
  flights: Flight[] = [];
  allFlights: Flight[] = [];
  searchedFlights: Flight[] = [];
  airlines: Flight[] = [];
  maxPriceLimit = 1000;
  passengers = 1;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userName = localStorage.getItem('name') || 'Traveler';
    }
    this.loadAllFlights();
  }

  onFlightsFound(flights: Flight[]) {
    this.searchedFlights = flights;
    this.flights = [...flights];
  }

  onPassengersChanged(count: number) {
    this.passengers = count;
  }

  onFilterChanged(filters: any) {
    let source = this.searchedFlights.length > 0 ? this.searchedFlights : this.allFlights;
    let filtered = [...source];

    if (filters.airline) {
      filtered = filtered.filter((f) => f.airlineCode === filters.airline);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((f) => f.basePrice <= Number(filters.maxPrice));
    }

    switch (filters.sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'departure':
        filtered.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
        break;
      case 'duration':
        filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
    }

    this.flights = filtered;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }

  loadAllFlights() {
    this.flightService.getAllFlights().subscribe({
      next: (response) => {
        this.allFlights = response;
        this.flights = [...response];
        this.maxPriceLimit = Math.max(...response.map((f) => f.basePrice));
        this.airlines = response.filter(
          (f, i, self) => i === self.findIndex((x) => x.airlineCode === f.airlineCode),
        );
      },
      error: (err) => console.error(err),
    });
  }
}
