import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isOpen = false;
  currentMessage = '';
  isLoading = false;
  messages: ChatMessage[] = [
    { sender: 'bot', text: 'Hi there! I am your AI Assistant. How can I help you today?' }
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userText = this.currentMessage;
    this.messages.push({ sender: 'user', text: userText });
    this.currentMessage = '';
    this.isLoading = true;

    this.chatbotService.sendMessage(userText).subscribe({
      next: (response) => {
        this.messages.push({ sender: 'bot', text: response });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.messages.push({ sender: 'bot', text: 'Sorry, I encountered an error connecting to the server. Is Ollama running?' });
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
