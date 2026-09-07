import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  fromAirport = '';
  toAirport = '';
  departureDate = '';
  passengers = 1;

  airports = [
    { code: 'JFK', city: 'New York' },
    { code: 'LHR', city: 'London' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'DUB', city: 'Dublin' }
  ];

  popularDestinations = [
    { city: 'London', country: 'United Kingdom', code: 'LHR', price: 450, emoji: '🇬🇧' },
    { city: 'Dublin', country: 'Ireland', code: 'DUB', price: 380, emoji: '🇮🇪' },
    { city: 'New York', country: 'USA', code: 'JFK', price: 280, emoji: '🇺🇸' },
    { city: 'Los Angeles', country: 'USA', code: 'LAX', price: 320, emoji: '🇺🇸' }
  ];

  features = [
    { icon: '💰', title: 'Best Prices', desc: 'We compare prices from top airlines to find you the best deal every time.' },
    { icon: '🔒', title: 'Secure Payments', desc: 'Bank-level encryption keeps your card details and personal data safe.' },
    { icon: '🕐', title: '24/7 Support', desc: 'Our travel experts are available around the clock for any assistance.' },
    { icon: '⚡', title: 'Instant Booking', desc: 'Book flights in seconds with our streamlined, hassle-free process.' }
  ];

  constructor(private router: Router) {}

  searchFlights(): void {
    this.router.navigate(['/search']);
  }

  exploreDestination(code: string): void {
    this.router.navigate(['/search']);
  }
}
