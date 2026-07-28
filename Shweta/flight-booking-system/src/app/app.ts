import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PassengerComponent } from './components/passenger/passenger';
import { PaymentComponent } from './components/payment/payment';

@Component({
  selector: 'app-root',
  imports: [ PassengerComponent,PaymentComponent, RouterOutlet ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('flight-booking-system');
}
