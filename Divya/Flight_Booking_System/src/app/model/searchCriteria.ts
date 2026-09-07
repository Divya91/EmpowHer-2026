export interface SearchCriteria{
    fromAirport: string;
    toAirport: string;
    departureDate: Date | string;
    passengers: number;
}