import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  upcomingBookings: Booking[] = [

    {
      id:1,
      destination:'Tokyo, Japan',
      departureDate:'12 Oct 2026',
      returnDate:'24 Oct 2026',
      from:'JFK',
      to:'HND',
      departureTime:'08:00 AM',
      arrivalTime:'02:30 PM',
      airline:'SkyFlow Pacific',
      passengers:2,
      fare:1248,
      confirmation:'TY0RKA',
      refundable:true,
      status:'Check-in Open'
    },

    {
      id:2,
      destination:'London, UK',
      departureDate:'05 Nov 2026',
      returnDate:'10 Nov 2026',
      from:'JFK',
      to:'LHR',
      departureTime:'07:45 PM',
      arrivalTime:'07:50 AM',
      airline:'SkyFlow Atlantic',
      passengers:2,
      fare:1628,
      confirmation:'LHR5P9',
      refundable:true,
      status:'Confirmed'
    }

  ];

  pastBookings: Booking[] = [

    {
      id:3,
      destination:'Miami, FL',
      departureDate:'16 May 2026',
      returnDate:'18 May 2026',
      from:'JFK',
      to:'MIA',
      departureTime:'10:20 AM',
      arrivalTime:'01:40 PM',
      airline:'SkyFlow Domestic',
      passengers:1,
      fare:342,
      confirmation:'MIA208',
      refundable:false,
      status:'Completed'
    }

  ];

  getUpcomingBookings(){
    return this.upcomingBookings;
  }

  getPastBookings(){
    return this.pastBookings;
  }

}