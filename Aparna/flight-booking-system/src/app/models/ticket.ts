export interface Ticket {
  ticketId: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  flightId: string | number;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureTs: Date;
  numberOfSeats: number;
  totalPrice: number;
  status: string;
}

export interface TicketRequest {
  userId: number;
  flightId: string | number;
  numberOfSeats: number;
}
