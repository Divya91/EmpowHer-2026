export interface flightResult{
    flightid:string;
    airlineCode:string;
    fromAirport:string;
    toAirport:string;
    departureTs:Date;
    arrivalTs:Date;
    basePrice:number; 
    stops:number;
    durationMins:number;
}