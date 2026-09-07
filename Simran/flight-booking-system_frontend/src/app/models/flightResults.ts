import {Flight} from "./flight";
export interface FlightResults {

  id: number;

  flightNumber: string;

  airline: string;

  source: string;

  destination: string;

  departureDate: string;

  departureTime: string;

  arrivalTime: string;

  duration: string;

  stops: number;

  price: number;

  availableSeats: number;
}