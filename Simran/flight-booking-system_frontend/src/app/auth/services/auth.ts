import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface User{
  email:string,
  password:string;
  role: 'admin' | 'customer'
}
@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient){}
  login(email: string,password: string):Observable<User>{
    return this.http.post<User>('/api/Login',{email,password});
  }

}
