import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../../model/login-request';
import { LoginResponse } from '../../model/login-response';
import { SignupRequest } from '../../model/signup-request';
import { SignupResponse } from '../../model/signup-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/auth';

  private baseUrl = 'http://localhost:8080/api/auth';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, request);
  }

  signup(request: SignupRequest) {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, request);
  }
}
