import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInStatus = false; 

  login(username: string) {
    this.isLoggedInStatus = true; 
    console.log(`User ${username} logged in successfully.`);
  }

  logout() {
    this.isLoggedInStatus = false;
  }

  // This is what your AuthGuard calls to check access
  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }
}