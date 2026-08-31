import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, DomainOption } from '../../services/chat.service';
import { AuthService } from '../../auth/services/auth';

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isInitial?: boolean;
}

export interface TopicChip {
  label: string;
  domain: string;
  badge: string;
  prompt: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.css'
})
export class ChatWidgetComponent implements OnInit {

  private readonly chatService = inject(ChatService);
  protected readonly authService = inject(AuthService);

  isOpen = false;
  selectedDomainCode: string | null = null;
  
  interactiveTopics: TopicChip[] = [
    {
      label: 'Cancellation & Refunds',
      domain: 'BOOKINGS_TICKETS',
      badge: 'Policy',
      prompt: 'What is the flight cancellation and refund policy?'
    },
    {
      label: 'Search & Flight Routes',
      domain: 'FLIGHTS_SEARCH',
      badge: 'Flights',
      prompt: 'How can I search flights and filter routes?'
    },
    {
      label: 'Baggage & Seat Rules',
      domain: 'FLIGHTS_SEARCH',
      badge: 'Services',
      prompt: 'What baggage allowance and seat options are available?'
    },
    {
      label: 'My Bookings Status',
      domain: 'BOOKINGS_TICKETS',
      badge: 'Trips',
      prompt: 'Show me my active bookings and trip status'
    },
    {
      label: 'Payment & Account',
      domain: 'ACCOUNT_PAYMENTS',
      badge: 'Billing',
      prompt: 'What payment methods and security options are supported?'
    }
  ];

  messages: ChatMessage[] = [
    {
      sender: 'assistant',
      text: 'Hello! I am your Meridian AI Assistant. What topic would you like assistance with today? You can select an interactive topic below or type any question directly:',
      timestamp: new Date(),
      isInitial: true
    }
  ];

  userMessage = '';
  loading = false;
  conversationId = '';

  ngOnInit(): void {
    // Domains are auto-resolved interactively based on user intent
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  selectTopic(topic: TopicChip): void {
    this.selectedDomainCode = topic.domain;
    this.userMessage = topic.prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.loading) return;

    const text = this.userMessage.trim();
    this.messages.push({
      sender: 'user',
      text: text,
      timestamp: new Date()
    });

    this.userMessage = '';
    this.loading = true;

    const currentUser = this.authService.currentUser();

    // Auto-detect domain if none explicitly clicked
    let domainToSend = this.selectedDomainCode || undefined;
    if (!domainToSend) {
      const lower = text.toLowerCase();
      if (lower.includes('cancel') || lower.includes('refund') || lower.includes('booking') || lower.includes('ticket')) {
        domainToSend = 'BOOKINGS_TICKETS';
      } else if (lower.includes('pay') || lower.includes('card') || lower.includes('account')) {
        domainToSend = 'ACCOUNT_PAYMENTS';
      } else {
        domainToSend = 'FLIGHTS_SEARCH';
      }
    }

    this.chatService.sendMessage({
      conversationId: this.conversationId || undefined,
      domain: domainToSend,
      message: text,
      userId: currentUser?.id
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.conversationId) this.conversationId = res.conversationId;
        this.messages.push({
          sender: 'assistant',
          text: this.sanitizeResponse(res.answer),
          timestamp: new Date()
        });
      },
      error: () => {
        this.loading = false;
        this.messages.push({
          sender: 'assistant',
          text: 'I am currently unable to reach the Meridian AI server. Please verify your connection or try again shortly.',
          timestamp: new Date()
        });
      }
    });
  }

  private sanitizeResponse(text: string): string {
    if (!text) return '';
    // Strip markdown asterisks and emojis
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  }
}
