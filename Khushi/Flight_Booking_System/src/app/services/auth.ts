import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRole } from '../model/user';
@Injectable({
  providedIn: 'root',
})
export class Auth {

  private users: User[] = [
  {
    id: 1,
    fullName: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    phone: '9999999999',
    role: UserRole.ADMIN
  },
  {
    id: 2,
    fullName: 'Divya',
    email: 'user@gmail.com',
    password: 'user123',
    phone: '9876543210',
    role: UserRole.USER
  }
  ];
  constructor(private http: HttpClient) {}


  registerUser(user: User): boolean {

    const existingUser = this.users.find(
      u => u.email === user.email
    );

    if (existingUser) {
      return false;
    }

    user.id = this.users.length + 1;

    this.users.push(user);

    return true;
  }

  login(email: string, password: string, role: UserRole): User | null {

    const user = this.users.find(
      u =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    return user ?? null;
  }

  getUsers(): User[] {
    return this.users;
  }
}