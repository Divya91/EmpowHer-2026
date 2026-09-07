import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FlightService } from '../../services/flight-service';
import { SearchCriteria } from '../../model/searchCriteria';
import { flightResult } from '../../model/flightResult';
import { Airport } from '../../model/airport';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  private flightService = inject(FlightService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loading = false;
  airports: Airport[] = [];
  allFlights: flightResult[] = [];
  filteredFlights: flightResult[] = [];

  // Search Criteria
  searchCriteria: SearchCriteria = {
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureDate: new Date('2026-07-14'),
    passengers: 1
  };

  // Filters State
  stopsFilter = 'all'; // 'all', 'nonstop', '1stop'
  maxPriceFilter = 610;
  minPriceLimit = 380;
  maxPriceLimit = 610;
  departureTimeFilter = 'all'; // 'all', 'morning', 'afternoon', 'evening'
  
  // Airlines map for checkboxes
  airlineOptions: { code: string, name: string, count: number }[] = [];
  selectedAirlines: { [code: string]: boolean } = {};
  
  // Sort State
  sortBy = 'price-asc'; // 'price-asc', 'price-desc', 'duration', 'departure'

  ngOnInit(): void {
    // Load airports
    this.flightService.getAirports()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => this.airports = list);

    // Initial search on load
    this.searchFlights();
  }

  swapAirports(): void {
    const temp = this.searchCriteria.fromAirport;
    this.searchCriteria.fromAirport = this.searchCriteria.toAirport;
    this.searchCriteria.toAirport = temp;
    this.searchFlights();
  }

  searchFlights(): void {
    this.loading = true;
    this.flightService.searchFlights(this.searchCriteria)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allFlights = response;
          this.calculateLimits();
          this.buildAirlineOptions();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.allFlights = [];
          this.filteredFlights = [];
          this.loading = false;
        }
      });
  }

  calculateLimits(): void {
    if (this.allFlights.length === 0) {
      this.minPriceLimit = 0;
      this.maxPriceLimit = 1000;
      this.maxPriceFilter = 1000;
      return;
    }
    const prices = this.allFlights.map(f => f.basePrice);
    this.minPriceLimit = Math.min(...prices);
    this.maxPriceLimit = Math.max(...prices);
    // Keep max price filter at max limit initially or if it's out of range
    this.maxPriceFilter = this.maxPriceLimit;
  }

  buildAirlineOptions(): void {
    const counts: { [code: string]: number } = {};
    const names: { [code: string]: string } = {};

    this.allFlights.forEach(f => {
      counts[f.airlineCode] = (counts[f.airlineCode] || 0) + 1;
      names[f.airlineCode] = f.airlineName;
    });

    this.airlineOptions = Object.keys(counts).map(code => ({
      code,
      name: names[code],
      count: counts[code]
    }));

    // Initialize all as checked initially or keep previous checks
    this.airlineOptions.forEach(opt => {
      if (this.selectedAirlines[opt.code] === undefined) {
        this.selectedAirlines[opt.code] = false;
      }
    });
  }

  toggleAirline(code: string): void {
    this.selectedAirlines[code] = !this.selectedAirlines[code];
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allFlights];

    // 1. Stops Filter
    if (this.stopsFilter === 'nonstop') {
      result = result.filter(f => f.stops === 0);
    } else if (this.stopsFilter === '1stop') {
      result = result.filter(f => f.stops <= 1);
    }

    // 2. Price Filter
    result = result.filter(f => f.basePrice <= this.maxPriceFilter);

    // 3. Departure Time Filter
    if (this.departureTimeFilter !== 'all') {
      result = result.filter(f => {
        const date = new Date(f.departureTs);
        const hours = date.getHours();
        if (this.departureTimeFilter === 'morning') {
          return hours >= 5 && hours < 12; // 5a - 12p
        } else if (this.departureTimeFilter === 'afternoon') {
          return hours >= 12 && hours < 18; // 12p - 6p
        } else if (this.departureTimeFilter === 'evening') {
          return hours >= 18 && hours < 23; // 6p - 11p
        }
        return true;
      });
    }

    // 4. Airlines Filter
    const activeAirlineCodes = Object.keys(this.selectedAirlines).filter(code => this.selectedAirlines[code]);
    if (activeAirlineCodes.length > 0) {
      result = result.filter(f => activeAirlineCodes.includes(f.airlineCode));
    }

    // 5. Sorting
    if (this.sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (this.sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (this.sortBy === 'duration') {
      result.sort((a, b) => a.durationMins - b.durationMins);
    } else if (this.sortBy === 'departure') {
      result.sort((a, b) => new Date(a.departureTs).getTime() - new Date(b.departureTs).getTime());
    }

    this.filteredFlights = result;
  }

  resetFilters(): void {
    this.stopsFilter = 'all';
    this.maxPriceFilter = this.maxPriceLimit;
    this.departureTimeFilter = 'all';
    Object.keys(this.selectedAirlines).forEach(code => {
      this.selectedAirlines[code] = false;
    });
    this.sortBy = 'price-asc';
    this.applyFilters();
  }

  resetSearch(): void {
    this.searchCriteria = {
      fromAirport: 'JFK',
      toAirport: 'LHR',
      departureDate: new Date('2026-07-14'),
      passengers: 1
    };
    this.searchFlights();
  }

  getMinPriceForStops(stops: number | null): string {
    let subset = this.allFlights;
    if (stops !== null) {
      if (stops === 0) {
        subset = this.allFlights.filter(f => f.stops === 0);
      } else if (stops === 1) {
        subset = this.allFlights.filter(f => f.stops <= 1);
      }
    }
    if (subset.length === 0) return 'N/A';
    const min = Math.min(...subset.map(f => f.basePrice));
    return `$${min}+`;
  }

  viewDetails(flightId: string): void {
    this.router.navigate(['/flight-detail', flightId]);
  }

  bookFlight(flight: flightResult): void {
    this.router.navigate(['/payment'], {
      state: { flight }
    });
  }
}