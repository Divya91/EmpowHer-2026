import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../auth/services/auth';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookingsComponent implements OnInit {

  private readonly ticketService = inject(TicketService);
  protected readonly authService = inject(AuthService);

  tickets: Ticket[] = [];
  activeTab: 'all' | 'upcoming' | 'past' | 'cancelled' = 'all';

  loading = true;
  errorMessage = '';
  cancelledSuccessMessage = '';

  // Cancel modal state
  ticketToCancel: Ticket | null = null;
  cancelling = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.loading = false;
      this.errorMessage = 'Please log in to view your bookings.';
      return;
    }

    this.loadTickets(user.id);
  }

  loadTickets(userId: number): void {
    this.loading = true;
    this.ticketService.getTicketsForUser(userId).subscribe({
      next: (tickets) => {
        this.tickets = tickets.sort((a, b) => Number(b.ticketId) - Number(a.ticketId));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load your trip history.';
        this.loading = false;
      }
    });
  }

  get filteredTickets(): Ticket[] {
    const now = new Date();
    return this.tickets.filter(ticket => {
      const depDate = new Date(ticket.departureTs);
      const isCancelled = ticket.status === 'CANCELLED';
      const isPast = !isCancelled && depDate <= now;
      const isUpcoming = !isCancelled && depDate > now;

      if (this.activeTab === 'upcoming') return isUpcoming;
      if (this.activeTab === 'past') return isPast;
      if (this.activeTab === 'cancelled') return isCancelled;
      return true;
    });
  }

  isUpcoming(ticket: Ticket): boolean {
    return ticket.status !== 'CANCELLED' && new Date(ticket.departureTs) > new Date();
  }

  openCancelModal(ticket: Ticket): void {
    this.ticketToCancel = ticket;
  }

  closeCancelModal(): void {
    this.ticketToCancel = null;
  }

  confirmCancellation(): void {
    if (!this.ticketToCancel) return;

    const user = this.authService.currentUser();
    const targetTicketId = this.ticketToCancel.ticketId;
    const flightNum = this.ticketToCancel.flightNumber;
    this.cancelling = true;

    this.ticketService.cancelTicket(Number(targetTicketId), user?.id).subscribe({
      next: (updatedTicket) => {
        this.cancelling = false;
        const index = this.tickets.findIndex(t => t.ticketId === updatedTicket.ticketId);
        if (index !== -1) {
          this.tickets[index] = updatedTicket;
        }
        this.cancelledSuccessMessage = `Ticket #${targetTicketId} for flight ${flightNum} is now cancelled. Seats have been returned to flight inventory.`;
        this.closeCancelModal();
      },
      error: (err) => {
        this.cancelling = false;
        alert(err?.error?.message || 'Could not cancel ticket. Please try again.');
      }
    });
  }
}
