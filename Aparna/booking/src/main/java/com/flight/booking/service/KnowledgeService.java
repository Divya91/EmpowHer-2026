package com.flight.booking.service;

import com.flight.booking.model.Domain;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KnowledgeService {

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public String getKnowledgeForDomain(Domain domain) {
        String key = "knowledge/" + domain.getResourceName() + ".txt";
        return cache.computeIfAbsent(key, this::readResourceFile);
    }

    public String getFaqForDomain(Domain domain) {
        String key = "faq/" + domain.getResourceName() + ".txt";
        return cache.computeIfAbsent(key, this::readResourceFile);
    }

    private String readResourceFile(String resourcePath) {
        try {
            ClassPathResource resource = new ClassPathResource(resourcePath);
            try (InputStream is = resource.getInputStream()) {
                return new String(is.readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            return "No reference knowledge available for resource: " + resourcePath;
        }
    }
}
