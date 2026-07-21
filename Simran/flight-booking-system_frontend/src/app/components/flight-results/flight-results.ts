import { Component,Input } from '@angular/core';
import { FlightResults } from '../../models/flightResults';

@Component({
  selector: 'app-flight-results',
  imports: [],
  standalone: true,
  templateUrl: './flight-results.html',
  styleUrl: './flight-results.css',
})
export class FlightResultsComponent {
  @Input() flightResults: FlightResults[] = [];

}
