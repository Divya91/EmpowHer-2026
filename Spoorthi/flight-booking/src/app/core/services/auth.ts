import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http:HttpClient){}

    login(email:String,password:string):Observable<User>{
      return this.http.post<User>(`${this.apiUrl}/login`,{email,password});
  }
}
