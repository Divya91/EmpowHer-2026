import { Injectable } from '@angular/core';
import { SearchCriteria } from '../model/searchCriteria';
import { Airline } from '../model/airline';
import { Airport } from '../model/airport';
import { Flight } from '../model/flight';
import { flightResult } from '../model/flightResult';
import { delay, Observable, of } from 'rxjs';
const AIRLINES: Airline[]=[
  {
    airlineCode: 'AA',
    name: 'American Airlines'
  },
  {
    airlineCode: 'DL',
    name: 'Delta Airlines'
  },
  {
    airlineCode: 'UA',
    name: 'United Airlines'
  }
];
const FLIGHTS:Flight[]=[
  {
    flightid:'AA101', 
    airlineCode:'AA',
    fromAirport:'JFK',
    toAirport:'LAX',
    departureTs:new Date('2024-07-01T08:00:00'),
    arrivalTs:new Date('2024-07-01T11:00:00'),
    basePrice:300,
    stops:0,
    durationMins:360
  },
  {
    flightid:'DL202', 
    airlineCode:'DL',
    fromAirport:'LAX',
    toAirport:'JFK',
    departureTs:new Date('2024-07-02T09:00:00'),
    arrivalTs:new Date('2024-07-02T17:00:00'),
    basePrice:350,
    stops:1,
    durationMins:480    
  },
  {
    flightid:'UA303', 
    airlineCode:'UA',
    fromAirport:'JFK',
    toAirport:'LAX',
    departureTs:new Date('2024-07-03T10:00:00'),
    arrivalTs:new Date('2024-07-03T13:00:00'),
    basePrice:400,
    stops:0,
    durationMins:360
  }
]
const AIRPORTS: Airport[] = [
  {
    airportCode: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA'    
  },
  {
    airportCode: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA'
  }
];
const FLIGHT_RESULTS: flightResult[] = [
  {
    flightid: 'AA101',
    airlineCode: 'AA',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    departureTs: new Date('2024-07-01T08:00:00'),
    arrivalTs: new Date('2024-07-01T11:00:00'),
    basePrice: 300,
    stops: 0,
    durationMins: 360
  },
  {
    flightid: 'DL202',
    airlineCode: 'DL',
    fromAirport: 'LAX',
    toAirport: 'JFK',
    departureTs: new Date('2024-07-02T09:00:00'),
    arrivalTs: new Date('2024-07-02T17:00:00'),
    basePrice: 350,
    stops: 1,
    durationMins: 480
  },
  {
    flightid: ' UA303',
    airlineCode: 'UA',
    fromAirport: 'JFK',
    toAirport: 'LAX',
    departureTs: new Date('2024-07-03T10:00:00'),
    arrivalTs: new Date('2024-07-03T13:00:00'),
    basePrice: 400,
    stops: 0,
    durationMins: 360
  }
];
@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor() {}
  searchFlights(searchCriteria: SearchCriteria):  Observable<flightResult[]> {
    return of(FLIGHT_RESULTS);
    
  }
}
