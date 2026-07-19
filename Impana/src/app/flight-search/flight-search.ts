import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../service/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.html',
  styleUrls: ['./flight-search.css'],
  imports: [CommonModule, FormsModule, DatePipe]
})
export class FlightSearch implements OnInit {
  // Properties bound to the template fields
  from: string = '';
  to: string = '';
  date: string = '';
  flights: any[] = [];

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  search(): void {
    if (this.from && this.to && this.date) {
      this.flightService.searchFlights(this.from, this.to, this.date).subscribe({
        next: (data) => {
          this.flights = data;
        },
        error: (err) => {
          console.error('Error fetching flights:', err);
        }
      });
    }
  }

  viewDetail(flightId: number): void {
    this.router.navigate(['/flight-detail', flightId]);
  }
}