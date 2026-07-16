import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, password: string): Observable<any> {

    if (email === 'admin@moodys.com' && password === 'admin123') {

      return of({
        name: 'Admin',
        role: 'Admin'
      });

    }

    if (email === 'customer@moodys.com' && password === 'customer123') {

      return of({
        name: 'Customer',
        role: 'Customer'
      });

    }

    return throwError(() => new Error('Invalid Email or Password'));

  }

}