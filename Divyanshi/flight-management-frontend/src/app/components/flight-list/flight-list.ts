import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../models/flight';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.css',
})
export class FlightListComponent implements OnInit {
  flights = signal<Flight[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.flightService.getAllFlights().subscribe({
      next: (data) => {
        this.flights.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching flights:', err);
        this.errorMessage.set('Failed to load flights. Is your Spring Boot server running?');
        this.loading.set(false);
      },
    });
  }

  deleteFlight(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.deleteFlight(id).subscribe({
        next: () => {
          this.flights.update((current) => current.filter((f) => f.id !== id));
        },
        error: (err) => {
          console.error('Error deleting flight:', err);
        },
      });
    }
  }
}
