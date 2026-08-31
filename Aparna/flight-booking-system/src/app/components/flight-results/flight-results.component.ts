import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlightResults } from '../../models/flightResults';
import { FlightDetails } from '../flight-details/flight-details';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule, FlightDetails],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.css']
})
export class FlightResultsComponent {
  @Input() flightResults: FlightResults[] = [];

  @Output() flightSelected = new EventEmitter<FlightResults>();

  expandedFlightId: string | number | null = null;

  constructor(private readonly router: Router) {}

  onSelectFlight(result: FlightResults): void {
    this.flightSelected.emit(result);
    this.router.navigate(['/booking', result.flightId]);
  }

  onViewDetails(result: FlightResults): void {
    this.expandedFlightId =
      this.expandedFlightId === result.flightId ? null : result.flightId;
  }

  isExpanded(result: FlightResults): boolean {
    return this.expandedFlightId === result.flightId;
  }
}