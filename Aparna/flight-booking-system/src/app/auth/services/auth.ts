import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

const STORAGE_KEY = 'meridian.auth.user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly role = computed<UserRole | null>(() => this.userSignal()?.role ?? null);

  login(email: string, password: string): Observable<AuthUser> {

    const user: AuthUser = {
      name: this.deriveName(email),
      email,
      role: this.deriveRole(email)
    };

    return of(user).pipe(
      delay(700),
      tap((loggedInUser) => this.setUser(loggedInUser))
    );

  }

  signup(name: string, email: string, password: string): Observable<AuthUser> {

    const user: AuthUser = {
      name: name?.trim() || this.deriveName(email),
      email,
      role: this.deriveRole(email)
    };

    return of(user).pipe(
      delay(700),
      tap((newUser) => this.setUser(newUser))
    );

  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private deriveRole(email: string): UserRole {
    return email.trim().toLowerCase().includes('admin') ? 'admin' : 'customer';
  }

  private deriveName(email: string): string {
    const handle = email.split('@')[0] || 'Traveler';
    return handle
      .replace(/[._]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
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
