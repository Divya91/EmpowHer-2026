import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../model/booking';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.css',
})
export class BookingConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  booking: Booking | null = null;

  ngOnInit() {
    const ref = this.route.snapshot.paramMap.get('reference')!;
    this.bookingService.getBooking(ref).subscribe({
      next: (b) => (this.booking = b),
      error: () => alert('Could not load booking details'),
    });
  }
}
