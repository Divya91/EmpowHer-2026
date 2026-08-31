import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flight {
  id?: number;
  flightNumber: string;
  airline: string;
  fromAirport: string;
  toAirport: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: string;
  price: number;
  availableSeats: number;
}
export interface Booking {
  id?: number;
  bookingId: string;
  passengerName: string;
  airline: string;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  travelDate: string;
  departureTime: string;
  seatNumber: string;
  amount: number;
  paymentStatus: string;
  bookingStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // GET ALL FLIGHTS
  getFlights(): Observable<Flight[]> {

    return this.http.get<Flight[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }

  // CREATE FLIGHT
  createFlight(flight: Flight): Observable<Flight> {

    return this.http.post<Flight>(
      this.apiUrl,
      flight,
      {
        headers: this.getHeaders()
      }
    );
  }

  // DELETE FLIGHT
  deleteFlight(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // UPDATE FLIGHT
  updateFlight(
    id: number,
    flight: Flight
  ): Observable<Flight> {

    return this.http.put<Flight>(
      `${this.apiUrl}/${id}`,
      flight,
      {
        headers: this.getHeaders()
      }
    );
  }
  // GET ALL BOOKINGS
getBookings(): Observable<Booking[]> {
  return this.http.get<Booking[]>(
    'http://localhost:8080/api/admin/bookings',
    {
      headers: this.getHeaders()
    }
  );
}

// CANCEL BOOKING
cancelBooking(id: number): Observable<Booking> {
  return this.http.put<Booking>(
    `http://localhost:8080/api/admin/bookings/${id}/cancel`,
    {},
    {
      headers: this.getHeaders()
    }
  );
}
}