import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {

  message = '';

  isOpen = false;

  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Hi! I’m Skye ✈️ How can I help you today?'
    }
  ];

  loading = false;

  constructor(private chatService: ChatService) {}

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {

    const userMessage = this.message.trim();

    if (!userMessage || this.loading) {
      return;
    }

    this.messages.push({
      sender: 'user',
      text: userMessage
    });

    this.message = '';
    this.loading = true;

    this.chatService.sendMessage(userMessage).subscribe({

      next: (response) => {

        this.messages.push({
          sender: 'bot',
          text: response
        });

        this.loading = false;
      },

      error: (error) => {

        console.error('Chat error:', error);

        this.messages.push({
          sender: 'bot',
          text: 'Sorry, I’m unable to connect to Skye right now.'
        });

        this.loading = false;
      }

    });
  }

  handleEnter(event: KeyboardEvent): void {

    if (event.key === 'Enter' && !event.shiftKey) {

      event.preventDefault();
      this.sendMessage();
    }
  }
}