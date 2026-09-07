export interface Auth {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PASSENGER';
}