import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AdminFlight {
  flightId: string;
  airline: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: number;
  availableSeats: number;
}

export interface AdminBooking {
  bookingId: string;
  passengerName: string;
  email: string;
  flightId: string;
  fromAirport: string;
  toAirport: string;
  bookingDate: string;
  amount: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private flights: AdminFlight[] = [
    {
      flightId: 'AA123',
      airline: 'American Airlines',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureTime: '08:00 AM',
      arrivalTime: '12:00 PM',
      duration: 240,
      stops: 0,
      price: 300,
      availableSeats: 50
    },
    {
      flightId: 'DL456',
      airline: 'Delta Airlines',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureTime: '10:30 AM',
      arrivalTime: '03:00 PM',
      duration: 270,
      stops: 1,
      price: 350,
      availableSeats: 35
    },
    {
      flightId: 'UA789',
      airline: 'United Airlines',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureTime: '02:00 PM',
      arrivalTime: '06:00 PM',
      duration: 240,
      stops: 0,
      price: 400,
      availableSeats: 20
    }
  ];

  private bookings: AdminBooking[] = [
    {
      bookingId: 'BK001',
      passengerName: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      flightId: 'AA123',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      bookingDate: '2026-09-01',
      amount: 300,
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK002',
      passengerName: 'Priya Singh',
      email: 'priya@gmail.com',
      flightId: 'DL456',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      bookingDate: '2026-09-02',
      amount: 350,
      status: 'CONFIRMED'
    },
    {
      bookingId: 'BK003',
      passengerName: 'Aman Verma',
      email: 'aman@gmail.com',
      flightId: 'UA789',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      bookingDate: '2026-09-02',
      amount: 400,
      status: 'CANCELLED'
    }
  ];

  // =========================
  // FLIGHT FUNCTIONS
  // =========================

  getFlights(): Observable<AdminFlight[]> {
    return of(this.flights);
  }

  addFlight(flight: AdminFlight): void {
    this.flights.push(flight);
  }

  updateFlight(updatedFlight: AdminFlight): void {

    const index = this.flights.findIndex(
      flight => flight.flightId === updatedFlight.flightId
    );

    if (index !== -1) {
      this.flights[index] = updatedFlight;
    }
  }

  deleteFlight(flightId: string): void {

    this.flights = this.flights.filter(
      flight => flight.flightId !== flightId
    );
  }

  // =========================
  // BOOKING FUNCTIONS
  // =========================

  getBookings(): Observable<AdminBooking[]> {
    return of(this.bookings);
  }

  cancelBooking(bookingId: string): void {

    const booking = this.bookings.find(
      booking => booking.bookingId === bookingId
    );

    if (booking) {
      booking.status = 'CANCELLED';
    }
  }

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  getTotalFlights(): number {
    return this.flights.length;
  }

  getTotalBookings(): number {
    return this.bookings.length;
  }

  getConfirmedBookings(): number {
    return this.bookings.filter(
      booking => booking.status === 'CONFIRMED'
    ).length;
  }

  getCancelledBookings(): number {
    return this.bookings.filter(
      booking => booking.status === 'CANCELLED'
    ).length;
  }
}