import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancel-booking-popup',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],

  templateUrl: './cancel-booking-popup.html',
  styleUrl: './cancel-booking-popup.css'
})
export class CancelBookingPopup {

  reason = 'Changed travel plans';

  constructor(
    private dialogRef: MatDialogRef<CancelBookingPopup>,

    @Inject(MAT_DIALOG_DATA)
    public booking: any
  ) {}


  // KEEP BOOKING

  keepBooking(): void {

    this.dialogRef.close(false);

  }


  // CONFIRM CANCELLATION

  confirmCancellation(): void {

    console.log(
      'Cancelling booking:',
      this.booking.confirmation
    );

    console.log(
      'Reason:',
      this.reason
    );

    this.dialogRef.close(true);

  }


  // CLOSE X BUTTON

  closeDialog(): void {

    this.dialogRef.close(false);

  }

}