import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router , private viewportScroller: ViewportScroller) {}
  goToSection(section: string): void {

  if (this.router.url.split('?')[0] !== '/admin') {
    this.router.navigate(['/admin']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor(section);
      }, 100);
    });
  } else {
    this.viewportScroller.scrollToAnchor(section);
  }

}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  isAdmin(): boolean {
  return localStorage.getItem('role') === 'ADMIN';
}

  logout() {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }

}