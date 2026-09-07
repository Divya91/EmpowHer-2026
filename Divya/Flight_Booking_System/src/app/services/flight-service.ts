import { Injectable } from '@angular/core';
import { SearchCriteria } from '../model/searchCriteria';
import { Airline } from '../model/airline';
import { Airport } from '../model/airport';
import { flightResult } from '../model/flightResult';
import { Observable, of, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

const AIRLINES: Airline[] = [
  { airlineCode: 'EI', name: 'Aer Lingus' },
  { airlineCode: 'B6', name: 'JetBlue' },
  { airlineCode: 'AA', name: 'American Airlines' },
  { airlineCode: 'BA', name: 'British Airways' },
  { airlineCode: 'VS', name: 'Virgin Atlantic' }
];

const AIRPORTS: Airport[] = [
  { airportCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { airportCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
  { airportCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { airportCode: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' }
];

const FLIGHT_RESULTS: flightResult[] = [
  {
    flightid: 'EI-102',
    airlineCode: 'EI',
    airlineName: 'Aer Lingus',
    aircraft: 'Airbus A330-300',
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureTs: new Date('2026-07-14T10:15:00'),
    arrivalTs: new Date('2026-07-14T21:00:00'),
    basePrice: 380,
    stops: 1,
    durationMins: 585,
    terminalDeparture: 'T7',
    gateDeparture: 'C18',
    terminalArrival: 'T2',
    baggageCarryOn: '1 carry-on',
    baggageChecked: '1 checked bag',
    seatsLeft: 24,
    onTimePercent: 82,
    co2Kg: 623,
    hasWifi: true,
    hasPower: true,
    fareFamily: 'Smart',
    refundable: false
  },
  {
    flightid: 'B6-101',
    airlineCode: 'B6',
    airlineName: 'JetBlue',
    aircraft: 'Airbus A321LR',
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureTs: new Date('2026-07-14T08:30:00'),
    arrivalTs: new Date('2026-07-14T20:40:00'),
    basePrice: 450,
    stops: 0,
    durationMins: 430,
    terminalDeparture: 'T5',
    gateDeparture: 'A2',
    terminalArrival: 'T3',
    baggageCarryOn: '1 carry-on',
    baggageChecked: 'No checked bag',
    seatsLeft: 18,
    onTimePercent: 90,
    co2Kg: 480,
    hasWifi: true,
    hasPower: true,
    fareFamily: 'Value',
    refundable: false
  },
  {
    flightid: 'AA-105',
    airlineCode: 'AA',
    airlineName: 'American Airlines',
    aircraft: 'Boeing 777-200ER',
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureTs: new Date('2026-07-14T07:10:00'),
    arrivalTs: new Date('2026-07-14T19:20:00'),
    basePrice: 495,
    stops: 0,
    durationMins: 430,
    terminalDeparture: 'T8',
    gateDeparture: 'B12',
    terminalArrival: 'T3',
    baggageCarryOn: '1 carry-on',
    baggageChecked: '1 checked bag',
    seatsLeft: 20,
    onTimePercent: 85,
    co2Kg: 550,
    hasWifi: true,
    hasPower: false,
    fareFamily: 'Smart',
    refundable: true
  },
  {
    flightid: 'BA-103',
    airlineCode: 'BA',
    airlineName: 'British Airways',
    aircraft: 'Boeing 777-300ER',
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureTs: new Date('2026-07-14T13:35:00'),
    arrivalTs: new Date('2026-07-14T22:45:00'),
    basePrice: 520,
    stops: 0,
    durationMins: 430,
    terminalDeparture: 'T7',
    gateDeparture: '14',
    terminalArrival: 'T5',
    baggageCarryOn: '1 carry-on',
    baggageChecked: '2 checked bags',
    seatsLeft: 9,
    onTimePercent: 88,
    co2Kg: 520,
    hasWifi: false,
    hasPower: true,
    fareFamily: 'Smart',
    refundable: true
  },
  {
    flightid: 'VS-104',
    airlineCode: 'VS',
    airlineName: 'Virgin Atlantic',
    aircraft: 'Airbus A350-1000',
    fromAirport: 'JFK',
    toAirport: 'LHR',
    departureTs: new Date('2026-07-14T14:45:00'),
    arrivalTs: new Date('2026-07-14T23:55:00'),
    basePrice: 610,
    stops: 0,
    durationMins: 430,
    terminalDeparture: 'T4',
    gateDeparture: 'A4',
    terminalArrival: 'T3',
    baggageCarryOn: '1 carry-on',
    baggageChecked: '2 checked bags',
    seatsLeft: 15,
    onTimePercent: 92,
    co2Kg: 490,
    hasWifi: true,
    hasPower: true,
    fareFamily: 'Flex',
    refundable: true
  },
  // Add some other routes so search criteria is dynamic
  {
    flightid: 'AA-201',
    airlineCode: 'AA',
    airlineName: 'American Airlines',
    aircraft: 'Boeing 737-800',
    fromAirport: 'LAX',
    toAirport: 'JFK',
    departureTs: new Date('2026-07-14T09:00:00'),
    arrivalTs: new Date('2026-07-14T17:30:00'),
    basePrice: 280,
    stops: 0,
    durationMins: 330,
    terminalDeparture: 'T4',
    gateDeparture: '40',
    terminalArrival: 'T8',
    baggageCarryOn: '1 carry-on',
    baggageChecked: 'No checked bag',
    seatsLeft: 12,
    onTimePercent: 86,
    co2Kg: 350,
    hasWifi: true,
    hasPower: true,
    fareFamily: 'Value',
    refundable: false
  },
  {
    flightid: 'EI-202',
    airlineCode: 'EI',
    airlineName: 'Aer Lingus',
    aircraft: 'Airbus A321neo',
    fromAirport: 'DUB',
    toAirport: 'JFK',
    departureTs: new Date('2026-07-14T12:00:00'),
    arrivalTs: new Date('2026-07-14T14:30:00'),
    basePrice: 420,
    stops: 0,
    durationMins: 450,
    terminalDeparture: 'T2',
    gateDeparture: '402',
    terminalArrival: 'T5',
    baggageCarryOn: '1 carry-on',
    baggageChecked: '1 checked bag',
    seatsLeft: 30,
    onTimePercent: 94,
    co2Kg: 410,
    hasWifi: true,
    hasPower: true,
    fareFamily: 'Smart',
    refundable: true
  }
];

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(searchCriteria: SearchCriteria): Observable<flightResult[]> {
    const from = (searchCriteria.fromAirport || '').trim();
    const to = (searchCriteria.toAirport || '').trim();
    
    let date = '2026-07-14';
    if (searchCriteria.departureDate) {
      if (typeof searchCriteria.departureDate === 'string') {
        date = searchCriteria.departureDate;
      } else {
        date = searchCriteria.departureDate.toISOString().split('T')[0];
      }
    }
    
    let params = new HttpParams()
      .set('origin', from || 'JFK')
      .set('destination', to || 'LHR')
      .set('date', date)
      .set('passengers', searchCriteria.passengers || 1);

    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      map((flights: any[]) => flights.map((f: any) => this.mapToFlightResult(f)))
    );
  }

  private mapToFlightResult(backendFlight: any): flightResult {
    return {
      id: backendFlight.flightId,
      flightid: backendFlight.flightNumber,
      airlineCode: backendFlight.airline.substring(0, 2).toUpperCase(),
      airlineName: backendFlight.airline,
      aircraft: 'Boeing 737', // Mocked as backend doesn't have this
      fromAirport: backendFlight.origin,
      toAirport: backendFlight.destination,
      departureTs: new Date(backendFlight.departureTime),
      arrivalTs: new Date(backendFlight.arrivalTime),
      basePrice: backendFlight.price,
      stops: 0, // Mocked
      durationMins: 120, // Mocked
      terminalDeparture: 'T1',
      gateDeparture: 'A1',
      terminalArrival: 'T2',
      baggageCarryOn: '1 carry-on',
      baggageChecked: '1 checked bag',
      seatsLeft: backendFlight.availableSeats,
      onTimePercent: 90,
      co2Kg: 200,
      hasWifi: true,
      hasPower: true,
      fareFamily: 'Standard',
      refundable: true
    };
  }

  getFlightById(flightId: string): Observable<flightResult | undefined> {
    // We would ideally call the backend here, but search uses flightId string which might be flightNumber.
    // For now we'll just mock it or you can change it to search.
    return of(undefined);
  }

  getAirports(): Observable<Airport[]> {
    return of(AIRPORTS);
  }

  getAirlines(): Observable<Airline[]> {
    return of(AIRLINES);
  }
}
