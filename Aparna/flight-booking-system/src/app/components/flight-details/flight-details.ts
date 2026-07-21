import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../models/flight';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details.html',
  styleUrls: ['./flight-details.css']
})
export class FlightDetails {
  @Input({ required: true }) flight!: Flight;

  get durationLabel(): string {
    const hours = Math.floor(this.flight.durationMins / 60);
    const minutes = this.flight.durationMins % 60;
    return `${hours}h ${minutes}m`;
  }

  get stopLabel(): string {
    return this.flight.stops === 0 ? 'Non-stop' : `${this.flight.stops} stop${this.flight.stops > 1 ? 's' : ''}`;
  }
}