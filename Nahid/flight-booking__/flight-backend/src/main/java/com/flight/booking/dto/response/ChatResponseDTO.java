package com.flight.booking.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponseDTO {

    private String reply;
    private List<String> suggestions;
}
