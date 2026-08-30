import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PassengerService } from '../../core/services/passenger.service';
import { Passenger } from '../../core/models/passenger';

@Component({
  selector: 'app-passenger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css']
})
export class PassengerComponent {

  passenger: Passenger = {
    firstName: '',
    lastName: '',
    age: null as any,
    gender: '',
    email: '',
    phone: ''
  };

  // Selected flight
  flight: any;

  constructor(
    private passengerService: PassengerService,
    private router: Router
  ) {

    // Receive selected flight from Flight Details page
    this.flight = history.state.flight;

  }

  savePassenger() {

    if (
      this.passenger.age < 1 ||
      this.passenger.age > 120
    ) {
      alert("Age must be between 1 and 120");
      return;
    }

    this.passengerService
      .savePassenger(this.passenger)
      .subscribe({

        next: (response) => {

          console.log(response);

          alert("Passenger Saved Successfully!");

          this.passenger = response;

          // Go to Payment Page with Passenger + Flight
          this.router.navigate(['/payment'], {
            state: {
              passenger: response,
              flight: this.flight
            }
          });

        },

        error: (error) => {

          console.error(error);

          alert("Error saving passenger");

        }

      });

  }

  onlyLetters(event: KeyboardEvent) {

    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }

  }

  onlyNumbers(event: KeyboardEvent) {

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }

  }

  limitPhoneLength(event: any) {

    if (event.target.value.length > 10) {

      event.target.value =
        event.target.value.slice(0, 10);

      this.passenger.phone =
        event.target.value;

    }

  }

  limitAge(event: Event) {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, "");

    if (value === "") {

      this.passenger.age = 0;
      input.value = "";
      return;

    }

    let age = Number(value);

    if (age > 120) {
      age = 120;
    }

    this.passenger.age = age;
    input.value = age.toString();

  }

}