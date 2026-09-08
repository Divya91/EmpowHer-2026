export interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
}
