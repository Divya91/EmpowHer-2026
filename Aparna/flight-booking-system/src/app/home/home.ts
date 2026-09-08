import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightSearchComponent } from '../components/flight-search/flight-search.component';

interface DestinationNode {
  name: string;
  country: string;
  code: string;
  image: string;
  price: string;
}

interface DestinationCard {
  city: string;
  country: string;
  price: string;
  image: string;
}

const DESTINATIONS_DATA: DestinationNode[] = [
  { name: 'Tokyo', country: 'Japan', code: 'HND', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', price: '48,500' },
  { name: 'Paris', country: 'France', code: 'CDG', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', price: '42,000' },
  { name: 'New York', country: 'United States', code: 'JFK', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', price: '56,000' },
  { name: 'Dubai', country: 'United Arab Emirates', code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', price: '28,000' },
  { name: 'London', country: 'United Kingdom', code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', price: '39,500' },
  { name: 'Singapore', country: 'Singapore', code: 'SIN', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', price: '24,500' }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FlightSearchComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  activeGlobeDest: DestinationNode = DESTINATIONS_DATA[0];

  readonly featuredDestinations: DestinationCard[] = [
    { city: 'Paris', country: 'France', price: '45,999', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
    { city: 'London', country: 'United Kingdom', price: '46,999', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
    { city: 'Tokyo', country: 'Japan', price: '58,499', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
    { city: 'Dubai', country: 'United Arab Emirates', price: '32,999', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { city: 'Bali', country: 'Indonesia', price: '28,999', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { city: 'New York', country: 'United States', price: '52,999', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' }
  ];

  onDestinationChange(dest: DestinationNode): void {
    this.activeGlobeDest = dest;
  }
}
