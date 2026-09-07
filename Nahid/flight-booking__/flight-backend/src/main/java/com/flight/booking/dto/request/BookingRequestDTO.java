package com.flight.booking.dto.request;

import com.flight.booking.entity.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Passengers count is required")
    @Min(value = 1, message = "At least 1 passenger required")
    @Max(value = 9, message = "Maximum 9 passengers allowed")
    private Short passengers;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String cardNumber;

    private String cardHolder;

    private String expiryDate;

    private String cvv;

    private String upiId;
}
