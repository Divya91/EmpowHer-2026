export interface ChatMessage {
  text: string;
  from: 'user' | 'bot';
  time: Date;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}
