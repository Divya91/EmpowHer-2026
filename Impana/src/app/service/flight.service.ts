import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // Points to your running Spring Boot backend API
  private baseUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) { }

  /**
   * Fetch matching flights from the database based on search criteria
   */
  searchFlights(from: string, to: string, date: string): Observable<any[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('date', date);

    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Fetch specific row details for a chosen flight
   */
  getFlightById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Book a flight slot (decrements available seat inventory)
   */
  bookFlight(flightId: number, userId: number): Observable<any> {
    const payload = { flightId: flightId, userId: userId };
    // Using responseType text if your Spring Boot controller returns a simple string message
    return this.http.post(`${this.baseUrl}/book`, payload, { responseType: 'text' });
  }
}