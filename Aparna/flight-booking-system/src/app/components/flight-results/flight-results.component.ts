import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightResults } from '../../models/flightResults';
import { FlightDetails } from '../flight-details/flight-details';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule, FlightDetails],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.css']
})
export class FlightResultsComponent {
  @Input() flightResults: FlightResults[] = MOCK_FLIGHTS;

  @Output() flightSelected = new EventEmitter<FlightResults>();

  expandedFlightId: string | null = null;

  onSelectFlight(result: FlightResults): void {
    console.log('Selected flight:', result.flightId);
    this.flightSelected.emit(result);
  }

  onViewDetails(result: FlightResults): void {
    this.expandedFlightId =
      this.expandedFlightId === result.flightId ? null : result.flightId;
  }

  isExpanded(result: FlightResults): boolean {
    return this.expandedFlightId === result.flightId;
  }
}

export const MOCK_FLIGHTS: FlightResults[] = [
  // Aer Lingus
  { flightId: 'fl-001', flightNumber: 'EI-102', airlineName: 'Aer Lingus', airlineCode: 'EI', aircraft: 'Airbus A330-300', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T10:15:00'), arrivalTs: new Date('2026-07-14T21:00:00'), durationMins: 585, stops: 1, seatsLeft: 24, basePrice: 31500 },
  { flightId: 'fl-051', flightNumber: 'EI-104', airlineName: 'Aer Lingus', airlineCode: 'EI', aircraft: 'Airbus A330-300', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T14:20:00'), arrivalTs: new Date('2026-07-15T00:30:00'), durationMins: 610, stops: 1, seatsLeft: 16, basePrice: 28900 },
  
  // JetBlue
  { flightId: 'fl-002', flightNumber: 'B6-101', airlineName: 'JetBlue', airlineCode: 'B6', aircraft: 'Airbus A321LR', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T08:30:00'), arrivalTs: new Date('2026-07-14T20:40:00'), durationMins: 430, stops: 0, seatsLeft: 18, basePrice: 37500 },
  { flightId: 'fl-052', flightNumber: 'B6-103', airlineName: 'JetBlue', airlineCode: 'B6', aircraft: 'Airbus A321LR', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T12:00:00'), arrivalTs: new Date('2026-07-15T00:10:00'), durationMins: 430, stops: 0, seatsLeft: 22, basePrice: 39200 },
  { flightId: 'fl-053', flightNumber: 'B6-105', airlineName: 'JetBlue', airlineCode: 'B6', aircraft: 'Airbus A321LR', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T18:45:00'), arrivalTs: new Date('2026-07-15T06:55:00'), durationMins: 430, stops: 0, seatsLeft: 11, basePrice: 35800 },
  
  // American Airlines
  { flightId: 'fl-003', flightNumber: 'AA-105', airlineName: 'American Airlines', airlineCode: 'AA', aircraft: 'Boeing 777-200ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T07:10:00'), arrivalTs: new Date('2026-07-14T19:20:00'), durationMins: 430, stops: 0, seatsLeft: 20, basePrice: 41000 },
  { flightId: 'fl-054', flightNumber: 'AA-107', airlineName: 'American Airlines', airlineCode: 'AA', aircraft: 'Boeing 777-300ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T09:40:00'), arrivalTs: new Date('2026-07-14T21:50:00'), durationMins: 430, stops: 0, seatsLeft: 28, basePrice: 42500 },
  { flightId: 'fl-055', flightNumber: 'AA-109', airlineName: 'American Airlines', airlineCode: 'AA', aircraft: 'Boeing 777-200ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T15:30:00'), arrivalTs: new Date('2026-07-15T03:40:00'), durationMins: 430, stops: 0, seatsLeft: 19, basePrice: 40200 },
  { flightId: 'fl-056', flightNumber: 'AA-111', airlineName: 'American Airlines', airlineCode: 'AA', aircraft: 'Boeing 787-9', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T20:15:00'), arrivalTs: new Date('2026-07-15T08:25:00'), durationMins: 430, stops: 0, seatsLeft: 14, basePrice: 38900 },
  
  // British Airways
  { flightId: 'fl-004', flightNumber: 'BA-103', airlineName: 'British Airways', airlineCode: 'BA', aircraft: 'Boeing 777-300ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T13:35:00'), arrivalTs: new Date('2026-07-14T22:45:00'), durationMins: 430, stops: 0, seatsLeft: 9, basePrice: 43000 },
  { flightId: 'fl-057', flightNumber: 'BA-105', airlineName: 'British Airways', airlineCode: 'BA', aircraft: 'Airbus A350-1000', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T06:30:00'), arrivalTs: new Date('2026-07-14T18:40:00'), durationMins: 430, stops: 0, seatsLeft: 25, basePrice: 44500 },
  { flightId: 'fl-058', flightNumber: 'BA-107', airlineName: 'British Airways', airlineCode: 'BA', aircraft: 'Boeing 777-200ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T22:00:00'), arrivalTs: new Date('2026-07-15T10:10:00'), durationMins: 430, stops: 0, seatsLeft: 32, basePrice: 41800 },
  
  // Virgin Atlantic
  { flightId: 'fl-005', flightNumber: 'VS-104', airlineName: 'Virgin Atlantic', airlineCode: 'VS', aircraft: 'Airbus A350-1000', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T14:45:00'), arrivalTs: new Date('2026-07-14T23:55:00'), durationMins: 430, stops: 0, seatsLeft: 15, basePrice: 50500 },
  { flightId: 'fl-059', flightNumber: 'VS-106', airlineName: 'Virgin Atlantic', airlineCode: 'VS', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T11:20:00'), arrivalTs: new Date('2026-07-14T20:30:00'), durationMins: 430, stops: 0, seatsLeft: 8, basePrice: 52000 },
  
  // Delta Air Lines
  { flightId: 'fl-006', flightNumber: 'DL-201', airlineName: 'Delta Air Lines', airlineCode: 'DL', aircraft: 'Airbus A330-900neo', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T18:20:00'), arrivalTs: new Date('2026-07-15T06:10:00'), durationMins: 410, stops: 0, seatsLeft: 6, basePrice: 46500 },
  { flightId: 'fl-060', flightNumber: 'DL-203', airlineName: 'Delta Air Lines', airlineCode: 'DL', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T10:50:00'), arrivalTs: new Date('2026-07-14T22:55:00'), durationMins: 430, stops: 0, seatsLeft: 13, basePrice: 45000 },
  { flightId: 'fl-061', flightNumber: 'DL-205', airlineName: 'Delta Air Lines', airlineCode: 'DL', aircraft: 'Boeing 767-400ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T23:30:00'), arrivalTs: new Date('2026-07-15T11:40:00'), durationMins: 430, stops: 0, seatsLeft: 29, basePrice: 44000 },
  
  // United Airlines
  { flightId: 'fl-007', flightNumber: 'UA-901', airlineName: 'United Airlines', airlineCode: 'UA', aircraft: 'Boeing 767-400ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T21:50:00'), arrivalTs: new Date('2026-07-15T09:35:00'), durationMins: 405, stops: 0, seatsLeft: 31, basePrice: 39000 },
  { flightId: 'fl-062', flightNumber: 'UA-903', airlineName: 'United Airlines', airlineCode: 'UA', aircraft: 'Boeing 787-9', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T13:15:00'), arrivalTs: new Date('2026-07-15T01:25:00'), durationMins: 430, stops: 0, seatsLeft: 17, basePrice: 40500 },
  { flightId: 'fl-063', flightNumber: 'UA-905', airlineName: 'United Airlines', airlineCode: 'UA', aircraft: 'Boeing 777-200ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T08:00:00'), arrivalTs: new Date('2026-07-14T20:10:00'), durationMins: 430, stops: 0, seatsLeft: 23, basePrice: 38500 },
  
  // Air France
  { flightId: 'fl-008', flightNumber: 'AF-023', airlineName: 'Air France', airlineCode: 'AF', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T11:05:00'), arrivalTs: new Date('2026-07-14T23:50:00'), durationMins: 645, stops: 1, seatsLeft: 12, basePrice: 33600 },
  { flightId: 'fl-064', flightNumber: 'AF-025', airlineName: 'Air France', airlineCode: 'AF', aircraft: 'Airbus A330-300', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T17:40:00'), arrivalTs: new Date('2026-07-15T06:15:00'), durationMins: 635, stops: 1, seatsLeft: 19, basePrice: 32800 },
  { flightId: 'fl-065', flightNumber: 'AF-027', airlineName: 'Air France', airlineCode: 'AF', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T06:00:00'), arrivalTs: new Date('2026-07-14T18:50:00'), durationMins: 650, stops: 1, seatsLeft: 7, basePrice: 31500 },
  
  // Lufthansa
  { flightId: 'fl-009', flightNumber: 'LH-402', airlineName: 'Lufthansa', airlineCode: 'LH', aircraft: 'Airbus A340-600', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T16:15:00'), arrivalTs: new Date('2026-07-15T05:30:00'), durationMins: 675, stops: 1, seatsLeft: 27, basePrice: 34500 },
  { flightId: 'fl-066', flightNumber: 'LH-404', airlineName: 'Lufthansa', airlineCode: 'LH', aircraft: 'Airbus A330-300', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T09:30:00'), arrivalTs: new Date('2026-07-14T21:15:00'), durationMins: 645, stops: 1, seatsLeft: 20, basePrice: 35200 },
  { flightId: 'fl-067', flightNumber: 'LH-406', airlineName: 'Lufthansa', airlineCode: 'LH', aircraft: 'Boeing 747-8', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T19:50:00'), arrivalTs: new Date('2026-07-15T08:20:00'), durationMins: 630, stops: 1, seatsLeft: 34, basePrice: 33200 },
  
  // Iberia
  { flightId: 'fl-010', flightNumber: 'IB-720', airlineName: 'Iberia', airlineCode: 'IB', aircraft: 'Airbus A330-200', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T19:40:00'), arrivalTs: new Date('2026-07-15T08:55:00'), durationMins: 675, stops: 1, seatsLeft: 3, basePrice: 32400 },
  { flightId: 'fl-068', flightNumber: 'IB-722', airlineName: 'Iberia', airlineCode: 'IB', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T12:25:00'), arrivalTs: new Date('2026-07-15T01:10:00'), durationMins: 645, stops: 1, seatsLeft: 26, basePrice: 33800 },
  
  // Additional flights for variety
  { flightId: 'fl-069', flightNumber: 'AA-113', airlineName: 'American Airlines', airlineCode: 'AA', aircraft: 'Boeing 787-9', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T05:00:00'), arrivalTs: new Date('2026-07-14T17:10:00'), durationMins: 430, stops: 0, seatsLeft: 5, basePrice: 51000 },
  { flightId: 'fl-070', flightNumber: 'BA-109', airlineName: 'British Airways', airlineCode: 'BA', aircraft: 'Airbus A350-1000', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T17:55:00'), arrivalTs: new Date('2026-07-15T06:05:00'), durationMins: 430, stops: 0, seatsLeft: 10, basePrice: 49500 },
  { flightId: 'fl-071', flightNumber: 'DL-207', airlineName: 'Delta Air Lines', airlineCode: 'DL', aircraft: 'Boeing 777-200ER', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T04:30:00'), arrivalTs: new Date('2026-07-14T16:40:00'), durationMins: 430, stops: 0, seatsLeft: 21, basePrice: 45600 },
  { flightId: 'fl-072', flightNumber: 'VS-108', airlineName: 'Virgin Atlantic', airlineCode: 'VS', aircraft: 'Airbus A350-900', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T20:40:00'), arrivalTs: new Date('2026-07-15T08:50:00'), durationMins: 430, stops: 0, seatsLeft: 19, basePrice: 48000 },
  { flightId: 'fl-073', flightNumber: 'EI-106', airlineName: 'Aer Lingus', airlineCode: 'EI', aircraft: 'Airbus A321LR', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T07:45:00'), arrivalTs: new Date('2026-07-14T19:55:00'), durationMins: 610, stops: 1, seatsLeft: 33, basePrice: 29500 },
  { flightId: 'fl-074', flightNumber: 'B6-107', airlineName: 'JetBlue', airlineCode: 'B6', aircraft: 'Airbus A321LR', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T15:10:00'), arrivalTs: new Date('2026-07-15T03:20:00'), durationMins: 430, stops: 0, seatsLeft: 26, basePrice: 36800 },
  { flightId: 'fl-075', flightNumber: 'UA-907', airlineName: 'United Airlines', airlineCode: 'UA', aircraft: 'Boeing 787-10', fromAirport: 'JFK', toAirport: 'LHR', departureTs: new Date('2026-07-14T02:20:00'), arrivalTs: new Date('2026-07-14T14:30:00'), durationMins: 430, stops: 0, seatsLeft: 9, basePrice: 42500 },
];