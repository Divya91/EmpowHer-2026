import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface BookingItem {
  bookingId: string;
  confirmationCode: string;
  status: 'CHECK-IN OPEN' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  destination: string;
  country: string;
  dateRange: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  arrivalOffset: string;
  airline: string;
  passengers: number;
  fare: number;
  refundable: boolean;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookings {
  // Cancel modal state
  showCancelModal = false;
  cancellingBooking: BookingItem | null = null;
  cancelSuccess = false;

  upcomingBookings: BookingItem[] = [
    {
      bookingId: 'BK-1001',
      confirmationCode: 'TYO8K4',
      status: 'CHECK-IN OPEN',
      destination: 'Tokyo, Japan',
      country: 'Japan',
      dateRange: 'Oct 12 - Oct 24, 2026',
      fromAirport: 'JFK',
      toAirport: 'HND',
      departureTime: '08:00 AM',
      arrivalTime: '2:30 PM',
      arrivalOffset: '(+1)',
      airline: 'SkyFlow Pacific',
      passengers: 1,
      fare: 1248,
      refundable: true
    },
    {
      bookingId: 'BK-1002',
      confirmationCode: 'LHR5P9',
      status: 'CONFIRMED',
      destination: 'London, UK',
      country: 'UK',
      dateRange: 'Nov 05 - Nov 10, 2026',
      fromAirport: 'JFK',
      toAirport: 'LHR',
      departureTime: '7:45 PM',
      arrivalTime: '7:50 AM',
      arrivalOffset: '(+1)',
      airline: 'SkyFlow Atlantic',
      passengers: 2,
      fare: 1628,
      refundable: true
    }
  ];

  pastBookings: BookingItem[] = [
    {
      bookingId: 'BK-0998',
      confirmationCode: 'MIA2Q8',
      status: 'COMPLETED',
      destination: 'Miami, FL',
      country: 'USA',
      dateRange: 'May 16 - May 18, 2026',
      fromAirport: 'JFK',
      toAirport: 'MIA',
      departureTime: '10:20 AM',
      arrivalTime: '1:40 PM',
      arrivalOffset: '',
      airline: 'SkyFlow Domestic',
      passengers: 1,
      fare: 342,
      refundable: false
    },
    {
      bookingId: 'BK-0995',
      confirmationCode: 'CHI7N2',
      status: 'COMPLETED',
      destination: 'Chicago, IL',
      country: 'USA',
      dateRange: 'Apr 02 - Apr 05, 2026',
      fromAirport: 'LGA',
      toAirport: 'ORD',
      departureTime: '9:00 AM',
      arrivalTime: '10:45 AM',
      arrivalOffset: '',
      airline: 'SkyFlow Domestic',
      passengers: 1,
      fare: 286,
      refundable: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getStatusClass(status: string): string {
    switch (status) {
      case 'CHECK-IN OPEN': return 'status-checkin';
      case 'CONFIRMED': return 'status-confirmed';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  openCancelModal(booking: BookingItem): void {
    this.cancellingBooking = booking;
    this.cancelSuccess = false;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.cancellingBooking = null;
    this.cancelSuccess = false;
  }

  confirmCancel(): void {
    if (!this.cancellingBooking) return;

    // Remove from upcoming bookings
    this.upcomingBookings = this.upcomingBookings.filter(
      b => b.bookingId !== this.cancellingBooking!.bookingId
    );

    this.cancelSuccess = true;

    // Auto-close after 2 seconds
    setTimeout(() => {
      this.closeCancelModal();
    }, 2000);
  }

  viewItinerary(booking: BookingItem): void {
    this.router.navigate(['/flight-detail', booking.confirmationCode]);
  }

  rebook(booking: BookingItem): void {
    this.router.navigate(['/search']);
  }
}
