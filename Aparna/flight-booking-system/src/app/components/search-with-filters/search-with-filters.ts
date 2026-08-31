import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightResultsComponent } from '../flight-results/flight-results.component';
import { FlightResults } from '../../models/flightResults';
import { FlightService } from '../../services/flight.service';

interface FilterState {
  stops: 'any' | 'nonstop' | 'up-to-1';
  priceRange: [number, number];
  departureTime: 'any' | 'morning' | 'afternoon' | 'evening';
  airlines: Set<string>;
  sortBy: 'price-asc' | 'price-desc' | 'departure-asc' | 'duration-asc';
}

@Component({
  selector: 'app-search-with-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, FlightResultsComponent],
  templateUrl: './search-with-filters.html',
  styleUrls: ['./search-with-filters.css']
})
export class SearchWithFilters implements OnInit {
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);

  flights = signal<FlightResults[]>([]);
  loading = signal<boolean>(false);
  searchError = signal<string>('');
  searchPerformed = signal<boolean>(false);

  // Search Bar Inputs
  fromAirport = '';
  toAirport = '';
  departureDate = '';
  passengersCount = 1;

  minPrice = 5000;
  maxPrice = 60000;

  availableAirports = [
    { code: 'DEL', city: 'Delhi' },
    { code: 'BOM', city: 'Mumbai' },
    { code: 'BLR', city: 'Bengaluru' },
    { code: 'CCU', city: 'Kolkata' },
    { code: 'HYD', city: 'Hyderabad' },
    { code: 'MAA', city: 'Chennai' },
    { code: 'GOI', city: 'Goa' },
    { code: 'PNQ', city: 'Pune' },
    { code: 'AMD', city: 'Ahmedabad' },
    { code: 'COK', city: 'Kochi' },
    { code: 'JAI', city: 'Jaipur' },
    { code: 'LHR', city: 'London' },
    { code: 'JFK', city: 'New York' }
  ];

  availableAirlines = [
    { code: '6E', name: 'IndiGo' },
    { code: 'AI', name: 'Air India' },
    { code: 'UK', name: 'Vistara' },
    { code: 'SG', name: 'SpiceJet' },
    { code: 'QP', name: 'Akasa Air' },
    { code: 'I5', name: 'AirAsia India' },
    { code: 'BA', name: 'British Airways' }
  ];

  filters = signal<FilterState>({
    stops: 'any',
    priceRange: [5000, 60000],
    departureTime: 'any',
    airlines: new Set(),
    sortBy: 'price-asc'
  });

  ngOnInit(): void {
    // Don't auto-search. Wait for user to select inputs and press Search.
  }

  executeSearch(): void {
    this.loading.set(true);
    this.searchError.set('');
    this.searchPerformed.set(true);

    const searchCriteria = {
      fromAirport: this.fromAirport ? this.fromAirport.trim() : undefined,
      toAirport: this.toAirport ? this.toAirport.trim() : undefined,
      departureDate: this.departureDate ? new Date(this.departureDate) : undefined,
      passengers: this.passengersCount
    };

    this.flightService.searchFlights(searchCriteria).subscribe({
      next: (results) => {
        this.loading.set(false);
        this.flights.set(results);

        if (results.length > 0) {
          const prices = results.map(r => r.basePrice);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          this.minPrice = Math.floor(min / 1000) * 1000;
          this.maxPrice = Math.ceil(max / 1000) * 1000;
          
          const current = this.filters();
          this.filters.set({
            ...current,
            priceRange: [this.minPrice, this.maxPrice]
          });
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.searchError.set('Could not load flights. Please make sure the backend server is running on port 8081.');
      }
    });
  }

  swapAirports(): void {
    const temp = this.fromAirport;
    this.fromAirport = this.toAirport;
    this.toAirport = temp;
  }

  get filteredFlights(): FlightResults[] {
    const current = this.filters();
    
    let result = this.flights().filter(flight => {
      // Stop filter
      if (current.stops !== 'any') {
        if (current.stops === 'nonstop' && flight.stops !== 0) return false;
        if (current.stops === 'up-to-1' && flight.stops > 1) return false;
      }

      // Price filter
      if (flight.basePrice < current.priceRange[0] || flight.basePrice > current.priceRange[1]) {
        return false;
      }

      // Departure time filter
      if (current.departureTime !== 'any') {
        const hour = new Date(flight.departureTs).getHours();
        if (current.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (current.departureTime === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (current.departureTime === 'evening' && (hour < 17 || hour >= 22)) return false;
      }

      // Airline filter
      if (current.airlines.size > 0 && !current.airlines.has(flight.airlineCode)) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (current.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'departure-asc':
        result.sort((a, b) => new Date(a.departureTs).getTime() - new Date(b.departureTs).getTime());
        break;
      case 'duration-asc':
        result.sort((a, b) => a.durationMins - b.durationMins);
        break;
    }

    return result;
  }

  onStopsChange(value: 'any' | 'nonstop' | 'up-to-1'): void {
    const current = this.filters();
    this.filters.set({ ...current, stops: value });
  }

  onPriceChange(min: number, max: number): void {
    const current = this.filters();
    this.filters.set({ ...current, priceRange: [min, max] });
  }

  onDepartureTimeChange(value: 'any' | 'morning' | 'afternoon' | 'evening'): void {
    const current = this.filters();
    this.filters.set({ ...current, departureTime: value });
  }

  onAirlineToggle(airlineCode: string): void {
    const current = this.filters();
    const newAirlines = new Set(current.airlines);
    if (newAirlines.has(airlineCode)) {
      newAirlines.delete(airlineCode);
    } else {
      newAirlines.add(airlineCode);
    }
    this.filters.set({ ...current, airlines: newAirlines });
  }

  isAirlineSelected(airlineCode: string): boolean {
    return this.filters().airlines.has(airlineCode);
  }

  getAirlineFlightCount(airlineCode: string): number {
    return this.flights().filter(f => f.airlineCode === airlineCode).length;
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value as FilterState['sortBy'];
    const current = this.filters();
    this.filters.set({ ...current, sortBy: value });
  }

  resetFilters(): void {
    this.fromAirport = '';
    this.toAirport = '';
    this.departureDate = '';
    this.passengersCount = 1;
    this.searchPerformed.set(false);
    this.flights.set([]);
    this.filters.set({
      stops: 'any',
      priceRange: [5000, 60000],
      departureTime: 'any',
      airlines: new Set(),
      sortBy: 'price-asc'
    });
  }

  onFlightSelected(flight: FlightResults): void {
    this.router.navigate(['/booking', flight.flightId]);
  }
}
