import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlightListComponent } from './components/flight-list/flight-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlightListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'flight-management-frontend';
}
