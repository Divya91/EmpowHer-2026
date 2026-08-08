import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookings: Booking[] = [

    {
      id:1,
      destination:'Tokyo, Japan',
      startDate:'12 Oct 2026',
      endDate:'24 Oct 2026',
      from:'JFK',
      to:'HND',
      departureTime:'08:00 AM',
      arrivalTime:'02:30 PM',
      airline:'SkyFlow Pacific',
      confirmation:'TY08K4',
      passengers:1,
      refundable:true,
      fare:1248,
      status:'CANCEL_REQUESTED'
    },

    {
      id:2,
      destination:'London, UK',
      startDate:'05 Nov 2026',
      endDate:'10 Nov 2026',
      from:'JFK',
      to:'LHR',
      departureTime:'07:45 PM',
      arrivalTime:'07:50 AM',
      airline:'SkyFlow Atlantic',
      confirmation:'LHR5P9',
      passengers:2,
      refundable:true,
      fare:1628,
      status:'CONFIRMED'
    },

    {
      id:3,
      destination:'Miami, FL',
      startDate:'15 May 2026',
      endDate:'18 May 2026',
      from:'JFK',
      to:'MIA',
      departureTime:'10:20 AM',
      arrivalTime:'01:40 PM',
      airline:'SkyFlow Domestic',
      confirmation:'MIA2Q8',
      passengers:1,
      refundable:true,
      fare:342,
      status:'COMPLETED'
    }

  ];

  getBookings(): Observable<Booking[]>{
    return of(this.bookings);
  }

}