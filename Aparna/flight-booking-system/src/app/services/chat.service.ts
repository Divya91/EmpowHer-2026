import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DomainOption {
  code: string;
  displayName: string;
}

export interface ChatMessageRequest {
  conversationId?: string;
  domain: string;
  message: string;
  userId?: number;
}

export interface ChatMessageResponse {
  conversationId: string;
  domain: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/chat`;

  getDomains(): Observable<DomainOption[]> {
    return this.http.get<DomainOption[]>(`${this.baseUrl}/domains`);
  }

  sendMessage(request: ChatMessageRequest): Observable<ChatMessageResponse> {
    return this.http.post<ChatMessageResponse>(this.baseUrl, request);
  }
}
