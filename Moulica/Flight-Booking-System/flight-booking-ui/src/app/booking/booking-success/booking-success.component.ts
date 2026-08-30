import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.css',
})
export class BookingSuccessComponent {
  @Input() booking: any;
  @Input() passenger: any;
  @Input() payment: any;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  downloadTicket() {
    console.log('Downloading ticket...');

    // We will implement PDF ticket generation next.
  }
}
