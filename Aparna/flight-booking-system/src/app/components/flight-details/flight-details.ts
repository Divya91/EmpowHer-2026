import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightResults } from '../../models/flightResults';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details.html',
  styleUrls: ['./flight-details.css']
})
export class FlightDetails {
  @Input({ required: true }) flight!: FlightResults;

  get durationLabel(): string {
    if (!this.flight || !this.flight.durationMins) return '2h 15m';
    const hours = Math.floor(this.flight.durationMins / 60);
    const minutes = this.flight.durationMins % 60;
    return `${hours}h ${minutes}m`;
  }

  get stopLabel(): string {
    if (!this.flight) return 'Non-stop';
    return this.flight.stops === 0 ? 'Non-stop (Direct)' : `${this.flight.stops} Stop`;
  }

  get seatsAvailable(): number {
    return this.flight.seatsLeft || 24;
  }
}