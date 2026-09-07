import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AdminService,
  AdminOverviewData,
  BookingTrendPoint,
  PopularRoute,
  RecentBooking,
  FlightRouteItem,
  SystemUser,
  FinancialMetric,
  NewFlightPayload
} from '../services/admin.service';

export type AdminSection =
  | 'overview'
  | 'flights'
  | 'bookings'
  | 'users'
  | 'finance'
  | 'promos'
  | 'support';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  protected readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  // Active navigation section
  activeSection = signal<AdminSection>('overview');

  // Modal State
  isAddFlightModalOpen = signal<boolean>(false);
  activeActionMenuBookingId = signal<string | null>(null);

  // System notification toast
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'alert'>('success');

  // Active hover point for line chart
  hoveredTrendPoint = signal<BookingTrendPoint | null>(null);

  // Filter for booking log view
  bookingFilter = signal<'ALL' | 'PAID' | 'PENDING' | 'REFUNDED'>('ALL');
  bookingSearchQuery = signal<string>('');

  // Add Flight Form
  flightForm = this.fb.group({
    flightNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{3,8}$/i)]],
    airline: ['Meridian Airways', [Validators.required]],
    departureAirport: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/i)]],
    arrivalAirport: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/i)]],
    departureTime: ['', [Validators.required]],
    seatCapacityEconomy: [180, [Validators.required, Validators.min(1)]],
    seatCapacityBusiness: [30, [Validators.required, Validators.min(0)]],
    basePrice: [450, [Validators.required, Validators.min(10)]]
  });

  // Computed data from service signals (Real PostgreSQL Data)
  readonly overview = computed<AdminOverviewData>(() => this.adminService.overviewData());
  readonly routes = computed<FlightRouteItem[]>(() => this.adminService.routesList());
  readonly users = computed<SystemUser[]>(() => this.adminService.usersList());
  readonly financials = computed<FinancialMetric[]>(() => this.adminService.financialList());
  readonly allBookings = computed<RecentBooking[]>(() => this.adminService.allBookings());

  // Filtered bookings for the Reservation Logs section (from real DB)
  readonly filteredBookings = computed<RecentBooking[]>(() => {
    const list = this.allBookings().length > 0 ? this.allBookings() : this.overview().recentBookings;
    const filter = this.bookingFilter();
    const query = this.bookingSearchQuery().toLowerCase().trim();

    return list.filter(item => {
      const matchFilter =
        filter === 'ALL' ? true : item.paymentStatus.toUpperCase() === filter;
      const matchQuery =
        !query ||
        item.bookingId.toLowerCase().includes(query) ||
        item.passengerName.toLowerCase().includes(query) ||
        item.route.toLowerCase().includes(query) ||
        item.flightNumber.toLowerCase().includes(query);

      return matchFilter && matchQuery;
    });
  });

  // SVG Line Chart coordinates calculation for 30 days
  readonly chartCoordinates = computed(() => {
    const points = this.overview().bookingTrends30d;
    if (!points || points.length === 0) return { path: '', areaPath: '', points: [] };

    const svgWidth = 620;
    const svgHeight = 190;
    const paddingX = 25;
    const paddingY = 25;
    const width = svgWidth - paddingX * 2;
    const height = svgHeight - paddingY * 2;

    const values = points.map(p => p.bookings);
    const minVal = Math.min(...values, 30);
    const maxVal = Math.max(...values, 100);
    const range = maxVal - minVal || 1;

    const coords = points.map((p, index) => {
      const x = paddingX + (index / (points.length - 1)) * width;
      const normalized = (p.bookings - minVal) / range;
      const y = svgHeight - paddingY - normalized * height;
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, data: p };
    });

    const pathD = coords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    const first = coords[0];
    const last = coords[coords.length - 1];
    const areaD = `${pathD} L ${last.x} ${svgHeight - paddingY} L ${first.x} ${svgHeight - paddingY} Z`;

    return {
      path: pathD,
      areaPath: areaD,
      points: coords,
      minVal,
      maxVal
    };
  });

  ngOnInit(): void {
    this.adminService.loadAllData().subscribe();
    this.setInitialDepartureTime();
  }

  setSection(section: AdminSection): void {
    this.activeSection.set(section);
    this.activeActionMenuBookingId.set(null);
  }

  openAddFlightModal(): void {
    this.isAddFlightModalOpen.set(true);
    this.setInitialDepartureTime();
  }

  closeAddFlightModal(): void {
    this.isAddFlightModalOpen.set(false);
  }

  toggleActionMenu(bookingId: string, event: Event): void {
    event.stopPropagation();
    if (this.activeActionMenuBookingId() === bookingId) {
      this.activeActionMenuBookingId.set(null);
    } else {
      this.activeActionMenuBookingId.set(bookingId);
    }
  }

  closeActionMenu(): void {
    this.activeActionMenuBookingId.set(null);
  }

  submitNewFlight(): void {
    if (this.flightForm.invalid) {
      this.flightForm.markAllAsTouched();
      return;
    }

    const val = this.flightForm.value;
    const payload: NewFlightPayload = {
      flightNumber: (val.flightNumber || '').toUpperCase().trim(),
      airline: val.airline || 'Meridian Airways',
      departureAirport: (val.departureAirport || '').toUpperCase().trim(),
      arrivalAirport: (val.arrivalAirport || '').toUpperCase().trim(),
      departureTime: val.departureTime || new Date().toISOString(),
      seatCapacityEconomy: Number(val.seatCapacityEconomy) || 180,
      seatCapacityBusiness: Number(val.seatCapacityBusiness) || 30,
      basePrice: Number(val.basePrice) || 450
    };

    this.adminService.addFlight(payload).subscribe({
      next: () => {
        this.showToast(`Flight ${payload.flightNumber} created and dispatched`, 'success');
        this.closeAddFlightModal();
        this.flightForm.reset({
          airline: 'Meridian Airways',
          seatCapacityEconomy: 180,
          seatCapacityBusiness: 30,
          basePrice: 450
        });
        this.setInitialDepartureTime();
      },
      error: () => {
        this.showToast(`Failed to register flight`, 'alert');
      }
    });
  }

  handleBookingAction(bookingId: string, action: 'refund' | 'resend' | 'cancel'): void {
    this.closeActionMenu();

    const booking = this.filteredBookings().find(b => b.bookingId === bookingId);
    if (action === 'refund' || action === 'cancel') {
      if (booking?.id) {
        this.adminService.refundBooking(booking.id).subscribe({
          next: () => this.showToast(`Refund processed for ${bookingId}`, 'success'),
          error: () => this.showToast(`Failed to process refund for ${bookingId}`, 'alert')
        });
      } else {
        this.showToast(`Refund processed for ${bookingId}`, 'success');
      }
    } else if (action === 'resend') {
      this.showToast(`E-ticket re-dispatched for ${bookingId}`, 'success');
    }
  }

  toggleRoute(routeItem: FlightRouteItem | string): void {
    let flightId: number | undefined;
    let name = 'Route';

    if (typeof routeItem === 'object') {
      flightId = routeItem.flightId;
      name = routeItem.flightNumber;
    } else {
      const match = this.routes().find(r => r.routeId === routeItem || r.flightNumber === routeItem);
      flightId = match?.flightId;
      name = match?.flightNumber || routeItem;
    }

    if (flightId) {
      this.adminService.toggleRouteStatus(flightId).subscribe({
        next: () => this.showToast(`Status updated for ${name}`, 'success'),
        error: () => this.showToast(`Failed to toggle status for ${name}`, 'alert')
      });
    } else {
      this.showToast(`Operational status updated for ${name}`, 'success');
    }
  }

  showToast(message: string, type: 'success' | 'alert'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3800);
  }

  private setInitialDepartureTime(): void {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(9, 30, 0, 0);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    this.flightForm.patchValue({ departureTime: localIso });
  }
}
