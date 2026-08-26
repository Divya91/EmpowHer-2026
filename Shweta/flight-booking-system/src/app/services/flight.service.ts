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
  {
  flightId: 'DL456',
  airlineCode: 'DL',
  fromAirport: 'JFK',
  toAirport: 'LAX',
  arrivalTs: new Date('2024-06-01T15:00:00Z'),
  departureTs: new Date('2024-06-01T10:00:00Z'),
  stops: 1,
  availableSeats: 30,
  basePrice: 250,
  durationMins: 300,
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

  const selectedDate = new Date(criteria.departureDate).toDateString();

  const filteredFlights = FLIGHT_RESULTS.filter((flight) => {
    const flightDate = new Date(flight.departureTs).toDateString();

    return (
      flight.fromAirport.toLowerCase() === criteria.fromAirport.toLowerCase() &&
      flight.toAirport.toLowerCase() === criteria.toAirport.toLowerCase() &&
      flightDate === selectedDate
    );
  });

  return of(filteredFlights).pipe(delay(100));
}
}
