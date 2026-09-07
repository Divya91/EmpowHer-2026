import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight-service';
import { flightResult } from '../../model/flightResult';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-detail.html',
  styleUrls: ['./flight-detail.css']
})
export class FlightDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flightService = inject(FlightService);

  flightId = '';
  flight?: flightResult;
  loading = true;

  ngOnInit() {
    this.flightId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.flightId) {
      this.loadFlightDetails();
    } else {
      this.loading = false;
    }
  }

  loadFlightDetails(): void {
    this.loading = true;
    this.flightService.getFlightById(this.flightId).subscribe({
      next: (data) => {
        this.flight = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching flight details:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }

  bookFlight(): void {
    if (this.flight) {
      this.router.navigate(['/payment'], {
        state: { flight: this.flight }
      });
    }
  }
}