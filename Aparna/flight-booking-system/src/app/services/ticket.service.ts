import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Ticket, TicketRequest } from '../models/ticket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/tickets`;

  bookTicket(request: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, request).pipe(
      map((ticket) => this.parseDates(ticket))
    );
  }

  getTicketsForUser(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/user/${userId}`).pipe(
      map((tickets) => tickets.map((ticket) => this.parseDates(ticket)))
    );
  }

  getTicket(ticketId: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${ticketId}`).pipe(
      map((ticket) => this.parseDates(ticket))
    );
  }

  private parseDates(ticket: Ticket): Ticket {
    return {
      ...ticket,
      departureTs: new Date(ticket.departureTs),
    };
  }
}
