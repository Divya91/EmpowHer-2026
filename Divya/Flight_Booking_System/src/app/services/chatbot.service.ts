import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<string> {
    return this.http.get(this.apiUrl, {
      params: { message },
      responseType: 'text'
    });
  }
}
