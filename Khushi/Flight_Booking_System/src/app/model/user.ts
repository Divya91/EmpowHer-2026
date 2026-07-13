export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class User {

  id: number;

  fullName: string;

  email: string;

  password: string;

  phone: string;

  role: UserRole;

  constructor() {
    this.id = 0;
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.role = UserRole.USER; 
  }

}