export interface Booking {
  bookingId: number;
  bookingReference: string;
  flightId: number;
  airlineName: string;
  airlineCode: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  totalAmount: number;
  paymentMethod: 'CARD' | 'UPI';
  paymentReference: string;
  status: 'CONFIRMED' | 'CANCELLED';
  bookedAt: string;
  message?: string;
}

export interface BookingRequest {
  flightId: number;
  passengers: number;
  paymentMethod: 'CARD' | 'UPI';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
}
