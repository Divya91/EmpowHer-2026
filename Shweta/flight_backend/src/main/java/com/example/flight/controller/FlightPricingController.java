package com.example.flight.controller;

import com.example.flight.dto.FlightPricingRequestDTO;
import com.example.flight.dto.FlightPricingResponseDTO;
import com.example.flight.service.FlightPricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-pricing")
@RequiredArgsConstructor
public class FlightPricingController {

    private final FlightPricingService flightPricingService;

    @GetMapping
    public List<FlightPricingResponseDTO> getAllPricing() {
        return flightPricingService.getAllPricing();
    }

    @GetMapping("/{pricingId}")
    public FlightPricingResponseDTO getPricingById(@PathVariable Long pricingId) {
        return flightPricingService.getPricingById(pricingId);
    }

    @GetMapping("/flight/{flightId}")
    public List<FlightPricingResponseDTO> getPricingByFlightId(@PathVariable Long flightId) {
        return flightPricingService.getPricingByFlightId(flightId);
    }

    @PostMapping
    public FlightPricingResponseDTO addPricing(@RequestBody FlightPricingRequestDTO dto) {
        return flightPricingService.addPricing(dto);
    }

    @PutMapping("/{pricingId}")
    public FlightPricingResponseDTO updatePricing(@PathVariable Long pricingId,
                                                  @RequestBody FlightPricingRequestDTO dto) {
        return flightPricingService.updatePricing(pricingId, dto);
    }

    @DeleteMapping("/{pricingId}")
    public void deletePricing(@PathVariable Long pricingId) {
        flightPricingService.deletePricing(pricingId);
    }
}
