import { Component } from '@angular/core';
import { FlightSearchComponent } from '../components/flight-search/flight-search.component';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [FlightSearchComponent],
  templateUrl: './flights.html',
  styleUrl: './flights.css'
})
export class FlightsComponent {
}
