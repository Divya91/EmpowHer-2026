import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyBookingsComponent } from './components/booking/booking';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MyBookingsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('flight-booking-system');
}
