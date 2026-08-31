import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchCriteria } from '../models/searchCriteria';
import { FlightResults } from '../models/flightResults';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/flights`;

  searchFlights(criteria: SearchCriteria): Observable<FlightResults[]> {

    let params = new HttpParams();

    if (criteria.fromAirport) {
      params = params.set('from', criteria.fromAirport);
    }

    if (criteria.toAirport) {
      params = params.set('to', criteria.toAirport);
    }

    if (criteria.departureDate) {
      params = params.set('date', this.toIsoDate(criteria.departureDate));
    }

    return this.http.get<FlightResults[]>(this.baseUrl, { params }).pipe(
      map((results) => results.map((result) => this.parseDates(result)))
    );
  }

  getFlightById(flightId: string | number): Observable<FlightResults> {
    return this.http.get<FlightResults>(`${this.baseUrl}/${flightId}`).pipe(
      map((result) => this.parseDates(result))
    );
  }

  private parseDates(result: FlightResults): FlightResults {
    return {
      ...result,
      departureTs: new Date(result.departureTs),
      arrivalTs: new Date(result.arrivalTs),
    };
  }

  private toIsoDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }
}
