import { Flight } from './flight';

export interface FlightPage {
  content: Flight[];

  totalElements: number;

  totalPages: number;

  size: number;

  number: number;
}
