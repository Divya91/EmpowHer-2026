import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  role = '';

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  ngOnInit(): void {

    this.role = this.route.snapshot.queryParams['role'] || 'Customer';

  }

  logout(): void {

    this.router.navigate(['/login']);

  }

}