export interface BookingResponse {
  bookingId: number;

  userId: number;

  flightId: number;

  bookingCode: string;

  status: string;

  paymentStatus: string;

  totalAmount: number;

  bookingTs: string;
}
