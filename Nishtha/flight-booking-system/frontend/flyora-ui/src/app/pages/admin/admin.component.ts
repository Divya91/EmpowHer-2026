import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AdminService,
  Flight,
  Booking
} from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  flights: Flight[] = [];
  bookings: Booking[] = [];
  totalFlights = 0;
totalBookings = 0;
totalRevenue = 0;
cancelledBookings = 0;

  showForm = false;

  loading = false;

  message = '';

  error = '';

  // null = creating new flight
  // number = editing existing flight
  editingFlightId: number | null = null;

  // Confirmation modal state (replaces native confirm())
  confirmDialog: { message: string; onConfirm: () => void } | null = null;


  newFlight: Flight = {

    flightNumber: '',
    airline: '',
    fromAirport: '',
    toAirport: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    cabinClass: 'ECONOMY',
    price: 0,
    availableSeats: 0

  };


  constructor(
    private adminService: AdminService
  ) {}


ngOnInit(): void {
  this.loadFlights();
  this.loadBookings();
}


  // ================= LOAD FLIGHTS =================

  loadFlights(): void {

    this.loading = true;

    this.error = '';

    this.adminService.getFlights().subscribe({

      next: (data) => {

  this.flights = data;

  this.totalFlights = data.length;

  this.loading = false;

},

      error: (err) => {

        console.error(err);

        this.error = 'Unable to load flights.';

        this.loading = false;

      }

    });

  }
  loadBookings(): void {

  this.adminService.getBookings().subscribe({

    next: (data) => {

  this.bookings = data;

  this.totalBookings = data.length;

  this.cancelledBookings =
    data.filter(
      booking => booking.bookingStatus === 'CANCELLED'
    ).length;

  this.totalRevenue =
    data
      .filter(
        booking =>
          booking.paymentStatus === 'SUCCESS' &&
          booking.bookingStatus !== 'CANCELLED'
      )
      .reduce(
        (total, booking) =>
          total + Number(booking.amount || 0),
        0
      );

},

    error: (err) => {
      console.error('Failed to load bookings:', err);
      this.error = 'Unable to load bookings.';
    }

  });
}

// ================= CONFIRMATION MODAL (replaces confirm()) =================

requestConfirm(message: string, onConfirm: () => void): void {
  this.confirmDialog = { message, onConfirm };
}

confirmYes(): void {

  if (!this.confirmDialog) {
    return;
  }

  const action = this.confirmDialog.onConfirm;

  this.confirmDialog = null;

  action();

}

confirmNo(): void {
  this.confirmDialog = null;
}

cancelBooking(id?: number): void {

  if (!id) {
    return;
  }

  this.requestConfirm(
    'Are you sure you want to cancel this booking?',
    () => {

      this.adminService.cancelBooking(id).subscribe({

        next: (updatedBooking) => {

          const index = this.bookings.findIndex(
            booking => booking.id === id
          );

          if (index !== -1) {
            this.bookings[index] = updatedBooking;
          }

          this.message = 'Booking cancelled successfully!';
        },

        error: (err) => {
          console.error(err);
          this.error = 'Failed to cancel booking.';
        }

      });

    }
  );

}
getConfirmedBookings(): number {
  return this.bookings.filter(
    booking => booking.bookingStatus === 'CONFIRMED'
  ).length;
}

getCancelledBookings(): number {
  return this.bookings.filter(
    booking => booking.bookingStatus === 'CANCELLED'
  ).length;
}


  // ================= SAVE FLIGHT =================

  saveFlight(): void {

    this.message = '';

    this.error = '';


    // EDIT EXISTING FLIGHT

    if (this.editingFlightId !== null) {

      this.adminService
        .updateFlight(
          this.editingFlightId,
          this.newFlight
        )
        .subscribe({

          next: (updatedFlight) => {

            const index =
              this.flights.findIndex(
                flight =>
                  flight.id === this.editingFlightId
              );


            if (index !== -1) {

              this.flights[index] =
                updatedFlight;

            }


            this.message =
              'Flight updated successfully!';


            this.cancelForm();

          },

          error: (err) => {

            console.error(err);

            this.error =
              'Failed to update flight.';

          }

        });

      return;

    }


    // CREATE NEW FLIGHT

    this.adminService
      .createFlight(this.newFlight)
      .subscribe({

        next: (flight) => {

          this.flights.push(flight);

          this.message =
            'Flight created successfully!';

          this.cancelForm();

        },

        error: (err) => {

          console.error(err);

          this.error =
            'Failed to create flight.';

        }

      });

  }


  // ================= EDIT FLIGHT =================

  editFlight(flight: Flight): void {

    if (flight.id === undefined) {

      return;

    }


    this.editingFlightId = flight.id;

    this.showForm = true;

    this.message = '';

    this.error = '';


    // Copy flight data into form

    this.newFlight = {

      id: flight.id,

      flightNumber: flight.flightNumber,

      airline: flight.airline,

      fromAirport: flight.fromAirport,

      toAirport: flight.toAirport,

      travelDate: flight.travelDate,

      departureTime: flight.departureTime,

      arrivalTime: flight.arrivalTime,

      cabinClass: flight.cabinClass,

      price: flight.price,

      availableSeats: flight.availableSeats

    };

  }


  // ================= DELETE FLIGHT =================

  deleteFlight(id?: number): void {

    if (id === undefined) {

      return;

    }

    this.requestConfirm(
      'Are you sure you want to delete this flight?',
      () => {

        this.adminService
          .deleteFlight(id)
          .subscribe({

            next: () => {

              this.flights =
                this.flights.filter(
                  flight =>
                    flight.id !== id
                );


              this.message =
                'Flight deleted successfully!';

            },

            error: (err) => {

              console.error(err);

              this.error =
                'Failed to delete flight.';

            }

          });

      }
    );

  }


  // ================= CANCEL FORM =================

  cancelForm(): void {

    this.showForm = false;

    this.editingFlightId = null;

    this.resetForm();

  }


  // ================= RESET FORM =================

  resetForm(): void {

    this.newFlight = {

      flightNumber: '',
      airline: '',
      fromAirport: '',
      toAirport: '',
      travelDate: '',
      departureTime: '',
      arrivalTime: '',
      cabinClass: 'ECONOMY',
      price: 0,
      availableSeats: 0

    };

  }

  scrollToSection(sectionId: string): void {

  const element = document.getElementById(sectionId);

  if (element) {

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }

}

logout(): void {

  localStorage.clear();

  window.location.href = '/login';

}

}