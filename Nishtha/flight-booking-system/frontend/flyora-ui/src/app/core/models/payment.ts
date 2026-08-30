export interface Payment {
  id?: number;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
}