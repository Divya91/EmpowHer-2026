import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  private apiUrl = 'http://localhost:8080/api/passengers';

  constructor(private http: HttpClient) {}

  savePassenger(passenger: Passenger): Observable<Passenger> {
    return this.http.post<Passenger>(this.apiUrl, passenger);
  }
}