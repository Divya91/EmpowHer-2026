package com.example.flight.service;

import com.example.flight.model.ChatRequest;
import com.example.flight.model.ChatResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

@Service
public class AIChatService {

    private final ChatClient chatClient;
    private final KnowledgeService knowledgeService;

    public AIChatService(
            ChatClient.Builder chatClientBuilder,
            KnowledgeService knowledgeService,
            ChatMemory chatMemory) {

        this.knowledgeService = knowledgeService;

        this.chatClient = chatClientBuilder
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory)
                                .build()
                )
                .build();
    }

    public ChatResponse chat(ChatRequest request) {

        String knowledge = knowledgeService
                .getKnowledge(request.getDomain());

        String systemPrompt = """
                You are a helpful AI assistant for a Flight Management System.

                The user has selected the domain: %s.

                Answer the user's question using ONLY the provided
                knowledge for this selected domain.

                Do not invent information.

                If the answer is not available in the provided knowledge,
                clearly say that the information is not available.

                Keep answers clear, simple, and helpful.

                KNOWLEDGE:
                %s
                """.formatted(
                request.getDomain().getDisplayName(),
                knowledge
        );

        String answer = chatClient
                .prompt()
                .system(systemPrompt)
                .user(request.getMessage())
                .advisors(advisorSpec ->
                        advisorSpec.param(
                                ChatMemory.CONVERSATION_ID,
                                request.getConversationId()
                        )
                )
                .call()
                .content();

        return new ChatResponse(
                request.getConversationId(),
                request.getDomain(),
                answer
        );
    }
}