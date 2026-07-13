import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightResults } from '../../models/flightResults';

@Component({
  selector: 'app-flight-results',
  imports: [CommonModule],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.css'
})
export class FlightResultsComponent {
  @Input() flightResults: FlightResults[] = [];

}
