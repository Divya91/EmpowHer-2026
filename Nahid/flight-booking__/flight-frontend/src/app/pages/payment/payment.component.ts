import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { BookingService } from '../../services/booking.service';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flightService = inject(FlightService);
  private bookingService = inject(BookingService);

  flight: Flight | null = null;
  passengers = 1;
  paymentMethod: 'CARD' | 'UPI' = 'CARD';
  isLoading = false;

  cardNumber = '';
  cardHolder = '';
  expiryDate = '';
  cvv = '';
  upiId = '';

  ngOnInit() {
    const flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.passengers = Number(this.route.snapshot.queryParamMap.get('passengers')) || 1;

    this.flightService.getFlightById(flightId).subscribe({
      next: (flight) => (this.flight = flight),
      error: () => this.router.navigate(['/home']),
    });
  }

  get totalAmount(): number {
    return this.flight ? this.flight.basePrice * this.passengers : 0;
  }

  payNow() {
    if (!this.flight) return;
    this.isLoading = true;

    this.bookingService
      .createBooking({
        flightId: this.flight.flightId,
        passengers: this.passengers,
        paymentMethod: this.paymentMethod,
        cardNumber: this.paymentMethod === 'CARD' ? this.cardNumber : undefined,
        cardHolder: this.paymentMethod === 'CARD' ? this.cardHolder : undefined,
        expiryDate: this.paymentMethod === 'CARD' ? this.expiryDate : undefined,
        cvv: this.paymentMethod === 'CARD' ? this.cvv : undefined,
        upiId: this.paymentMethod === 'UPI' ? this.upiId : undefined,
      })
      .subscribe({
        next: (booking) => {
          this.isLoading = false;
          this.router.navigate(['/confirmation', booking.bookingReference]);
        },
        error: (err) => {
          this.isLoading = false;
          alert(err.error?.message || 'Payment failed. Please try again.');
        },
      });
  }
}
