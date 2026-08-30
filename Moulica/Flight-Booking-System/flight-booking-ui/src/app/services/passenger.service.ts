import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PassengerRequest } from '../models/passenger-request';
import { PassengerResponse } from '../models/passenger-response';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private apiUrl = 'http://localhost:8080/api/passengers';

  constructor(private http: HttpClient) {}

  createPassenger(passenger: PassengerRequest): Observable<PassengerResponse> {
    return this.http.post<PassengerResponse>(this.apiUrl, passenger);
  }
}
