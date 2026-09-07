export interface Flight {
    flightId: string;
    airlineCode: string;
    fromAirport: string;
    toAirport: string;
    departureTs: Date;
    arrivalTs: Date;
    stops: number;
    basePrice: number;
    availableSeats: number;
    durationMins: number;
}
