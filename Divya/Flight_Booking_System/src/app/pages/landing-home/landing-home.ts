import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-home',
  imports: [RouterLink],
  templateUrl: './landing-home.html',
  styleUrl: '../login/login.css'
})
export class LandingHome {
  constructor(private router: Router) {}

  signInAs(role: string) {
    this.router.navigate(['/login'], { queryParams: { role } });
  }
}
