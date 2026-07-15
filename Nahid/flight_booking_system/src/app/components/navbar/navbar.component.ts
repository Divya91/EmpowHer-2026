import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuOpen = false;
  isProfileOpen = false;

  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout(): void {
    this.isProfileOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  initials(name: string | undefined): string {

    if (!name) {
      return 'M';
    }

    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[parts.length - 1][0] : '';

    return (first + second).toUpperCase();

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (!target.closest('.profile-menu')) {
      this.isProfileOpen = false;
    }

  }

}
