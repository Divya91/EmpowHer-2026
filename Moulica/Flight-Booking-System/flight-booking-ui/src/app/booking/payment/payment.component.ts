import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() back = new EventEmitter<void>();

  @Output() paymentComplete = new EventEmitter<any>();

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
    if (this.paymentForm.valid) {
      this.paymentComplete.emit(this.paymentForm.value);
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }
}
