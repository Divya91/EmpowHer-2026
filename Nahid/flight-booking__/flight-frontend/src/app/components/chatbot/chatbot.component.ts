import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  private chatService = inject(ChatService);

  @ViewChild('messagesBox') messagesBox!: ElementRef<HTMLDivElement>;

  isOpen = false;
  isTyping = false;
  input = '';
  messages: ChatMessage[] = [];
  suggestions: string[] = [
    'How do I search flights?',
    'Airport codes',
    'Payment methods',
    'Demo login',
  ];

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.addBotMessage(
        "Hi! I'm SkyBot — your SkySafar assistant. Ask me about flights, bookings, payments, or airport codes!",
      );
    }
  }

  send(text?: string) {
    const msg = (text ?? this.input).trim();
    if (!msg || this.isTyping) return;

    this.messages.push({ text: msg, from: 'user', time: new Date() });
    this.input = '';
    this.isTyping = true;
    this.scrollToBottom();

    this.chatService.sendMessage(msg).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.addBotMessage(res.reply);
        if (res.suggestions?.length) {
          this.suggestions = res.suggestions;
        }
      },
      error: () => {
        this.isTyping = false;
        this.addBotMessage('Sorry, I had trouble connecting. Please try again in a moment.');
      },
    });
  }

  useSuggestion(s: string) {
    this.send(s);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private addBotMessage(text: string) {
    this.messages.push({ text, from: 'bot', time: new Date() });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesBox?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
