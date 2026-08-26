export interface User {
    userId?: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role:'ADMIN'|'USER';
    createdAt?: string; 
}
