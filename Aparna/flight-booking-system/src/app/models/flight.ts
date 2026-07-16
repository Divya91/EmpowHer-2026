export interface Flight {
    flightId: string;
    flightNumber: string;
    airlineCode: string;
    fromAirport: string;
    toAirport: string;
    departureTs: Date;
    arrivalTs: Date;
    stops: number;
    durationMins: number;
    basePrice: number;
    aircraft: string;
    seatsLeft: number;
    availableSeats?: number;
}