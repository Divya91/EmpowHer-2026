export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class User {

  id?: number;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  role: UserRole;

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.role = UserRole.USER; 
  }

}