import { Component, HostListener, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isMenuOpen = false;
  isProfileOpen = false;
  shouldAnimate = false;
  reducedMotion = false;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.shouldAnimate = !this.reducedMotion;
      this.cdr.markForCheck();
    }
  }

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
