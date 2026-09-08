import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BookingTrendPoint {
  date: string;
  dayLabel: string;
  bookings: number;
}

export interface PopularRoute {
  route: string;
  origin: string;
  destination: string;
  volume: number;
  revenue: string;
  loadFactor: string;
  percentage: number;
}

export interface RecentBooking {
  id?: number;
  bookingId: string;
  passengerName: string;
  route: string;
  flightNumber: string;
  flightStatus: 'Scheduled' | 'Delayed' | 'In-Air' | 'Landed';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  amount: number;
  bookedAt: string;
}

export interface FlightRouteItem {
  flightId?: number;
  routeId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  aircraft: string;
  dailyFrequency: number;
  status: string;
  capacity: string;
  basePrice: number;
  departureTs?: string;
  arrivalTs?: string;
}

export interface SystemUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface FinancialMetric {
  category: string;
  volume: number;
  amount: number;
  sharePercent: number;
  status: string;
}

export interface AdminOverviewData {
  totalBookings: number;
  weekOverWeekGrowth: string;
  grossRevenue: number;
  monthlyRevenueTarget: number;
  monthlyProgressPercent: number;
  activeFlightsInAir: number;
  pendingRefundRequests: number;
  totalFlights: number;
  totalUsers: number;
  bookingTrends30d: BookingTrendPoint[];
  popularRoutes: PopularRoute[];
  recentBookings: RecentBooking[];
}

export interface NewFlightPayload {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  seatCapacityEconomy: number;
  seatCapacityBusiness: number;
  basePrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = `${environment.apiBaseUrl}/admin`;
  private readonly flightsUrl = `${environment.apiBaseUrl}/flights`;

  // Reactive State Signals (initialized empty, populated from API)
  readonly overviewData = signal<AdminOverviewData>(this.getEmptyOverview());
  readonly routesList = signal<FlightRouteItem[]>([]);
  readonly allBookings = signal<RecentBooking[]>([]);
  readonly usersList = signal<SystemUser[]>([]);
  readonly financialList = signal<FinancialMetric[]>([]);
  readonly dataLoaded = signal<boolean>(false);
  readonly dataError = signal<string | null>(null);

  /**
   * Loads the main overview dashboard data from the backend.
   */
  loadOverview(): Observable<any> {
    this.dataError.set(null);

    return this.http.get<any>(`${this.adminUrl}/overview`).pipe(
      tap((data) => {
        if (data) {
          const trends: BookingTrendPoint[] = (data.bookingTrends30d || []).map((p: any) => {
            const d = new Date(p.date + 'T00:00:00');
            return {
              date: p.date,
              dayLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              bookings: Number(p.bookings) || 0
            };
          });

          const routes: PopularRoute[] = (data.popularRoutes || []).map((r: any) => ({
            route: r.route || `${r.origin} to ${r.destination}`,
            origin: r.origin || '',
            destination: r.destination || '',
            volume: Number(r.volume) || 0,
            revenue: r.revenue || '\u20b90',
            loadFactor: r.loadFactor || 'N/A',
            percentage: Number(r.percentage) || 0
          }));

          const bookings: RecentBooking[] = (data.recentBookings || []).map((b: any) => ({
            id: b.id,
            bookingId: b.bookingId || '',
            passengerName: b.passengerName || '',
            route: b.route || '',
            flightNumber: b.flightNumber || '',
            flightStatus: b.flightStatus || 'Scheduled',
            paymentStatus: b.paymentStatus || 'Pending',
            amount: Number(b.amount) || 0,
            bookedAt: b.bookedAt || ''
          }));

          this.overviewData.set({
            totalBookings: Number(data.totalBookings) || 0,
            weekOverWeekGrowth: data.weekOverWeekGrowth || '0%',
            grossRevenue: Number(data.grossRevenue) || 0,
            monthlyRevenueTarget: Number(data.monthlyRevenueTarget) || 0,
            monthlyProgressPercent: Number(data.monthlyProgressPercent) || 0,
            activeFlightsInAir: Number(data.activeFlightsInAir) || 0,
            pendingRefundRequests: Number(data.pendingRefundRequests) || 0,
            totalFlights: Number(data.totalFlights) || 0,
            totalUsers: Number(data.totalUsers) || 0,
            bookingTrends30d: trends,
            popularRoutes: routes,
            recentBookings: bookings
          });

          this.dataLoaded.set(true);
        }
      }),
      catchError((err) => {
        this.dataError.set('Failed to load dashboard data from server. Is the backend running?');
        this.dataLoaded.set(true);
        return of(null);
      })
    );
  }

  /**
   * Loads all bookings for the reservation logs view.
   */
  loadAllBookings(): Observable<RecentBooking[]> {
    return this.http.get<any[]>(`${this.adminUrl}/bookings`).pipe(
      map((data) => (data || []).map((b: any) => ({
        id: b.id,
        bookingId: b.bookingId || '',
        passengerName: b.passengerName || '',
        route: b.route || '',
        flightNumber: b.flightNumber || '',
        flightStatus: b.flightStatus || 'Scheduled',
        paymentStatus: b.paymentStatus || 'Pending',
        amount: Number(b.amount) || 0,
        bookedAt: b.bookedAt || ''
      }))),
      tap((bookings) => this.allBookings.set(bookings)),
      catchError(() => {
        this.allBookings.set([]);
        return of([]);
      })
    );
  }

  /**
   * Loads all flight routes for route management view.
   */
  loadRoutes(): Observable<FlightRouteItem[]> {
    return this.http.get<any[]>(`${this.adminUrl}/routes`).pipe(
      map((data) => (data || []).map((r: any) => ({
        flightId: r.flightId,
        routeId: r.routeId || '',
        flightNumber: r.flightNumber || '',
        origin: r.origin || '',
        destination: r.destination || '',
        aircraft: r.aircraft || 'N/A',
        dailyFrequency: Number(r.dailyFrequency) || 1,
        status: r.status || 'Active',
        capacity: r.capacity || 'N/A',
        basePrice: Number(r.basePrice) || 0,
        departureTs: r.departureTs || '',
        arrivalTs: r.arrivalTs || ''
      }))),
      tap((routes) => this.routesList.set(routes)),
      catchError(() => {
        this.routesList.set([]);
        return of([]);
      })
    );
  }

  /**
   * Loads all users for user management view.
   */
  loadUsers(): Observable<SystemUser[]> {
    return this.http.get<any[]>(`${this.adminUrl}/users`).pipe(
      map((data) => (data || []).map((u: any) => ({
        userId: u.userId || '',
        name: u.name || '',
        email: u.email || '',
        role: u.role || 'CUSTOMER',
        status: u.status || 'Active'
      }))),
      tap((users) => this.usersList.set(users)),
      catchError(() => {
        this.usersList.set([]);
        return of([]);
      })
    );
  }

  /**
   * Loads finance data.
   */
  loadFinance(): Observable<FinancialMetric[]> {
    return this.http.get<any>(`${this.adminUrl}/finance`).pipe(
      map((data) => {
        const channels = data?.channels || [];
        return channels.map((c: any) => ({
          category: c.category || '',
          volume: Number(c.volume) || 0,
          amount: Number(c.amount) || 0,
          sharePercent: Number(c.sharePercent) || 0,
          status: c.status || 'Processing'
        }));
      }),
      tap((metrics) => this.financialList.set(metrics)),
      catchError(() => {
        this.financialList.set([]);
        return of([]);
      })
    );
  }

  /**
   * Adds a new flight by posting to the flights API.
   */
  addFlight(payload: NewFlightPayload): Observable<any> {
    return this.http.post<any>(this.flightsUrl, {
      flightNumber: payload.flightNumber,
      airline: payload.airline,
      fromAirport: payload.departureAirport,
      toAirport: payload.arrivalAirport,
      departureTime: payload.departureTime,
      seatCapacityEconomy: payload.seatCapacityEconomy,
      seatCapacityBusiness: payload.seatCapacityBusiness,
      basePrice: payload.basePrice
    }).pipe(
      tap(() => {
        // Reload routes after adding
        this.loadRoutes().subscribe();
        this.loadOverview().subscribe();
      }),
      catchError((err) => of({ status: 'error', message: 'Failed to create flight' }))
    );
  }

  /**
   * Refund or cancel a booking via admin API.
   */
  refundBooking(ticketId: number): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}/bookings/${ticketId}/refund`, {}).pipe(
      tap(() => {
        this.loadOverview().subscribe();
        this.loadAllBookings().subscribe();
        this.loadFinance().subscribe();
      }),
      catchError(() => of({ status: 'error' }))
    );
  }

  /**
   * Toggle operational status of a route/flight.
   */
  toggleRouteStatus(flightId: number): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}/routes/${flightId}/toggle`, {}).pipe(
      tap(() => {
        this.loadRoutes().subscribe();
        this.loadOverview().subscribe();
      }),
      catchError(() => of({ status: 'error' }))
    );
  }

  /**
   * Reload all dashboard data at once.
   */
  loadAllData(): Observable<any> {
    return forkJoin([
      this.loadOverview(),
      this.loadRoutes(),
      this.loadAllBookings(),
      this.loadUsers(),
      this.loadFinance()
    ]);
  }

  private getEmptyOverview(): AdminOverviewData {
    return {
      totalBookings: 0,
      weekOverWeekGrowth: '0%',
      grossRevenue: 0,
      monthlyRevenueTarget: 0,
      monthlyProgressPercent: 0,
      activeFlightsInAir: 0,
      pendingRefundRequests: 0,
      totalFlights: 0,
      totalUsers: 0,
      bookingTrends30d: [],
      popularRoutes: [],
      recentBookings: []
    };
  }
}
