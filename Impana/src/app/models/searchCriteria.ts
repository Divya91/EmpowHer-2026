export interface searchCriteria {
    fromAirport: string;
    toAirport: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
}