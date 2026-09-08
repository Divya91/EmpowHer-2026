import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  AdminBooking,
  AdminService
} from '../../services/admin.services';


@Component({
  selector: 'app-manage-bookings',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './manage-bookings.html',

  styleUrl: './manage-bookings.css'
})
export class ManageBookings implements OnInit {

  bookings: AdminBooking[] = [];

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {

    this.loadBookings();

  }


  loadBookings(): void {

    this.adminService
      .getBookings()
      .subscribe(bookings => {

        this.bookings = bookings;

      });

  }


  cancelBooking(bookingId: string): void {

    const confirmation =
      confirm(
        'Are you sure you want to cancel this booking?'
      );

    if (!confirmation) {
      return;
    }

    this.adminService.cancelBooking(bookingId);

    this.loadBookings();

  }

}