import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  private apiUrl = 'http://localhost:8080/api/passengers';

  constructor(private http: HttpClient) {}

  createPassenger(passenger: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, passenger);
  }
}
