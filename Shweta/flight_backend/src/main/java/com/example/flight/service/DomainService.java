package com.example.flight.service;

import com.example.flight.model.Domain;
import com.example.flight.model.DomainResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DomainService {

    public List<DomainResponse> getAllDomains() {

        return Arrays.stream(Domain.values())
                .map(domain -> new DomainResponse(
                        domain.getDisplayName(),
                        domain
                ))
                .toList();
    }
}