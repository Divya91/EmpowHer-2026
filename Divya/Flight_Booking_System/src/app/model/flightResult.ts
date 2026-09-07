export interface flightResult {
    id?: number;
    flightid: string;
    airlineCode: string;
    airlineName: string;
    aircraft: string;
    fromAirport: string;
    toAirport: string;
    departureTs: Date;
    arrivalTs: Date;
    basePrice: number; 
    stops: number;
    durationMins: number;
    terminalDeparture?: string;
    gateDeparture?: string;
    terminalArrival?: string;
    baggageCarryOn?: string;
    baggageChecked?: string;
    seatsLeft?: number;
    onTimePercent?: number;
    co2Kg?: number;
    hasWifi?: boolean;
    hasPower?: boolean;
    fareFamily?: string;
    refundable?: boolean;
}