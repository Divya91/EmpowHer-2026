import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { SearchCriteria } from '../models/searchCriteria';
import { FlightResults } from '../models/flightResults';

@Injectable({
  providedIn: 'root'
})
export class FlightServices {

  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(
    private http: HttpClient
  ) {}

  searchFlights(
    criteria: SearchCriteria
  ): Observable<FlightResults[]> {

    const params = new HttpParams()
      .set(
        'src',
        criteria.fromAirport.trim().toUpperCase()
      )
      .set(
        'dest',
        criteria.toAirport.trim().toUpperCase()
      )
      .set(
        'date',
        this.formatDate(criteria.departureDate)
      );

    console.log(
      'Calling API:',
      `${this.apiUrl}?${params.toString()}`
    );

    return this.http
      .get<FlightResults[]>(
        this.apiUrl,
        { params }
      )
      .pipe(

        catchError((error) => {

          console.error(
            'Flight API Error:',
            error
          );

          return throwError(
            () => error
          );
        })

      );
  }

  getAllFlights(): Observable<FlightResults[]> {

    return this.http.get<FlightResults[]>(
      `${this.apiUrl}/all`
    );
  }

  getFlightById(
    id: number
  ): Observable<FlightResults> {

    return this.http.get<FlightResults>(
      `${this.apiUrl}/${id}`
    );
  }

  private formatDate(
    date: Date | string
  ): string {

    if (typeof date === 'string') {
      return date.substring(0, 10);
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}