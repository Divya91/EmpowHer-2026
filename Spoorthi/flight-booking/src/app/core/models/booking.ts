export interface Booking {

  id:number;

  destination:string;

  startDate:string;

  endDate:string;

  from:string;

  to:string;

  departureTime:string;

  arrivalTime:string;

  airline:string;

  confirmation:string;

  passengers:number;

  refundable:boolean;

  fare:number;

  status:'CONFIRMED' | 'CANCEL_REQUESTED' | 'COMPLETED';

}