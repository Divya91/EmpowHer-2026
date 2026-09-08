package com.flight.booking.service;

import com.flight.booking.dto.request.ChatRequestDTO;
import com.flight.booking.dto.response.ChatResponseDTO;

public interface ChatService {

    ChatResponseDTO chat(ChatRequestDTO request, String userEmailOrNull);
}
