import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Payment } from '../models/payment';

import { PaymentResponse } from '../models/payment-response';


@Injectable({
  providedIn: 'root'
})
export class PaymentFormService {

  private apiUrl =
    'http://localhost:8080/api/payments';


  constructor(
    private http: HttpClient
  ) {}


  processPayment(
    payment: Payment
  ): Observable<PaymentResponse> {

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/process`,
      payment
    );

  }

}