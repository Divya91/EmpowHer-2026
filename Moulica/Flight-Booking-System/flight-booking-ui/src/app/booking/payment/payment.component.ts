import { Component, EventEmitter, Output, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

import { PaymentRequest } from '../../models/payment-request';
import { PaymentResponse } from '../../models/payment-response';

import { PaymentService } from '../../services/payment.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  @Input() bookingId!: number;

  @Input() amount!: number;

  @Output() back = new EventEmitter<void>();

  @Output() paymentComplete = new EventEmitter<PaymentResponse>();

  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['credit_card', Validators.required],

      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],

      cardName: ['', Validators.required],

      expiry: ['', Validators.required],

      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
    });
  }

  goBack() {
    this.back.emit();
  }

  confirmPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();

      return;
    }

    if (!this.bookingId) {
      console.error('Booking ID is missing');

      return;
    }

    const payment: PaymentRequest = {
      bookingId: this.bookingId,

      amount: this.amount,

      paymentMethod: this.paymentForm.value.paymentMethod,

      paymentStatus: 'SUCCESS',

      transactionId: crypto.randomUUID(),
    };

    console.log('Sending Payment:', payment);

    this.paymentService.createPayment(payment).subscribe({
      next: (response: PaymentResponse) => {
        console.log('Payment successful:', response);

        this.paymentComplete.emit(response);
      },

      error: (error) => {
        console.error('Payment failed:', error);
      },
    });
  }
}
