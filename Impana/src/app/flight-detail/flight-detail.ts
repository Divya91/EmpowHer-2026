import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../service/flight.service';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  templateUrl: './flight-detail.html',
  imports: [CommonModule]
})
export class FlightDetail implements OnInit {
  flightId!: number;
  flight: any = null; // Set to null initially for template checks
  bookingMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadFlightDetails();
  }

  loadFlightDetails(): void {
    this.flightService.getFlightById(this.flightId).subscribe({
      next: (data) => this.flight = data,
      error: (err) => console.error('Error loading flight:', err)
    });
  }

  /**
   * Triggered when the user clicks the "Book Now" button
   */
  confirmBooking(): void {
    const mockUserId = 1; 
    
    // Pass both arguments to match the service definition perfectly!
    this.flightService.bookFlight(this.flightId, mockUserId).subscribe({
      next: (responseMessage) => {
        this.bookingMessage = responseMessage;
        this.loadFlightDetails();
      },
      error: (err) => {
        this.bookingMessage = err.error || 'Failed to complete booking.';
      }
    });
  }

  back() {
    this.router.navigate(['/flight-search']);
  }
}