import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingRequest } from '../model/booking';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/bookings';

  createBooking(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.API, request);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.API);
  }

  getBooking(reference: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.API}/${reference}`);
  }

  cancelBooking(reference: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.API}/${reference}`);
  }
}
