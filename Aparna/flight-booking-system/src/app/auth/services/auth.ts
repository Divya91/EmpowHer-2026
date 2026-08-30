import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

const STORAGE_KEY = 'meridian.auth.user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly role = computed<UserRole | null>(() => this.userSignal()?.role ?? null);

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<UserResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      map((response) => this.toAuthUser(response)),
      tap((user) => this.setUser(user))
    );
  }

  signup(name: string, email: string, password: string): Observable<AuthUser> {
    return this.http.post<UserResponse>(`${this.baseUrl}/signup`, { name, email, password }).pipe(
      map((response) => this.toAuthUser(response)),
      tap((user) => this.setUser(user))
    );
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private toAuthUser(response: UserResponse): AuthUser {
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role.toLowerCase() === 'admin' ? 'admin' : 'customer'
    };
  }

  private setUser(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {

    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as AuthUser : null;
    } catch {
      return null;
    }

  }

}
