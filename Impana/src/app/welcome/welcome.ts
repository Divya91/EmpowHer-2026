import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class Welcome {
  user: string = 'User';

  constructor(private router: Router) {}

  goToSearch() {
    this.router.navigate(['/flights-search']);
  }
}