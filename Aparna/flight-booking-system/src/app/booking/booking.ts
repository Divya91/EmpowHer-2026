import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightService } from '../services/flight.service';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../auth/services/auth';
import { FlightResults } from '../models/flightResults';

export interface Passenger {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  passportNumber: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  currentStep: 1 | 2 | 3 | 4 = 1;
  numberOfSeats = 1;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' = 'Economy';
  selectedSeatIds: string[] = ['12A'];

  passengers: Passenger[] = [];
  contactEmail = '';
  contactPhone = '';

  paymentCard = {
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  loading = true;
  booking = false;
  errorMessage = '';

  // Seat layout matrix
  seatRows = [
    { rowNum: 10, left: ['10A', '10B', '10C'], right: ['10D', '10E', '10F'] },
    { rowNum: 11, left: ['11A', '11B', '11C'], right: ['11D', '11E', '11F'] },
    { rowNum: 12, left: ['12A', '12B', '12C'], right: ['12D', '12E', '12F'] },
    { rowNum: 14, left: ['14A', '14B', '14C'], right: ['14D', '14E', '14F'] },
    { rowNum: 15, left: ['15A', '15B', '15C'], right: ['15D', '15E', '15F'] },
    { rowNum: 16, left: ['16A', '16B', '16C'], right: ['16D', '16E', '16F'] }
  ];
  occupiedSeats = new Set(['10A', '10C', '11D', '14B', '15F']);

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.contactEmail = currentUser.email;
      this.paymentCard.cardholder = currentUser.name;
    }

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
        this.updatePassengerList();
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

  setStep(step: 1 | 2 | 3 | 4): void {
    if (step > this.currentStep) {
      if (this.currentStep === 3 && !this.validatePassengerForm()) {
        return;
      }
    }
    this.currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  increaseSeats(): void {
    if (this.flight && this.numberOfSeats < this.flight.seatsLeft) {
      this.numberOfSeats++;
      this.updatePassengerList();
      this.autoAssignSeats();
    }
  }

  decreaseSeats(): void {
    if (this.numberOfSeats > 1) {
      this.numberOfSeats--;
      this.updatePassengerList();
      this.autoAssignSeats();
    }
  }

  setCabinClass(cabin: 'Economy' | 'Premium Economy' | 'Business'): void {
    this.cabinClass = cabin;
  }

  updatePassengerList(): void {
    const user = this.authService.currentUser();
    const nameParts = user ? user.name.split(' ') : ['', ''];
    while (this.passengers.length < this.numberOfSeats) {
      const idx = this.passengers.length;
      this.passengers.push({
        firstName: idx === 0 ? nameParts[0] || '' : '',
        lastName: idx === 0 ? nameParts.slice(1).join(' ') || '' : '',
        dob: '',
        gender: 'Male',
        passportNumber: ''
      });
    }
    while (this.passengers.length > this.numberOfSeats) {
      this.passengers.pop();
    }
  }

  autoAssignSeats(): void {
    const available = ['12A', '12B', '12C', '14A', '14C', '15A', '15B', '16A', '16B'];
    this.selectedSeatIds = available.slice(0, this.numberOfSeats);
  }

  toggleSeat(seatId: string): void {
    if (this.occupiedSeats.has(seatId)) return;

    if (this.selectedSeatIds.includes(seatId)) {
      if (this.selectedSeatIds.length > 1) {
        this.selectedSeatIds = this.selectedSeatIds.filter(id => id !== seatId);
      }
    } else {
      if (this.selectedSeatIds.length < this.numberOfSeats) {
        this.selectedSeatIds.push(seatId);
      } else {
        this.selectedSeatIds = [...this.selectedSeatIds.slice(1), seatId];
      }
    }
  }

  isSeatSelected(seatId: string): boolean {
    return this.selectedSeatIds.includes(seatId);
  }

  validatePassengerForm(): boolean {
    this.errorMessage = '';
    if (!this.contactEmail || !this.contactEmail.includes('@')) {
      this.errorMessage = 'Please enter a valid contact email address.';
      return false;
    }
    for (let i = 0; i < this.passengers.length; i++) {
      const p = this.passengers[i];
      if (!p.firstName.trim() || !p.lastName.trim()) {
        this.errorMessage = `Please enter first and last name for Passenger ${i + 1}.`;
        return false;
      }
    }
    return true;
  }

  validatePaymentForm(): boolean {
    this.errorMessage = '';
    if (!this.paymentCard.cardholder.trim()) {
      this.errorMessage = 'Please enter the name on card.';
      return false;
    }
    if (!this.paymentCard.cardNumber || this.paymentCard.cardNumber.replace(/\s/g, '').length < 12) {
      this.errorMessage = 'Please enter a valid 16-digit card number.';
      return false;
    }
    if (!this.paymentCard.expiry || !this.paymentCard.cvv) {
      this.errorMessage = 'Please enter card expiry date and CVV code.';
      return false;
    }
    return true;
  }

  confirmBooking(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.validatePassengerForm() || !this.validatePaymentForm()) {
      return;
    }

    if (!this.flight) return;

    this.booking = true;
    this.errorMessage = '';

    this.ticketService.bookTicket({
      userId: currentUser.id,
      flightId: this.flight.flightId,
      numberOfSeats: this.numberOfSeats
    }).subscribe({
      next: (ticket) => {
        this.booking = false;
        this.router.navigate(['/booking-confirmation', ticket.ticketId], { 
          state: { ticket, passengers: this.passengers, cabinClass: this.cabinClass, seats: this.selectedSeatIds } 
        });
      },
      error: (err) => {
        this.booking = false;
        this.errorMessage = err?.error?.message || 'Could not complete booking. Please try again.';
      }
    });
  }
}
