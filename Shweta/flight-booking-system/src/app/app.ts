import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';

@Component({
  selector: 'app-root',
  imports: [ FlightSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('flight-booking-system');
}
