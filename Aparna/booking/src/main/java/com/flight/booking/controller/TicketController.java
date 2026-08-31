package com.flight.booking.controller;

import com.flight.booking.dto.TicketRequest;
import com.flight.booking.dto.TicketResponse;
import com.flight.booking.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping({"", "/book"})
    public TicketResponse bookTicket(@RequestBody TicketRequest request) {
        return ticketService.bookTicket(request);
    }

    @GetMapping("/user/{userId}")
    public List<TicketResponse> getTicketsForUser(@PathVariable Long userId) {
        return ticketService.getTicketsForUser(userId);
    }

    @GetMapping("/{ticketId}")
    public TicketResponse getTicket(@PathVariable Long ticketId) {
        return ticketService.getTicketOrThrow(ticketId);
    }

    @RequestMapping(value = "/{ticketId}/cancel", method = {RequestMethod.PATCH, RequestMethod.POST})
    public TicketResponse cancelTicket(
            @PathVariable Long ticketId,
            @RequestParam(required = false) Long userId) {
        return ticketService.cancelTicket(ticketId, userId);
    }
}
