import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Flight } from '../model/flight';
import { FlightPage } from '../model/flight-page';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/flights';

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.API);
  }

  searchFlights(search: any): Observable<FlightPage> {
    let params = new HttpParams()
      .set('from', search.from || '')
      .set('to', search.to || '')
      .set('date', search.date || '')
      .set('stops', search.stops || '')
      .set('page', 0)
      .set('size', 10);

    return this.http.get<FlightPage>(`${this.API}/search`, { params });
  }
}
