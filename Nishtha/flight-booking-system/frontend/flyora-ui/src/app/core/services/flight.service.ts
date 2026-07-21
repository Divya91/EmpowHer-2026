import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flight {
  id: number;
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

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  getAirports(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/airports`);
  }

  getAirlines(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/airlines`);
  }

  getRoutes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/routes`);
  }

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  searchFlights(
    from: string,
    to: string,
    travelDate: string,
    cabinClass: string
  ): Observable<Flight[]> {

    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('travelDate', travelDate)
      .set('cabinClass', cabinClass);

    return this.http.get<Flight[]>(
      `${this.apiUrl}/search`,
      { params }
    );
  }
}