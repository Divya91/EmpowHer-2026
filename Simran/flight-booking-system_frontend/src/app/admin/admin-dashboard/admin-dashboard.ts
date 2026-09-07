import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../services/admin.services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  adminName = 'Admin';

  totalFlights = 0;
  totalBookings = 0;
  confirmedBookings = 0;
  cancelledBookings = 0;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = this.authService.getCurrentUser();

    if (user) {
      this.adminName = user.name;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.totalFlights =
      this.adminService.getTotalFlights();

    this.totalBookings =
      this.adminService.getTotalBookings();

    this.confirmedBookings =
      this.adminService.getConfirmedBookings();

    this.cancelledBookings =
      this.adminService.getCancelledBookings();
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/auth/login']);
  }
}