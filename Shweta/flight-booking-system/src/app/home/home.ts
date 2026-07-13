import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightSearchComponent } from '../components/flight-search/flight-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FlightSearchComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  role = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.role =
      this.route.snapshot.queryParams['role'] || 'customer';

  }

  logout() {

    this.router.navigate(['/auth/login']);

  }

}
