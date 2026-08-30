export interface Booking {
  id?: number;
  destination: string;
  departureDate: string;
  returnDate: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  passengers: number;
  fare: number;
  confirmation: string;
  refundable: boolean;
  status: string;
}