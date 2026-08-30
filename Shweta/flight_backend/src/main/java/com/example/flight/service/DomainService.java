package com.example.ai_chatbot.service;

import com.example.ai_chatbot.model.Domain;
import com.example.ai_chatbot.model.DomainResponse;
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