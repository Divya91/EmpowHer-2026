import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchCriteria } from '../models/searchCriteria';
import { Airline } from '../models/airline';
import { Flight } from '../models/flight';
import { Airport } from '../models/airport';
import { FlightResults } from '../models/flightResults';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

const AIRPORTS: Airport[] = [
  {
    airportCode: 'JFK',
    city: 'New York',
    country: 'USA',
    name: 'John F. Kennedy International Airport',
  },
  {
    airportCode: 'LAX',
    city: 'Los Angeles',
    country: 'USA',
    name: 'Los Angeles International Airport',
  }
];

const AIRLINES: Airline[] = [
  {
    airlineCode: 'AA',
    name: 'American Airlines',
  },
  {
    airlineCode: 'DL',
    name: 'Delta Airlines',
  },
  {
    airlineCode: 'UA',
    name: 'United Airlines',
  },
];

const FLIGHTS: Flight[] = [
  {
    flightId: 'AA123',
    flightNumber: 'AA-123',
    airlineCode: 'AA',
    aircraft: 'Boeing 777-300ER',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    arrivalTs: new Date('2024-06-01T12:00:00Z'),
    departureTs: new Date('2024-06-01T08:00:00Z'),
    stops: 0,
    seatsLeft: 50,
    basePrice: 300,
    durationMins: 240,
  },
  {
    flightId: 'DL456',
    flightNumber: 'DL-456',
    airlineCode: 'DL',
    aircraft: 'Airbus A330-300',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    arrivalTs: new Date('2024-06-01T14:00:00Z'),
    departureTs: new Date('2024-06-01T09:00:00Z'),
    stops: 1,
    seatsLeft: 35,
    basePrice: 250,
    durationMins: 300,
  },
  {
    flightId: 'UA789',
    flightNumber: 'UA-789',
    airlineCode: 'UA',
    aircraft: 'Boeing 787-9',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    arrivalTs: new Date('2024-06-01T13:30:00Z'),
    departureTs: new Date('2024-06-01T07:30:00Z'),
    stops: 0,
    seatsLeft: 42,
    basePrice: 320,
    durationMins: 360,
  },
];

const FLIGHT_RESULTS: FlightResults[] = [
  ...FLIGHTS.map((flight) => {
    const airline = AIRLINES.find((a) => a.airlineCode === flight.airlineCode);
    return {
      ...flight,
      airlineName: airline ? airline.name : 'Unknown Airline',
    };
  }
)
];

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/flights`;

  searchFlights(criteria: SearchCriteria): Observable<FlightResults[]> {

    let params = new HttpParams();

    if (criteria.fromAirport) {
      params = params.set('from', criteria.fromAirport);
    }

    if (criteria.toAirport) {
      params = params.set('to', criteria.toAirport);
    }

    if (criteria.departureDate) {
      params = params.set('date', this.toIsoDate(criteria.departureDate));
    }

    return this.http.get<FlightResults[]>(this.baseUrl, { params }).pipe(
      map((results) => results.map((result) => this.parseDates(result))),
      catchError(() => {
        // Backend unreachable: fall back to sample data so the UI stays usable offline.
        console.warn('Could not reach the flights API, showing sample results instead.');
        return of(FLIGHT_RESULTS).pipe(delay(500));
      })
    );
  }

  getFlightById(flightId: string): Observable<FlightResults> {
    return this.http.get<FlightResults>(`${this.baseUrl}/${flightId}`).pipe(
      map((result) => this.parseDates(result)),
      catchError(() => {
        const fallback = FLIGHT_RESULTS.find((flight) => flight.flightId === flightId);

        if (!fallback) {
          throw new Error(`Flight ${flightId} not found`);
        }

        return of(fallback);
      })
    );
  }

  private parseDates(result: FlightResults): FlightResults {
    return {
      ...result,
      departureTs: new Date(result.departureTs),
      arrivalTs: new Date(result.arrivalTs),
    };
  }

  private toIsoDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }
}
