import { Injectable } from '@angular/core';
import { SearchCriteria } from '../models/searchCriteria';
import { Airline } from '../models/airline';
import { Flight } from '../models/flight';
import { Airport } from '../models/airport';
import { FlightResults } from '../models/flightResults';
import { delay, Observable, of } from 'rxjs';

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
    airlineCode: 'AA',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    arrivalTs: new Date('2024-06-01T12:00:00Z'),
    departureTs: new Date('2024-06-01T08:00:00Z'),
    stops: 0,
    availableSeats: 50,
    basePrice: 300,
    durationMins: 240,
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
  constructor() {}

  searchFlights(criteria: SearchCriteria): Observable<FlightResults[]> {
    console.log('Searching flights with criteria:', criteria);
    return of(FLIGHT_RESULTS).pipe(delay(1000));
  }
}
