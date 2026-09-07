import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<Auth> {

    return this.http.post<Auth>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  signup(
    name: string,
    email: string,
    password: string
  ): Observable<Auth> {

    return this.http.post<Auth>(
      `${this.apiUrl}/signup`,
      {
        name,
        email,
        password
      }
    );
  }

  getCurrentUser(): Auth | null {

    const user = localStorage.getItem('currentUser');

    return user
      ? JSON.parse(user)
      : null;
  }

  getRole(): 'ADMIN' | 'PASSENGER' | null {

    return this.getCurrentUser()?.role ?? null;
  }

  isLoggedIn(): boolean {

    return this.getCurrentUser() !== null;
  }

  logout(): void {

    localStorage.removeItem('currentUser');
  }
}