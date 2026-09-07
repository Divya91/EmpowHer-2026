export interface Payment {
    cardHolderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    amount: number;
}
