import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {

  paymentForm!: FormGroup;

  fare = 5000;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.paymentForm = this.fb.group({

      paymentMethod: ['', Validators.required],

      cardHolderName: [''],

      cardNumber: [''],

      expiryDate: [''],

      cvv: [''],

    });

  }

  payNow() {

    if(this.paymentForm.valid){

      console.log(this.paymentForm.value);

      alert("Payment Successful");

    }
    else{

      this.paymentForm.markAllAsTouched();

    }

  }

}