import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  constructor(protected readonly authService: AuthService) {}

}
