import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, password: string): Observable<any> {

    return of({
      email: email,
      role: 'customer'
    });

  }

}