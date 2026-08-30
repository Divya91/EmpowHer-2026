import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css'
})
export class BookingConfirmationComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);

  ticket: Ticket | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {

    const navigationState = history.state as { ticket?: Ticket } | undefined;

    if (navigationState?.ticket) {
      this.ticket = navigationState.ticket;
      this.ticket.departureTs = new Date(this.ticket.departureTs);
      this.loading = false;
      return;
    }

    const ticketId = Number(this.route.snapshot.paramMap.get('ticketId'));

    if (!ticketId) {
      this.errorMessage = 'No booking found.';
      this.loading = false;
      return;
    }

    this.ticketService.getTicket(ticketId).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'This booking could not be found.';
        this.loading = false;
      }
    });

  }

}
