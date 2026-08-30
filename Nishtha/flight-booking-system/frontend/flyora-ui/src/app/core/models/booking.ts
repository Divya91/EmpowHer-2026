export interface Booking {

  id?: number;

  bookingId: string;

  passengerName: string;

  airline: string;

  flightNumber: string;

  fromAirport: string;

  toAirport: string;

  travelDate: string;

  departureTime: string;

  seatNumber: string;

  amount: number;

  paymentStatus: string;

  bookingStatus: string;

}