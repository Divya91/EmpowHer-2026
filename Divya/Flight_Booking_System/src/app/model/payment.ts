export interface Payment {
  paymentId: number;
  bookingId: number;

  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  paymentMethod: string;
  amount: number;
}