import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Flight } from '../../core/services/flight.service';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.css'
})
export class FlightDetailsComponent {

  flight: Flight | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();

    this.flight =
      navigation?.extras.state?.['flight'] ??
      history.state?.flight ??
      null;
  }
}