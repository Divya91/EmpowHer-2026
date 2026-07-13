import { Component, Input } from '@angular/core';
import { FlightResults } from '../../models/flightResults';

@Component({
  selector: 'app-flight-results',
  imports: [],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.css'
})
export class FlightResultsComponent {
  @Input() flightResults: FlightResults[] = [];

}
