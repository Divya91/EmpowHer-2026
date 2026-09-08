import { Component } from '@angular/core';
import { SearchWithFilters } from '../components/search-with-filters/search-with-filters';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [SearchWithFilters],
  templateUrl: './flights.html',
  styleUrl: './flights.css'
})
export class FlightsComponent {
}
