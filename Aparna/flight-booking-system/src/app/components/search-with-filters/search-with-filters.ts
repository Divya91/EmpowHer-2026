import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightResultsComponent } from '../flight-results/flight-results.component';
import { FlightResults } from '../../models/flightResults';
import { MOCK_FLIGHTS } from '../flight-results/flight-results.component';

interface FilterState {
  stops: 'any' | 'nonstop' | 'up-to-1';
  priceRange: [number, number];
  departureTime: 'any' | 'morning' | 'afternoon' | 'evening';
  airlines: Set<string>;
}

@Component({
  selector: 'app-search-with-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, FlightResultsComponent],
  templateUrl: './search-with-filters.html',
  styleUrls: ['./search-with-filters.css']
})
export class SearchWithFilters {
  flights = signal<FlightResults[]>(MOCK_FLIGHTS);
  
  filters = signal<FilterState>({
    stops: 'any',
    priceRange: [28000, 55000],
    departureTime: 'any',
    airlines: new Set()
  });

  minPrice = 28000;
  maxPrice = 55000;

  availableAirlines = [
    { code: 'EI', name: 'Aer Lingus' },
    { code: 'B6', name: 'JetBlue' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'BA', name: 'British Airways' },
    { code: 'VS', name: 'Virgin Atlantic' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'UA', name: 'United Airlines' },
    { code: 'AF', name: 'Air France' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'IB', name: 'Iberia' }
  ];

  get filteredFlights(): FlightResults[] {
    const current = this.filters();
    
    return this.flights().filter(flight => {
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
        const hour = flight.departureTs.getHours();
        if (current.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (current.departureTime === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (current.departureTime === 'evening' && (hour < 17 || hour >= 21)) return false;
      }

      // Airline filter
      if (current.airlines.size > 0 && !current.airlines.has(flight.airlineCode)) {
        return false;
      }

      return true;
    });
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

  onAirlineToggle(airline: string): void {
    const current = this.filters();
    const newAirlines = new Set(current.airlines);
    if (newAirlines.has(airline)) {
      newAirlines.delete(airline);
    } else {
      newAirlines.add(airline);
    }
    this.filters.set({ ...current, airlines: newAirlines });
  }

  isAirlineSelected(airline: string): boolean {
    return this.filters().airlines.has(airline);
  }

  resetFilters(): void {
    this.filters.set({
      stops: 'any',
      priceRange: [this.minPrice, this.maxPrice],
      departureTime: 'any',
      airlines: new Set()
    });
  }

  onFlightSelected(flight: FlightResults): void {
    console.log('Flight selected:', flight);
    // TODO: Navigate to booking flow
  }

  onViewDetails(flight: FlightResults): void {
    console.log('View details for flight:', flight);
    // TODO: Navigate to flight details page
  }
}

