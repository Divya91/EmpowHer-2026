import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FlightResults } from '../models/flightResults';

export interface BookingRequest {
  userId: number;
  flightId: number;
  passengerId: number;
  numberOfSeats: number;
}

export interface Booking {
  id: number;
  bookingReference: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  flight: {
    id: number;
    flightNumber: string;
    airline: string;
    source: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
    price: number;
    availableSeats: number;
  };
  passenger: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    mobileNumber: string;
  };
  numberOfSeats: number;
  totalAmount: number;
  seatNumbers: string;
  bookingDate: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/bookings';

  private selectedFlight: FlightResults | null = null;

  private passengerId: number | null = null;

  private passengerDetails: any = null;

  private numberOfSeats = 1;


  constructor(private http: HttpClient) {}


  // =========================
  // FLIGHT
  // =========================

  setSelectedFlight(flight: FlightResults): void {
    this.selectedFlight = flight;
  }

  getSelectedFlight(): FlightResults | null {
    return this.selectedFlight;
  }


  // =========================
  // PASSENGER
  // =========================

  setPassengerId(id: number): void {
    this.passengerId = id;
  }

  getPassengerId(): number | null {
    return this.passengerId;
  }

  setPassengerDetails(passenger: any): void {
    this.passengerDetails = passenger;
  }

  getPassengerDetails(): any {
    return this.passengerDetails;
  }


  // =========================
  // SEATS
  // =========================

  setNumberOfSeats(seats: number): void {
    this.numberOfSeats = seats;
  }

  getNumberOfSeats(): number {
    return this.numberOfSeats;
  }


  // =========================
  // CREATE BOOKING
  // =========================

  createBooking(request: BookingRequest): Observable<Booking> {

    return this.http.post<Booking>(
      this.apiUrl,
      request
    );
  }


  // =========================
  // GET ALL BOOKINGS
  // =========================

  getAllBookings(): Observable<Booking[]> {

    return this.http.get<Booking[]>(
      this.apiUrl
    );
  }


  // =========================
  // USER BOOKINGS
  // =========================

  getUserBookings(userId: number): Observable<Booking[]> {

    return this.http.get<Booking[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }


  // =========================
  // CANCEL BOOKING
  // =========================

  cancelBooking(id: number): Observable<Booking> {

    return this.http.put<Booking>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }


  // =========================
  // CLEAR
  // =========================

  clearBooking(): void {

    this.selectedFlight = null;

    this.passengerId = null;

    this.passengerDetails = null;

    this.numberOfSeats = 1;
  }
}