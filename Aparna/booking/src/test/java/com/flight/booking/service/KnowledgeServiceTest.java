package com.flight.booking.service;

import com.flight.booking.model.Domain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class KnowledgeServiceTest {

    private KnowledgeService knowledgeService;

    @BeforeEach
    void setUp() {
        knowledgeService = new KnowledgeService();
    }

    @Test
    @DisplayName("getKnowledgeForDomain - Valid domain loads static knowledge text")
    void getKnowledgeForDomain_validDomain_returnsStaticKnowledgeText() {
        // Act
        String text = knowledgeService.getKnowledgeForDomain(Domain.FLIGHTS_SEARCH);

        // Assert
        assertNotNull(text);
        assertTrue(text.contains("Meridian Flight Search System Reference Knowledge"));
    }

    @Test
    @DisplayName("getFaqForDomain - Valid domain loads FAQ text")
    void getFaqForDomain_validDomain_returnsFaqText() {
        // Act
        String text = knowledgeService.getFaqForDomain(Domain.BOOKINGS_TICKETS);

        // Assert
        assertNotNull(text);
        assertTrue(text.contains("Frequently Asked Questions"));
    }
}
