import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../auth/services/auth';
import { FlightResults } from '../models/flightResults';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class BookingComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly flightService = inject(FlightService);
  private readonly ticketService = inject(TicketService);
  protected readonly authService = inject(AuthService);

  flight: FlightResults | null = null;
  numberOfSeats = 1;

  loading = true;
  booking = false;
  errorMessage = '';

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('flightId');

    if (!flightId) {
      this.errorMessage = 'No flight was selected.';
      this.loading = false;
      return;
    }

    this.flightService.getFlightById(flightId).subscribe({
      next: (flight) => {
        this.flight = flight;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'This flight could not be found.';
        this.loading = false;
      }
    });
  }

  get totalPrice(): number {
    return this.flight ? this.flight.basePrice * this.numberOfSeats : 0;
  }

  increaseSeats(): void {
    if (this.flight && this.numberOfSeats < this.flight.seatsLeft) {
      this.numberOfSeats++;
    }
  }

  decreaseSeats(): void {
    if (this.numberOfSeats > 1) {
      this.numberOfSeats--;
    }
  }

  confirmBooking(): void {

    const currentUser = this.authService.currentUser();

    if (!this.flight || !currentUser) {
      return;
    }

    this.booking = true;
    this.errorMessage = '';

    this.ticketService.bookTicket({
      userId: currentUser.id,
      flightId: this.flight.flightId,
      numberOfSeats: this.numberOfSeats
    }).subscribe({
      next: (ticket) => {
        this.booking = false;
        this.router.navigate(['/booking-confirmation', ticket.ticketId], { state: { ticket } });
      },
      error: (err) => {
        this.booking = false;
        this.errorMessage = err?.error?.message || 'Could not complete the booking. Please try again.';
      }
    });

  }

}
