import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private readonly ticketService = inject(TicketService);

  tickets: Ticket[] = [];
  loadingTickets = true;
  ticketsError = '';

  constructor(protected readonly authService: AuthService) {}

  ngOnInit(): void {

    const currentUser = this.authService.currentUser();

    if (!currentUser || this.authService.role() === 'admin') {
      this.loadingTickets = false;
      return;
    }

    this.ticketService.getTicketsForUser(currentUser.id).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loadingTickets = false;
      },
      error: () => {
        this.ticketsError = 'Could not load your trips right now.';
        this.loadingTickets = false;
      }
    });

  }

}
