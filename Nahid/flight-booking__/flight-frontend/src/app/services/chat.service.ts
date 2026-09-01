import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatResponse } from '../model/chat';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/chat';

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.API, { message });
  }
}
