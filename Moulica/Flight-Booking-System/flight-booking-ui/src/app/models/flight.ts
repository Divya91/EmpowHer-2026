export interface Flight {
  flightId: number;

  airlineCode: string;

  airlineName: string;

  fromAirport: string;

  toAirport: string;

  departureTime: string;

  arrivalTime: string;

  stops: number;

  basePrice: number;

  availableSeats: number;

  durationMinutes: number;
}
