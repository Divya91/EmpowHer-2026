package com.flight.booking.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupResponseDTO {

    private Long userId;

    private String name;

    private String email;

    private String message;

}