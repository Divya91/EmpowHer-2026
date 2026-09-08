import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class MyBookingsComponent implements OnInit {

  upcomingBookings: Booking[] = [];

  pastBookings: Booking[] = [];

  showPopup=false;

  selectedBooking!:Booking;

  constructor(private bookingService:BookingService){}

  ngOnInit(): void {

    this.upcomingBookings=this.bookingService.getUpcomingBookings();

    this.pastBookings=this.bookingService.getPastBookings();

  }

  openPopup(booking:Booking){

    this.selectedBooking=booking;

    this.showPopup=true;

  }

  closePopup(){

    this.showPopup=false;

  }

}
