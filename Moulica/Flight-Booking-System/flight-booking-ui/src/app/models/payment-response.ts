export interface PaymentResponse {
  paymentId: number;

  bookingId: number;

  amount: number;

  paymentMethod: string;

  paymentStatus: string;

  transactionId: string;

  paymentDate: string;
}
