import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightSearchComponent } from '../components/flight-search/flight-search.component';

interface Destination {
  city: string;
  country: string;
  price: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FlightSearchComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  readonly destinations: Destination[] = [
    { city: 'Paris', country: 'France', price: '45,999' },
    { city: 'London', country: 'United Kingdom', price: '46,999' },
    { city: 'Dubai', country: 'United Arab Emirates', price: '32,999' },
    { city: 'Bali', country: 'Indonesia', price: '28,999' }
  ];

}
