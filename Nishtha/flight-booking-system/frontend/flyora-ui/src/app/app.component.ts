import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(public router: Router) {}

  hideLayout(): boolean {
    return [
      '/login',
      '/register',
      '/unauthorized'
    ].includes(this.router.url);
  }
}