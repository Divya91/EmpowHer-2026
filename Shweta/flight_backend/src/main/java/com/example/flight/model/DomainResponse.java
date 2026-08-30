package com.example.ai_chatbot.model;

public class DomainResponse {

    private String name;
    private Domain value;

    public DomainResponse(String name, Domain value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public Domain getValue() {
        return value;
    }
}