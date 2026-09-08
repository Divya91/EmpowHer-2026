import './index.css';
import { SkyRouteStore } from './services/store.service';
import { renderNavbar } from './components/navbar';
import { renderFooter } from './components/footer';
import { renderHomeView } from './components/home-view';
import { renderFlightSearchView } from './components/flight-search-view';
import { renderSeatMapView } from './components/seat-map-view';
import { renderBookingCheckoutView } from './components/booking-checkout-view';
import { renderTicketConfirmationView } from './components/ticket-confirmation-view';
import { renderBookingHistoryView } from './components/booking-history-view';
import { renderAdminDashboardView } from './components/admin-dashboard-view';
import { renderAiAssistantWidget } from './components/ai-assistant-widget';
import { renderCancellationModal } from './components/cancellation-modal';
import { renderAuthModal } from './components/auth-modal';
import { renderNotificationPanel } from './components/notification-center';
import { renderToastContainer } from './components/toast-container';
import { FlightResponseDto, BookingResponseDto, ChatMessageDto, ToastItem, TripType, MultiCityLeg } from './types';
import { downloadTicketAsFile, printTicketDocument } from './utils/ticket-downloader';

class SkyRouteApp {
  private store = SkyRouteStore.getInstance();
  private appRoot: HTMLElement;

  // Active Navigation & View State
  private currentRoute: 'home' | 'search' | 'seat-map' | 'checkout' | 'confirmation' | 'history' | 'admin' = 'home';
  
  // Trip Type State
  private tripType: TripType = 'ONE_WAY';

  // Flight Search Params
  private searchOrigin = 'BLR';
  private searchDestination = 'DEL';
  private searchDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  private returnDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
  private multiCityLegs: MultiCityLeg[] = [
    { id: 'leg-1', origin: 'BLR', destination: 'DEL', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] },
    { id: 'leg-2', origin: 'DEL', destination: 'BOM', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] },
    { id: 'leg-3', origin: 'BOM', destination: 'BLR', date: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0] }
  ];
  private selectedCabinClass = 'ECONOMY';
  private passengerCount = 1;
  private selectedSort = 'cheapest';
  private filterState = { maxPrice: 30000, airline: 'ALL', nonStopOnly: false };

  // Search Results Multi-Flight Selection State
  private selectedOutboundFlight: FlightResponseDto | null = null;
  private selectedReturnFlight: FlightResponseDto | null = null;
  private selectedMultiCityFlights: { [legIndex: number]: FlightResponseDto | null } = {};
  private activeRoundTripTab: 'outbound' | 'return' = 'outbound';
  private activeMultiCityLegIndex: number = 0;

  // Search Result Lists
  private outboundFlightsList: FlightResponseDto[] = [];
  private returnFlightsList: FlightResponseDto[] = [];
  private multiCityFlightsLists: FlightResponseDto[][] = [];

  // Current In-Progress Booking & Seat Selection
  private selectedFlight: FlightResponseDto | null = null;
  private selectedSeats: string[] = ['14A'];
  private selectedOutboundSeats: string[] = ['14A'];
  private selectedReturnSeats: string[] = ['16F'];
  private selectedMultiCitySeats: { [legIndex: number]: string[] } = { 0: ['14A'], 1: ['16F'], 2: ['12C'] };
  private activeSeatLeg: string = 'outbound';

  // Checkout Steps & Payment
  private checkoutStep: number = 1;
  private selectedPaymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' = 'CARD';
  private upiSubMode: 'ID' | 'QR' = 'ID';
  private selectedBank: string = 'HDFC';
  private selectedAddons: { insurance: boolean; meal: string; baggage: string } = {
    insurance: true,
    meal: 'VEG',
    baggage: '0'
  };
  private confirmedBooking: BookingResponseDto | null = null;
  private paymentTimeRemaining: number = 600; // 10 minutes session lock
  private paymentTimerInterval: any = null;

  // Booking History Tab
  private historyTab: 'UPCOMING' | 'COMPLETED' | 'CANCELLED' = 'UPCOMING';

  // Cancellation Modal State
  private activeCancelBookingId: number | null = null;
  private activeCancelPnr: string = '';
  private activeCancelAmount: number = 0;

  // Auth Modal State
  private isAuthModalOpen: boolean = false;
  private authModalMode: 'login' | 'register' = 'login';

  // Mobile Navigation Drawer State
  private isMobileMenuOpen: boolean = false;

  // Notification Center & Toast System State
  private isNotificationPanelOpen: boolean = false;
  private notifFilter: 'ALL' | 'FLIGHTS' | 'BOOKINGS' | 'OFFERS' = 'ALL';
  private activeToasts: ToastItem[] = [];
  private toastTimeouts: Map<string, any> = new Map();

  // AI Assistant Chat State
  private isAiDrawerOpen: boolean = false;
  private aiMessages: ChatMessageDto[] = [];

  constructor() {
    this.appRoot = document.getElementById('app') || document.body;
    this.selectedFlight = this.store.flights[0];
    this.selectedOutboundFlight = this.store.flights[0];
    this.render();
  }

  public navigate(route: any, params?: any) {
    this.currentRoute = route;
    this.isMobileMenuOpen = false;
    this.isNotificationPanelOpen = false;
    if (params) {
      if (params.flight) this.selectedFlight = params.flight;
      if (params.step) this.checkoutStep = params.step;
      if (params.booking) this.confirmedBooking = params.booking;
    }

    if (this.currentRoute === 'checkout' && this.checkoutStep === 3) {
      this.startPaymentTimer();
    } else {
      this.stopPaymentTimer();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  public showToast(
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'alert' = 'info',
    pnr?: string,
    actionLabel?: string,
    actionRoute?: string
  ) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const toastItem: ToastItem = {
      id,
      title,
      message,
      type,
      timestamp: Date.now(),
      pnr,
      actionLabel,
      actionRoute
    };
    this.activeToasts.unshift(toastItem);
    if (this.activeToasts.length > 4) {
      this.activeToasts.pop();
    }
    this.render();

    const timeout = setTimeout(() => {
      this.dismissToast(id);
    }, 5500);
    this.toastTimeouts.set(id, timeout);
  }

  public dismissToast(id: string) {
    if (this.toastTimeouts.has(id)) {
      clearTimeout(this.toastTimeouts.get(id));
      this.toastTimeouts.delete(id);
    }
    this.activeToasts = this.activeToasts.filter(t => t.id !== id);
    this.render();
  }

  private startPaymentTimer(resetTime: boolean = false) {
    if (resetTime || this.paymentTimeRemaining <= 0) {
      this.paymentTimeRemaining = 600; // 10 minutes
    }
    if (this.paymentTimerInterval) {
      clearInterval(this.paymentTimerInterval);
    }
    this.paymentTimerInterval = setInterval(() => {
      if (this.paymentTimeRemaining > 0) {
        this.paymentTimeRemaining--;
        this.updatePaymentTimerDisplay();
      } else {
        this.handlePaymentTimeout();
      }
    }, 1000);
  }

  private stopPaymentTimer() {
    if (this.paymentTimerInterval) {
      clearInterval(this.paymentTimerInterval);
      this.paymentTimerInterval = null;
    }
  }

  private updatePaymentTimerDisplay() {
    const minutes = Math.floor(this.paymentTimeRemaining / 60);
    const seconds = this.paymentTimeRemaining % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const displayEl = document.getElementById('payment-timer-display');
    if (displayEl) {
      displayEl.textContent = formatted;
      if (this.paymentTimeRemaining <= 60) {
        displayEl.className = 'font-mono text-base font-black text-rose-600 animate-pulse';
      } else if (this.paymentTimeRemaining <= 180) {
        displayEl.className = 'font-mono text-base font-black text-amber-600';
      } else {
        displayEl.className = 'font-mono text-base font-black text-blue-700';
      }
    }

    const bannerEl = document.getElementById('payment-timer-banner');
    if (bannerEl) {
      if (this.paymentTimeRemaining <= 60) {
        bannerEl.className = 'p-3.5 rounded-xl border flex items-center justify-between transition-all bg-rose-50 border-rose-200 text-rose-800';
      } else if (this.paymentTimeRemaining <= 180) {
        bannerEl.className = 'p-3.5 rounded-xl border flex items-center justify-between transition-all bg-amber-50 border-amber-200 text-amber-800';
      }
    }
  }

  private handlePaymentTimeout() {
    this.stopPaymentTimer();
    const bannerEl = document.getElementById('payment-timer-banner');
    if (bannerEl) {
      bannerEl.innerHTML = `
        <div class="flex items-center space-x-2.5 text-rose-700">
          <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold">Payment Session Expired</p>
            <p class="text-[11px] text-rose-600">Your fare and seat hold have timed out. Please restart payment to refresh live fares.</p>
          </div>
        </div>
        <button id="restart-payment-session-btn" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors">
          Restart Session
        </button>
      `;
      document.getElementById('restart-payment-session-btn')?.addEventListener('click', () => {
        this.paymentTimeRemaining = 600;
        this.startPaymentTimer(true);
        this.render();
      });
    }

    const payConfirmBtn = document.getElementById('pay-confirm-btn') as HTMLButtonElement | null;
    if (payConfirmBtn) {
      payConfirmBtn.disabled = true;
      payConfirmBtn.className = 'px-6 py-2.5 rounded-lg font-bold text-xs text-slate-400 bg-slate-200 cursor-not-allowed flex items-center space-x-1.5';
      payConfirmBtn.innerHTML = `<span>Session Expired</span>`;
    }
  }

  private performFlightSearch() {
    if (this.tripType === 'ONE_WAY') {
      this.outboundFlightsList = this.store.searchFlights(this.searchOrigin, this.searchDestination, this.searchDate);
      this.selectedOutboundFlight = this.outboundFlightsList[0] || null;
      this.selectedFlight = this.selectedOutboundFlight;
    } else if (this.tripType === 'ROUND_TRIP') {
      this.outboundFlightsList = this.store.searchFlights(this.searchOrigin, this.searchDestination, this.searchDate);
      this.returnFlightsList = this.store.searchFlights(this.searchDestination, this.searchOrigin, this.returnDate);
      this.selectedOutboundFlight = this.outboundFlightsList[0] || null;
      this.selectedReturnFlight = this.returnFlightsList[0] || null;
      this.selectedFlight = this.selectedOutboundFlight;
    } else if (this.tripType === 'MULTI_CITY') {
      this.multiCityFlightsLists = this.multiCityLegs.map(leg => 
        this.store.searchFlights(leg.origin, leg.destination, leg.date)
      );
      const multiMap: { [legIndex: number]: FlightResponseDto | null } = {};
      this.multiCityFlightsLists.forEach((list, idx) => {
        multiMap[idx] = list[0] || this.store.flights[0];
      });
      this.selectedMultiCityFlights = multiMap;
      this.selectedFlight = multiMap[0] || null;
    }
  }

  private getFilteredAndSortedFlights(rawList?: FlightResponseDto[]): FlightResponseDto[] {
    const sourceList = rawList || (this.outboundFlightsList.length > 0 ? this.outboundFlightsList : this.store.searchFlights(this.searchOrigin, this.searchDestination, this.searchDate));
    
    let list = sourceList.filter(f => {
      const matchesPrice = f.totalPrice <= this.filterState.maxPrice;
      const matchesAirline = this.filterState.airline === 'ALL' || f.airlineCode === this.filterState.airline;
      const matchesStops = !this.filterState.nonStopOnly || f.stops === 0;
      return matchesPrice && matchesAirline && matchesStops;
    });

    if (this.selectedSort === 'cheapest') {
      list.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (this.selectedSort === 'fastest') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (this.selectedSort === 'earliest') {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    return list;
  }

  private render() {
    let mainContentHtml = '';

    switch (this.currentRoute) {
      case 'home':
        mainContentHtml = renderHomeView(
          this.tripType,
          this.searchOrigin,
          this.searchDestination,
          this.searchDate,
          this.returnDate,
          this.multiCityLegs,
          this.selectedCabinClass,
          this.passengerCount
        );
        break;

      case 'search':
        // Ensure flights are populated
        if (this.outboundFlightsList.length === 0) {
          this.performFlightSearch();
        }

        const currentActiveList = this.tripType === 'ROUND_TRIP' 
          ? (this.activeRoundTripTab === 'return' ? this.returnFlightsList : this.outboundFlightsList)
          : this.tripType === 'MULTI_CITY'
          ? (this.multiCityFlightsLists[this.activeMultiCityLegIndex] || this.store.flights)
          : this.outboundFlightsList;

        const currentSearchOrigin = this.tripType === 'MULTI_CITY' 
          ? (this.multiCityLegs[this.activeMultiCityLegIndex]?.origin || this.searchOrigin)
          : (this.activeRoundTripTab === 'return' ? this.searchDestination : this.searchOrigin);

        const currentSearchDest = this.tripType === 'MULTI_CITY' 
          ? (this.multiCityLegs[this.activeMultiCityLegIndex]?.destination || this.searchDestination)
          : (this.activeRoundTripTab === 'return' ? this.searchOrigin : this.searchDestination);

        const currentSearchDate = this.tripType === 'MULTI_CITY'
          ? (this.multiCityLegs[this.activeMultiCityLegIndex]?.date || this.searchDate)
          : (this.activeRoundTripTab === 'return' ? this.returnDate : this.searchDate);

        mainContentHtml = renderFlightSearchView(
          this.getFilteredAndSortedFlights(currentActiveList),
          currentSearchOrigin,
          currentSearchDest,
          currentSearchDate,
          this.selectedSort,
          this.filterState,
          this.tripType,
          this.returnDate,
          this.multiCityLegs,
          this.selectedOutboundFlight,
          this.selectedReturnFlight,
          this.selectedMultiCityFlights,
          this.activeRoundTripTab,
          this.activeMultiCityLegIndex
        );
        break;

      case 'seat-map':
        const multiCityFlightList = Object.values(this.selectedMultiCityFlights).filter((f): f is FlightResponseDto => f !== null);
        const activeFlightForSeat = this.tripType === 'ROUND_TRIP'
          ? (this.activeSeatLeg === 'return' ? this.selectedReturnFlight : this.selectedOutboundFlight) || this.selectedFlight || this.store.flights[0]
          : this.tripType === 'MULTI_CITY'
          ? (this.selectedMultiCityFlights[parseInt(this.activeSeatLeg, 10)] || this.selectedFlight || this.store.flights[0])
          : (this.selectedFlight || this.store.flights[0]);

        const seats = this.store.getSeatsForSchedule(activeFlightForSeat.scheduleId);
        const currentActiveSeats = this.tripType === 'ROUND_TRIP'
          ? (this.activeSeatLeg === 'return' ? this.selectedReturnSeats : this.selectedOutboundSeats)
          : this.tripType === 'MULTI_CITY'
          ? (this.selectedMultiCitySeats[parseInt(this.activeSeatLeg, 10)] || ['14A'])
          : this.selectedSeats;

        mainContentHtml = renderSeatMapView(
          activeFlightForSeat,
          seats,
          currentActiveSeats,
          this.tripType,
          this.selectedOutboundFlight,
          this.selectedReturnFlight,
          multiCityFlightList,
          this.selectedOutboundSeats,
          this.selectedReturnSeats,
          this.selectedMultiCitySeats,
          this.activeSeatLeg
        );
        break;

      case 'checkout':
        const primaryFlight = this.selectedFlight || this.selectedOutboundFlight || this.store.flights[0];
        const multiCityFlightsArray = Object.values(this.selectedMultiCityFlights).filter((f): f is FlightResponseDto => f !== null);
        mainContentHtml = renderBookingCheckoutView(
          primaryFlight,
          this.selectedSeats,
          this.checkoutStep,
          this.selectedPaymentMethod,
          this.selectedAddons,
          this.upiSubMode,
          this.selectedBank,
          this.paymentTimeRemaining,
          this.tripType,
          this.selectedReturnFlight,
          multiCityFlightsArray,
          this.selectedReturnSeats,
          this.selectedMultiCitySeats
        );
        break;

      case 'confirmation':
        if (this.confirmedBooking) {
          mainContentHtml = renderTicketConfirmationView(this.confirmedBooking);
        } else if (this.store.bookings.length > 0) {
          mainContentHtml = renderTicketConfirmationView(this.store.bookings[0]);
        } else {
          mainContentHtml = renderHomeView(this.tripType, this.searchOrigin, this.searchDestination, this.searchDate, this.returnDate, this.multiCityLegs, this.selectedCabinClass, this.passengerCount);
        }
        break;

      case 'history':
        mainContentHtml = renderBookingHistoryView(this.store.bookings, this.historyTab);
        break;

      case 'admin':
        const metrics = {
          totalUsers: 1420,
          totalFlights: this.store.flights.length,
          totalBookings: this.store.bookings.length + 328,
          todayBookings: 18,
          totalRevenue: 2458000,
          cancelledBookings: 14,
          pendingRefunds: this.store.refunds.filter(r => r.refundStatus === 'PROCESSING').length,
          activeFlights: this.store.flights.length,
          revenueTrends: [
            { date: 'Mon', revenue: 24000, bookings: 4 },
            { date: 'Tue', revenue: 38500, bookings: 6 },
            { date: 'Wed', revenue: 45000, bookings: 8 },
            { date: 'Thu', revenue: 52000, bookings: 9 },
            { date: 'Fri', revenue: 68000, bookings: 12 },
            { date: 'Sat', revenue: 85000, bookings: 15 },
            { date: 'Sun', revenue: 92000, bookings: 16 }
          ],
          popularRoutes: [
            { route: 'BLR → DEL', bookings: 142, revenue: '₹9,20,000' },
            { route: 'BLR → BOM', bookings: 118, revenue: '₹5,40,000' },
            { route: 'BOM → DEL', bookings: 95, revenue: '₹4,85,000' },
            { route: 'BLR → DXB', bookings: 48, revenue: '₹8,80,000' },
            { route: 'BLR → SIN', bookings: 34, revenue: '₹7,50,000' }
          ],
          airlineDistribution: [
            { airline: 'IndiGo (6E)', share: 45 },
            { airline: 'Air India (AI)', share: 28 },
            { airline: 'Emirates (EK)', share: 12 },
            { airline: 'Akasa Air (QP)', share: 10 },
            { airline: 'Singapore Airlines (SQ)', share: 5 }
          ],
          cancellationRate: 3.8
        };
        mainContentHtml = renderAdminDashboardView(metrics, this.store.refunds);
        break;

      default:
        mainContentHtml = renderHomeView(this.tripType, this.searchOrigin, this.searchDestination, this.searchDate, this.returnDate, this.multiCityLegs, this.selectedCabinClass, this.passengerCount);
    }

    const isAdmin = this.store.currentUser?.roles?.includes('ROLE_ADMIN');

    const html = `
      <div class="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900">
        ${renderNavbar(this.currentRoute, this.isMobileMenuOpen)}
        <main class="flex-1">
          ${mainContentHtml}
        </main>
        ${renderFooter()}

        <!-- Floating Role Toggle Circular Button (Top Right) -->
        <button id="floating-role-toggle-btn" title="Toggle Mode (${isAdmin ? 'Currently Admin Mode - Click for Passenger' : 'Currently Passenger Mode - Click for Admin'})" class="fixed top-20 right-14 sm:right-18 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/95 backdrop-blur-sm text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center border border-slate-700 group">
          ${isAdmin ? `
            <svg class="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-900"></span>
          ` : `
            <svg class="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          `}
        </button>

        ${renderAiAssistantWidget(this.isAiDrawerOpen, this.aiMessages)}
        ${renderNotificationPanel(this.isNotificationPanelOpen, this.notifFilter)}
        ${renderToastContainer(this.activeToasts)}
        ${this.activeCancelBookingId ? renderCancellationModal(this.activeCancelBookingId, this.activeCancelPnr, this.activeCancelAmount) : ''}
        ${this.isAuthModalOpen ? renderAuthModal(this.authModalMode) : ''}
      </div>
    `;

    this.appRoot.innerHTML = html;
    this.attachEventListeners();
  }

  private attachEventListeners() {
    // Top Nav Links (Desktop)
    document.getElementById('nav-brand')?.addEventListener('click', () => this.navigate('home'));
    document.getElementById('nav-home-btn')?.addEventListener('click', () => this.navigate('home'));
    document.getElementById('nav-search-btn')?.addEventListener('click', () => {
      this.performFlightSearch();
      this.navigate('search');
    });
    document.getElementById('nav-history-btn')?.addEventListener('click', () => this.navigate('history'));
    document.getElementById('nav-admin-btn')?.addEventListener('click', () => this.navigate('admin'));
    document.getElementById('dropdown-history-btn')?.addEventListener('click', () => this.navigate('history'));
    document.getElementById('dropdown-admin-btn')?.addEventListener('click', () => this.navigate('admin'));
    document.getElementById('dropdown-notif-btn')?.addEventListener('click', () => {
      this.isNotificationPanelOpen = true;
      this.render();
    });

    // Trip Type Selector in Home View (One Way, Round Trip, Multi-City)
    document.querySelectorAll('.trip-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = (btn.getAttribute('data-triptype') || btn.getAttribute('data-type')) as TripType;
        if (type) {
          // Read and preserve any currently typed inputs
          const origEl = document.getElementById('search-origin-select') as HTMLSelectElement;
          const destEl = document.getElementById('search-dest-select') as HTMLSelectElement;
          const depDateEl = document.getElementById('search-dep-date') as HTMLInputElement;
          const retDateEl = document.getElementById('search-return-date') as HTMLInputElement;
          const cabinEl = document.getElementById('cabin-class-select') as HTMLSelectElement;
          const paxEl = document.getElementById('passengers-count-select') as HTMLSelectElement;

          if (origEl) this.searchOrigin = origEl.value;
          if (destEl) this.searchDestination = destEl.value;
          if (depDateEl) this.searchDate = depDateEl.value;
          if (retDateEl) this.returnDate = retDateEl.value;
          if (cabinEl) this.selectedCabinClass = cabinEl.value;
          if (paxEl) this.passengerCount = parseInt(paxEl.value, 10) || 1;

          this.tripType = type;
          this.activeRoundTripTab = 'outbound';
          this.activeMultiCityLegIndex = 0;
          this.activeSeatLeg = 'outbound';
          this.render();
        }
      });
    });

    // Cabin class & Passenger count dropdown changes
    document.getElementById('cabin-class-select')?.addEventListener('change', (e) => {
      this.selectedCabinClass = (e.target as HTMLSelectElement).value;
    });

    document.getElementById('passengers-count-select')?.addEventListener('change', (e) => {
      this.passengerCount = parseInt((e.target as HTMLSelectElement).value, 10) || 1;
    });

    // Multi-City Leg Management (Add / Remove Leg in Home View)
    document.getElementById('add-multi-leg-btn')?.addEventListener('click', () => {
      if (this.multiCityLegs.length < 4) {
        const lastLeg = this.multiCityLegs[this.multiCityLegs.length - 1];
        const newOrigin = lastLeg ? lastLeg.destination : 'BOM';
        const newDest = newOrigin === 'BLR' ? 'DEL' : 'BLR';
        const lastDate = lastLeg ? new Date(lastLeg.date) : new Date();
        const nextDate = new Date(lastDate.getTime() + 86400000 * 3).toISOString().split('T')[0];

        this.multiCityLegs.push({
          id: `leg-${this.multiCityLegs.length + 1}`,
          origin: newOrigin,
          destination: newDest,
          date: nextDate
        });
        this.render();
      }
    });

    document.getElementById('add-city-leg-btn')?.addEventListener('click', () => {
      if (this.multiCityLegs.length < 6) {
        const lastLeg = this.multiCityLegs[this.multiCityLegs.length - 1];
        const newOrigin = lastLeg ? lastLeg.destination : 'BOM';
        const newDest = newOrigin === 'BLR' ? 'DEL' : 'BLR';
        const lastDate = lastLeg ? new Date(lastLeg.date) : new Date();
        const nextDate = new Date(lastDate.getTime() + 86400000 * 3).toISOString().split('T')[0];

        this.multiCityLegs.push({
          id: `leg-${this.multiCityLegs.length + 1}`,
          origin: newOrigin,
          destination: newDest,
          date: nextDate
        });
        this.render();
      }
    });

    document.querySelectorAll('.remove-multi-leg-btn, .remove-city-leg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index') || '0', 10);
        if (this.multiCityLegs.length > 2) {
          this.multiCityLegs.splice(index, 1);
          this.render();
        }
      });
    });

    // Multi-City Input Changes (Sync to state)
    document.querySelectorAll('.multi-leg-origin, .multicity-orig-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(sel.getAttribute('data-index') || '0', 10);
        if (this.multiCityLegs[idx]) {
          this.multiCityLegs[idx].origin = (e.target as HTMLSelectElement).value;
        }
      });
    });

    document.querySelectorAll('.multi-leg-dest, .multicity-dest-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(sel.getAttribute('data-index') || '0', 10);
        if (this.multiCityLegs[idx]) {
          this.multiCityLegs[idx].destination = (e.target as HTMLSelectElement).value;
        }
      });
    });

    document.querySelectorAll('.multi-leg-date, .multicity-date-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const idx = parseInt(inp.getAttribute('data-index') || '0', 10);
        if (this.multiCityLegs[idx]) {
          this.multiCityLegs[idx].date = (e.target as HTMLInputElement).value;
        }
      });
    });

    // Notification Trigger Button (Desktop & Mobile)
    document.getElementById('nav-notifications-btn')?.addEventListener('click', () => {
      this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
      this.render();
    });
    document.getElementById('mobile-nav-notif-btn')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      this.isNotificationPanelOpen = true;
      this.render();
    });

    // Notification Panel Controls
    document.getElementById('close-notification-panel-btn')?.addEventListener('click', () => {
      this.isNotificationPanelOpen = false;
      this.render();
    });
    document.getElementById('notification-backdrop')?.addEventListener('click', () => {
      this.isNotificationPanelOpen = false;
      this.render();
    });

    // Notification Filter Tabs
    document.querySelectorAll('.notif-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') as 'ALL' | 'FLIGHTS' | 'BOOKINGS' | 'OFFERS';
        if (filter) {
          this.notifFilter = filter;
          this.render();
        }
      });
    });

    // Mark all as read
    document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
      this.store.markAllNotificationsAsRead();
      this.showToast('Notifications Marked Read', 'All notifications have been marked as read.', 'info');
      this.render();
    });

    // Clear all notifications
    document.getElementById('clear-all-notifs-btn')?.addEventListener('click', () => {
      this.store.clearAllNotifications();
      this.showToast('Notifications Cleared', 'All notifications have been removed.', 'info');
      this.render();
    });

    // Delete single notification
    document.querySelectorAll('.notif-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id') || '0', 10);
        if (id) {
          this.store.deleteNotification(id);
          this.render();
        }
      });
    });

    // Mark single notification read on click
    document.querySelectorAll('.notif-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id') || '0', 10);
        if (id) {
          this.store.markNotificationAsRead(id);
        }
      });
    });

    // View ticket from notification item
    document.querySelectorAll('.notif-view-ticket-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pnr = btn.getAttribute('data-pnr');
        const booking = this.store.bookings.find(b => b.pnr === pnr);
        if (booking) {
          this.confirmedBooking = booking;
          this.isNotificationPanelOpen = false;
          this.navigate('confirmation', { booking });
        } else {
          this.isNotificationPanelOpen = false;
          this.navigate('history');
        }
      });
    });

    // Search Deals from notification
    document.querySelectorAll('.notif-search-deal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isNotificationPanelOpen = false;
        this.searchOrigin = 'BLR';
        this.searchDestination = 'BOM';
        this.tripType = 'ONE_WAY';
        this.performFlightSearch();
        this.navigate('search');
      });
    });

    // Notification Simulator Triggers
    document.getElementById('sim-gate-change-btn')?.addEventListener('click', () => {
      const flightNum = this.selectedFlight?.flightNumber || '6E-1234';
      const gates = ['14A', '18B', '22C', '09D', '04F'];
      const randomGate = gates[Math.floor(Math.random() * gates.length)];
      this.store.addNotification({
        title: `Gate Change: Flight ${flightNum}`,
        message: `Boarding gate has been changed to Terminal 2, Gate ${randomGate}. Proceed to security check immediately.`,
        notificationType: 'GATE_CHANGE',
        priority: 'URGENT',
        pnr: 'SK8942',
        flightNumber: flightNum
      });
      this.showToast(`Gate Change Alert (${flightNum})`, `Now boarding from Terminal 2, Gate ${randomGate}`, 'alert', 'SK8942');
      this.render();
    });

    document.getElementById('sim-flight-delay-btn')?.addEventListener('click', () => {
      const flightNum = this.selectedFlight?.flightNumber || 'AI-505';
      const delayMins = [15, 25, 30, 45][Math.floor(Math.random() * 4)];
      this.store.addNotification({
        title: `Schedule Advisory: ${flightNum}`,
        message: `Flight ${flightNum} is rescheduled by +${delayMins} minutes due to air traffic control clearance. New departure updated.`,
        notificationType: 'FLIGHT_UPDATE',
        priority: 'HIGH',
        flightNumber: flightNum
      });
      this.showToast(`Flight Advisory: ${flightNum}`, `Rescheduled by +${delayMins} mins due to air traffic`, 'warning');
      this.render();
    });

    document.getElementById('sim-checkin-btn')?.addEventListener('click', () => {
      this.store.addNotification({
        title: 'Web Check-in Ready',
        message: 'Web check-in is open for your upcoming Bengaluru (BLR) to New Delhi (DEL) trip. Select your free seat.',
        notificationType: 'CHECKIN',
        priority: 'HIGH',
        pnr: 'SK8942'
      });
      this.showToast('Web Check-in Live', 'Select seats and generate boarding pass for PNR SK8942', 'info', 'SK8942');
      this.render();
    });

    document.getElementById('sim-price-drop-btn')?.addEventListener('click', () => {
      this.store.addNotification({
        title: 'Flash Sale: BLR → DEL ₹4,299',
        message: 'IndiGo special airfare drop on Bengaluru to New Delhi routes. Limited seats remaining for next week travel.',
        notificationType: 'OFFER',
        priority: 'NORMAL'
      });
      this.showToast('Flash Price Drop!', 'BLR → DEL flights dropped to ₹4,299. Book now!', 'success');
      this.render();
    });

    // Toast item dismiss and action clicks
    document.querySelectorAll('.toast-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) this.dismissToast(id);
      });
    });

    document.querySelectorAll('.toast-view-ticket-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pnr = btn.getAttribute('data-pnr');
        const booking = this.store.bookings.find(b => b.pnr === pnr);
        if (booking) {
          this.confirmedBooking = booking;
          this.navigate('confirmation', { booking });
        } else {
          this.navigate('history');
        }
      });
    });

    document.querySelectorAll('.toast-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const route = btn.getAttribute('data-route');
        if (route) this.navigate(route);
      });
    });

    // Mobile Navigation Controls
    document.getElementById('mobile-menu-toggle-btn')?.addEventListener('click', () => {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.render();
    });
    document.getElementById('mobile-nav-home-btn')?.addEventListener('click', () => this.navigate('home'));
    document.getElementById('mobile-nav-search-btn')?.addEventListener('click', () => {
      this.performFlightSearch();
      this.navigate('search');
    });
    document.getElementById('mobile-nav-history-btn')?.addEventListener('click', () => this.navigate('history'));
    document.getElementById('mobile-nav-admin-btn')?.addEventListener('click', () => this.navigate('admin'));
    document.getElementById('mobile-nav-login-btn')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      this.isAuthModalOpen = true;
      this.authModalMode = 'login';
      this.render();
    });
    document.getElementById('mobile-nav-logout-btn')?.addEventListener('click', () => {
      this.store.currentUser = null;
      this.store.persistState();
      this.isMobileMenuOpen = false;
      this.render();
    });

    // Floating Role Switcher (Passenger <-> Admin)
    document.getElementById('floating-role-toggle-btn')?.addEventListener('click', () => {
      if (this.store.currentUser?.roles.includes('ROLE_ADMIN')) {
        const existingPassenger = this.store.registeredUsers.find(u => !u.roles.includes('ROLE_ADMIN') && !u.email.includes('admin')) || {
          id: 2,
          email: 'john.doe@example.com',
          fullName: 'Johnathan Doe',
          phoneNumber: '+91 9123456789',
          roles: ['ROLE_USER']
        };
        this.store.currentUser = existingPassenger;
        if (this.currentRoute === 'admin') {
          this.currentRoute = 'home';
        }
      } else {
        const existingAdmin = this.store.registeredUsers.find(u => u.roles.includes('ROLE_ADMIN')) || {
          id: 1,
          email: 'admin@skyroute.com',
          fullName: 'SkyRoute Operations Admin',
          phoneNumber: '+91 9876543210',
          roles: ['ROLE_ADMIN', 'ROLE_USER']
        };
        this.store.currentUser = existingAdmin;
      }
      this.store.persistState();
      this.render();
    });

    document.getElementById('nav-login-btn')?.addEventListener('click', () => {
      this.isAuthModalOpen = true;
      this.authModalMode = 'login';
      this.render();
    });

    document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
      this.store.currentUser = null;
      this.store.persistState();
      this.render();
    });

    // Hero Flight Search Form Submission
    document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = (document.getElementById('search-origin-select') as HTMLSelectElement)?.value || this.searchOrigin;
      const dest = (document.getElementById('search-dest-select') as HTMLSelectElement)?.value || this.searchDestination;
      const date = (document.getElementById('search-dep-date') as HTMLInputElement)?.value || this.searchDate;
      const retDate = (document.getElementById('search-return-date') as HTMLInputElement)?.value || (document.getElementById('search-ret-date') as HTMLInputElement)?.value || this.returnDate;
      const cabinEl = document.getElementById('cabin-class-select') as HTMLSelectElement;
      const paxEl = document.getElementById('passengers-count-select') as HTMLSelectElement;

      if (cabinEl) this.selectedCabinClass = cabinEl.value;
      if (paxEl) this.passengerCount = parseInt(paxEl.value, 10) || 1;

      this.searchOrigin = origin;
      this.searchDestination = dest;
      this.searchDate = date;
      this.returnDate = retDate;

      this.performFlightSearch();
      this.activeRoundTripTab = 'outbound';
      this.activeMultiCityLegIndex = 0;
      this.navigate('search');
    });

    // Swap Airports Button
    document.getElementById('swap-airports-btn')?.addEventListener('click', () => {
      const origEl = document.getElementById('search-origin-select') as HTMLSelectElement;
      const destEl = document.getElementById('search-dest-select') as HTMLSelectElement;
      if (origEl && destEl) {
        const temp = origEl.value;
        origEl.value = destEl.value;
        destEl.value = temp;
        this.searchOrigin = origEl.value;
        this.searchDestination = destEl.value;
      }
    });

    // Trip Type Switcher within Search Results Header
    document.querySelectorAll('.search-triptype-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = (btn.getAttribute('data-triptype') || btn.getAttribute('data-type')) as TripType;
        if (type) {
          this.tripType = type;
          this.activeRoundTripTab = 'outbound';
          this.activeMultiCityLegIndex = 0;
          this.activeSeatLeg = 'outbound';
          this.performFlightSearch();
          this.render();
        }
      });
    });

    // Modify Search Button in Search View (Navigate to Home)
    document.getElementById('modify-search-home-btn')?.addEventListener('click', () => {
      this.navigate('home');
    });

    // Roundtrip Step Tabs Switching (Outbound vs Return)
    document.querySelectorAll('.roundtrip-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as 'outbound' | 'return';
        if (tab) {
          this.activeRoundTripTab = tab;
          this.render();
        }
      });
    });

    // Multi-City Step Tabs Switching
    document.querySelectorAll('.multicity-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
        this.activeMultiCityLegIndex = idx;
        this.render();
      });
    });

    // Quick route chips
    document.querySelectorAll('.quick-route-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const from = chip.getAttribute('data-from') || 'BLR';
        const to = chip.getAttribute('data-to') || 'DEL';
        this.tripType = 'ONE_WAY';
        this.searchOrigin = from;
        this.searchDestination = to;
        this.performFlightSearch();
        this.navigate('search');
      });
    });

    // Destination Cards
    document.querySelectorAll('.card-dest').forEach(card => {
      card.addEventListener('click', () => {
        const from = card.getAttribute('data-origin') || 'BLR';
        const to = card.getAttribute('data-dest') || 'DEL';
        this.tripType = 'ONE_WAY';
        this.searchOrigin = from;
        this.searchDestination = to;
        this.performFlightSearch();
        this.navigate('search');
      });
    });

    document.getElementById('view-all-flights-btn')?.addEventListener('click', () => {
      this.performFlightSearch();
      this.navigate('search');
    });

    // Search Result Leg Tab Switching (Outbound vs Return vs Multi-City Legs)
    document.querySelectorAll('.search-leg-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const leg = btn.getAttribute('data-leg');
        if (leg === 'outbound' || leg === 'return') {
          this.activeRoundTripTab = leg;
        } else if (leg !== null) {
          this.activeMultiCityLegIndex = parseInt(leg, 10) || 0;
        }
        this.render();
      });
    });

    // Select Outbound Flight in Search Results
    document.querySelectorAll('.select-outbound-flight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const flightId = parseInt(btn.getAttribute('data-flight-id') || '0', 10);
        const flight = this.outboundFlightsList.find(f => f.id === flightId) || this.store.flights.find(f => f.id === flightId);
        if (flight) {
          this.selectedOutboundFlight = flight;
          this.selectedFlight = flight;
          if (this.tripType === 'ROUND_TRIP' && !this.selectedReturnFlight) {
            this.activeRoundTripTab = 'return';
          }
          this.render();
        }
      });
    });

    // Select Return Flight in Search Results
    document.querySelectorAll('.select-return-flight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const flightId = parseInt(btn.getAttribute('data-flight-id') || '0', 10);
        const flight = this.returnFlightsList.find(f => f.id === flightId) || this.store.flights.find(f => f.id === flightId);
        if (flight) {
          this.selectedReturnFlight = flight;
          this.render();
        }
      });
    });

    // Select Multi-City Flight in Search Results
    document.querySelectorAll('.select-multicity-flight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const legIndex = parseInt(btn.getAttribute('data-leg-index') || '0', 10);
        const flightId = parseInt(btn.getAttribute('data-flight-id') || '0', 10);
        const list = this.multiCityFlightsLists[legIndex] || this.store.flights;
        const flight = list.find(f => f.id === flightId) || this.store.flights.find(f => f.id === flightId);
        if (flight) {
          this.selectedMultiCityFlights[legIndex] = flight;
          if (legIndex < this.multiCityLegs.length - 1) {
            this.activeMultiCityLegIndex = legIndex + 1;
          }
          this.render();
        }
      });
    });

    // Select Flight Button (One Way)
    document.querySelectorAll('.select-flight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const flightId = parseInt(btn.getAttribute('data-flight-id') || '1', 10);
        const flight = this.store.flights.find(f => f.id === flightId) || this.store.flights[0];
        this.selectedFlight = flight;
        this.selectedOutboundFlight = flight;
        this.selectedSeats = ['14A'];
        this.selectedOutboundSeats = ['14A'];
        this.activeSeatLeg = 'outbound';
        this.navigate('seat-map');
      });
    });

    // Proceed from Search Results Bottom Bar to Seat Selection
    document.getElementById('proceed-itinerary-btn')?.addEventListener('click', () => {
      this.selectedFlight = this.selectedOutboundFlight || this.store.flights[0];
      this.selectedSeats = ['14A'];
      this.selectedOutboundSeats = ['14A'];
      this.selectedReturnSeats = ['16F'];
      this.activeSeatLeg = 'outbound';
      this.navigate('seat-map');
    });

    // Flight Search Filters & Sorting
    document.getElementById('filter-nonstop')?.addEventListener('change', (e) => {
      this.filterState.nonStopOnly = (e.target as HTMLInputElement).checked;
      this.render();
    });

    document.getElementById('filter-price-range')?.addEventListener('input', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value, 10);
      this.filterState.maxPrice = val;
      const lbl = document.getElementById('price-val-label');
      if (lbl) lbl.textContent = `₹${val.toLocaleString()}`;
    });

    document.getElementById('filter-price-range')?.addEventListener('change', (e) => {
      this.filterState.maxPrice = parseInt((e.target as HTMLInputElement).value, 10);
      this.render();
    });

    document.getElementById('filter-airline-select')?.addEventListener('change', (e) => {
      this.filterState.airline = (e.target as HTMLSelectElement).value;
      this.render();
    });

    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      this.filterState = { maxPrice: 30000, airline: 'ALL', nonStopOnly: false };
      this.render();
    });

    document.getElementById('empty-reset-btn')?.addEventListener('click', () => {
      this.filterState = { maxPrice: 30000, airline: 'ALL', nonStopOnly: false };
      this.render();
    });

    document.querySelectorAll('.sort-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedSort = btn.getAttribute('data-sort') || 'cheapest';
        this.render();
      });
    });

    // Seat Map Leg Segment Tabs (Roundtrip / Multi-City Seat Navigation)
    document.querySelectorAll('.seatmap-leg-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const leg = btn.getAttribute('data-leg');
        if (leg) {
          this.activeSeatLeg = leg;
          if (leg === 'outbound') {
            this.selectedFlight = this.selectedOutboundFlight || this.store.flights[0];
            this.selectedSeats = this.selectedOutboundSeats.length > 0 ? this.selectedOutboundSeats : ['14A'];
          } else if (leg === 'return') {
            this.selectedFlight = this.selectedReturnFlight || this.store.flights[1] || this.store.flights[0];
            this.selectedSeats = this.selectedReturnSeats.length > 0 ? this.selectedReturnSeats : ['16F'];
          } else {
            const idx = parseInt(leg, 10) || 0;
            const multiLegFlight = this.selectedMultiCityFlights[idx] || (this.multiCityFlightsLists[idx] ? this.multiCityFlightsLists[idx][0] : null) || this.store.flights[0];
            this.selectedFlight = multiLegFlight;
            this.selectedSeats = this.selectedMultiCitySeats[idx] || ['14A'];
          }
          this.render();
        }
      });
    });

    // Seat Map Selection
    document.querySelectorAll('.seat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const seat = btn.getAttribute('data-seat');
        if (seat) {
          if (this.tripType === 'ROUND_TRIP') {
            if (this.activeSeatLeg === 'return') {
              this.selectedReturnSeats = [seat];
            } else {
              this.selectedOutboundSeats = [seat];
            }
            this.selectedSeats = [seat];
          } else if (this.tripType === 'MULTI_CITY') {
            const idx = parseInt(this.activeSeatLeg, 10) || 0;
            this.selectedMultiCitySeats[idx] = [seat];
            this.selectedSeats = [seat];
          } else {
            this.selectedSeats = [seat];
          }
          this.render();
        }
      });
    });

    document.getElementById('confirm-seat-btn')?.addEventListener('click', () => {
      this.checkoutStep = 1;
      this.navigate('checkout');
    });

    document.getElementById('skip-seat-btn')?.addEventListener('click', () => {
      this.selectedSeats = ['14A'];
      this.selectedOutboundSeats = ['14A'];
      this.selectedReturnSeats = ['16F'];
      this.checkoutStep = 1;
      this.navigate('checkout');
    });

    // Checkout Forms & Steps
    document.getElementById('passenger-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.checkoutStep = 2;
      this.render();
    });

    // Step 2 Add-ons changes
    document.getElementById('addon-insurance')?.addEventListener('change', (e) => {
      this.selectedAddons.insurance = (e.target as HTMLInputElement).checked;
    });

    document.getElementById('addon-meal-select')?.addEventListener('change', (e) => {
      this.selectedAddons.meal = (e.target as HTMLSelectElement).value;
    });

    document.getElementById('addon-baggage-select')?.addEventListener('change', (e) => {
      this.selectedAddons.baggage = (e.target as HTMLSelectElement).value;
    });

    document.getElementById('step2-back-btn')?.addEventListener('click', () => {
      this.checkoutStep = 1;
      this.stopPaymentTimer();
      this.render();
    });

    document.getElementById('step2-next-btn')?.addEventListener('click', () => {
      this.checkoutStep = 3;
      this.startPaymentTimer(true);
      this.render();
    });

    document.getElementById('step3-back-btn')?.addEventListener('click', () => {
      this.checkoutStep = 2;
      this.stopPaymentTimer();
      this.render();
    });

    // Payment Method Switching Tabs
    document.querySelectorAll('.pay-method-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const method = tab.getAttribute('data-method') as 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
        if (method) {
          this.selectedPaymentMethod = method;
          this.render();
        }
      });
    });

    // UPI Sub-mode Toggles
    document.querySelectorAll('.upi-submode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as 'ID' | 'QR';
        if (mode) {
          this.upiSubMode = mode;
          this.render();
        }
      });
    });

    // Payment Form Submission & Ticket Generation
    document.getElementById('payment-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const primaryFlight = this.selectedFlight || this.selectedOutboundFlight || this.store.flights[0];
      if (!primaryFlight) return;

      const pnr = 'SK' + Math.floor(1000 + Math.random() * 9000);
      const multiCityFlightList = Object.values(this.selectedMultiCityFlights).filter((f): f is FlightResponseDto => f !== null);

      let baseFare = primaryFlight.baseFare;
      let taxes = primaryFlight.taxAmount;
      let totalFlightPrice = primaryFlight.totalPrice;
      let seatCount = this.selectedSeats.length || 1;

      if (this.tripType === 'ROUND_TRIP' && this.selectedReturnFlight) {
        baseFare = primaryFlight.baseFare + this.selectedReturnFlight.baseFare;
        taxes = primaryFlight.taxAmount + this.selectedReturnFlight.taxAmount;
        totalFlightPrice = primaryFlight.totalPrice + this.selectedReturnFlight.totalPrice;
        seatCount = (this.selectedOutboundSeats.length || 1) + (this.selectedReturnSeats.length || 1);
      } else if (this.tripType === 'MULTI_CITY' && multiCityFlightList.length > 0) {
        baseFare = multiCityFlightList.reduce((acc, f) => acc + f.baseFare, 0);
        taxes = multiCityFlightList.reduce((acc, f) => acc + f.taxAmount, 0);
        totalFlightPrice = multiCityFlightList.reduce((acc, f) => acc + f.totalPrice, 0);
        seatCount = multiCityFlightList.length;
      }

      const seatCharge = seatCount * 250;
      const mealCharge = this.selectedAddons.meal === 'VEG' ? 350 : this.selectedAddons.meal === 'NON_VEG' ? 400 : 0;
      const baggageCharge = this.selectedAddons.baggage === '5' ? 1800 : this.selectedAddons.baggage === '10' ? 3500 : 0;
      const insuranceCharge = this.selectedAddons.insurance ? 299 : 0;
      const totalAddons = mealCharge + baggageCharge + insuranceCharge;
      const calculatedTotal = totalFlightPrice + seatCharge + totalAddons;

      const newBooking: BookingResponseDto = {
        id: this.store.bookings.length + 1,
        pnr,
        bookingStatus: 'CONFIRMED',
        cabinClass: this.selectedCabinClass,
        passengerCount: 1,
        baseAmount: baseFare,
        seatCharges: seatCharge,
        addonCharges: totalAddons,
        taxAmount: taxes,
        discountAmount: 0,
        totalAmount: calculatedTotal,
        contactEmail: this.store.currentUser?.email || 'passenger@skyroute.com',
        contactPhone: this.store.currentUser?.phoneNumber || '+91 9876543210',
        createdAt: new Date().toISOString(),
        flight: primaryFlight,
        tripType: this.tripType,
        returnFlight: this.selectedReturnFlight || undefined,
        multiCityFlights: multiCityFlightList.length > 0 ? multiCityFlightList : undefined,
        returnSeats: this.selectedReturnSeats,
        multiCitySeats: this.selectedMultiCitySeats,
        passengers: [
          {
            id: 1,
            firstName: this.store.currentUser?.fullName.split(' ')[0] || 'John',
            lastName: this.store.currentUser?.fullName.split(' ').slice(1).join(' ') || 'Doe',
            dateOfBirth: '1992-06-15',
            gender: 'MALE',
            passengerType: 'ADULT',
            seatNumber: this.selectedSeats[0] || '14A',
            insuranceOpted: this.selectedAddons.insurance
          }
        ],
        paymentStatus: 'SUCCESS',
        isCancellable: true,
        eligibleRefundAmount: Math.max(0, calculatedTotal - 500)
      };

      this.stopPaymentTimer();
      this.store.bookings.unshift(newBooking);

      // Create Booking Notification and trigger Toast
      const routeText = this.tripType === 'ROUND_TRIP' && this.selectedReturnFlight
        ? `${primaryFlight.originIata} ⇄ ${primaryFlight.destinationIata} (Roundtrip)`
        : this.tripType === 'MULTI_CITY'
        ? `Multi-City (${multiCityFlightList.length} Flights)`
        : `${primaryFlight.originIata} → ${primaryFlight.destinationIata}`;

      this.store.addNotification({
        title: `Booking Confirmed: ${routeText}`,
        message: `Your reservation for PNR ${pnr} is confirmed. Total ₹${calculatedTotal.toLocaleString()} charged.`,
        notificationType: 'BOOKING',
        pnr,
        flightNumber: primaryFlight.flightNumber,
        priority: 'NORMAL'
      });
      this.showToast('Booking Confirmed!', `PNR ${pnr} confirmed for ${routeText}`, 'success', pnr);

      this.store.persistState();
      this.confirmedBooking = newBooking;
      this.navigate('confirmation', { booking: newBooking });
    });

    // Ticket Confirmation Actions (Download & Print)
    document.getElementById('download-ticket-btn')?.addEventListener('click', () => {
      if (this.confirmedBooking) {
        downloadTicketAsFile(this.confirmedBooking);
      }
    });

    document.getElementById('print-ticket-btn')?.addEventListener('click', () => {
      if (this.confirmedBooking) {
        printTicketDocument(this.confirmedBooking);
      } else {
        window.print();
      }
    });

    document.getElementById('view-history-btn')?.addEventListener('click', () => {
      this.navigate('history');
    });

    // History Tabs
    document.querySelectorAll('.history-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.historyTab = (btn.getAttribute('data-tab') || 'UPCOMING') as any;
        this.render();
      });
    });

    document.getElementById('history-search-flight-btn')?.addEventListener('click', () => {
      this.performFlightSearch();
      this.navigate('search');
    });

    // Download Ticket directly from History list
    document.querySelectorAll('.download-history-ticket-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pnr = btn.getAttribute('data-pnr');
        const b = this.store.bookings.find(x => x.pnr === pnr);
        if (b) {
          downloadTicketAsFile(b);
        }
      });
    });

    // View Ticket from History
    document.querySelectorAll('.view-ticket-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pnr = btn.getAttribute('data-pnr');
        const b = this.store.bookings.find(x => x.pnr === pnr);
        if (b) {
          this.confirmedBooking = b;
          this.navigate('confirmation', { booking: b });
        }
      });
    });

    // Open Cancellation Dialog
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id') || '0', 10);
        const pnr = btn.getAttribute('data-pnr') || '';
        const amount = parseFloat(btn.getAttribute('data-amount') || '0');
        this.activeCancelBookingId = id;
        this.activeCancelPnr = pnr;
        this.activeCancelAmount = amount;
        this.render();
      });
    });

    // Close Cancellation Dialog
    document.getElementById('close-cancel-modal-btn')?.addEventListener('click', () => {
      this.activeCancelBookingId = null;
      this.render();
    });

    document.getElementById('cancel-abort-btn')?.addEventListener('click', () => {
      this.activeCancelBookingId = null;
      this.render();
    });

    // Confirm Cancellation Submission
    document.getElementById('confirm-cancel-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.activeCancelBookingId) return;

      const reason = (document.getElementById('cancel-reason') as HTMLSelectElement)?.value || 'Change of travel plans';
      const booking = this.store.bookings.find(b => b.id === this.activeCancelBookingId);
      if (booking) {
        booking.bookingStatus = 'CANCELLED';
        const refundAmt = Math.max(0, booking.totalAmount - 500);

        this.store.refunds.unshift({
          id: this.store.refunds.length + 1,
          bookingId: booking.id,
          pnr: booking.pnr,
          userEmail: booking.contactEmail,
          userName: booking.passengers[0]?.firstName + ' ' + (booking.passengers[0]?.lastName || ''),
          refundAmount: refundAmt,
          refundReference: 'REF_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          refundStatus: 'PROCESSING',
          cancellationReason: reason,
          requestDate: new Date().toISOString()
        });

        this.store.persistState();

        this.store.addNotification({
          title: `Booking Cancelled: PNR ${booking.pnr}`,
          message: `Your trip has been cancelled. Eligible refund of ₹${refundAmt.toLocaleString()} has been queued for bank settlement.`,
          notificationType: 'REFUND',
          pnr: booking.pnr,
          flightNumber: booking.flight.flightNumber,
          priority: 'HIGH'
        });
        this.showToast('Booking Cancelled', `Refund request of ₹${refundAmt.toLocaleString()} for PNR ${booking.pnr} initiated.`, 'warning');
      }

      this.activeCancelBookingId = null;
      this.historyTab = 'CANCELLED';
      this.render();
    });

    // Admin Refund Approval Action
    document.querySelectorAll('.approve-refund-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id') || '0', 10);
        const r = this.store.refunds.find(x => x.id === id);
        if (r) {
          r.refundStatus = 'COMPLETED';
          r.processedAt = new Date().toISOString();
          r.adminNotes = 'Settled via automated RTGS batch';

          this.store.addNotification({
            title: `Refund Processed: PNR ${r.pnr}`,
            message: `Bank settlement of ₹${r.refundAmount.toLocaleString()} has been completed for PNR ${r.pnr}.`,
            notificationType: 'REFUND',
            pnr: r.pnr,
            priority: 'NORMAL'
          });
          this.showToast('Refund Approved', `₹${r.refundAmount.toLocaleString()} for PNR ${r.pnr} settled via RTGS.`, 'success');

          this.store.persistState();
          this.render();
        }
      });
    });

    // AI Assistant Widget Trigger
    document.getElementById('ai-floating-trigger-btn')?.addEventListener('click', () => {
      this.isAiDrawerOpen = true;
      this.render();
    });

    document.getElementById('nav-ai-btn')?.addEventListener('click', () => {
      this.isAiDrawerOpen = true;
      this.render();
    });

    document.getElementById('close-ai-drawer-btn')?.addEventListener('click', () => {
      this.isAiDrawerOpen = false;
      this.render();
    });

    // AI Assistant Chat Submit
    document.getElementById('ai-chat-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('ai-chat-input') as HTMLInputElement;
      if (!input || !input.value.trim()) return;

      const userText = input.value.trim();
      this.aiMessages.push({
        sender: 'user',
        content: userText,
        time: new Date().toLocaleTimeString()
      });

      input.value = '';
      this.render();

      setTimeout(() => {
        const lower = userText.toLowerCase();
        let reply = '';
        let tools: string[] = [];
        let suggestions: any[] = [];

        if (lower.includes('roundtrip') || lower.includes('round trip') || lower.includes('return')) {
          tools.push('searchRoundTripFlights(origin="BLR", destination="DEL")');
          reply = "✈️ I found special roundtrip airfare deals from Bengaluru (BLR) to New Delhi (DEL)! Roundtrip combo tickets save you up to 15% on base airfare.";
          suggestions = [
            { flightNumber: '6E-1234 / 6E-5678', airline: 'IndiGo', route: 'BLR ⇄ DEL (Roundtrip)', price: '₹12,499', time: 'Direct Daily', duration: '2h 50m' }
          ];
        } else if (lower.includes('multi') || lower.includes('city') || lower.includes('multicity')) {
          tools.push('planMultiCityRoute()');
          reply = "🗺️ Multi-city route planner is active! You can chain up to 6 flight segments (e.g. BLR → DEL → BOM → BLR) with synchronized seat selection and a single combined PNR.";
        } else if (lower.includes('flight') || lower.includes('bengaluru') || lower.includes('delhi') || lower.includes('mumbai')) {
          tools.push('searchFlights(origin="BLR", destination="DEL")');
          reply = "✈️ Here are verified direct flights departing from Bengaluru (BLR) with available seats in live inventory:";
          suggestions = [
            { flightNumber: '6E-1234', airline: 'IndiGo', route: 'BLR → DEL', price: '₹6,499', time: '06:30 - 09:20', duration: '2h 50m' },
            { flightNumber: 'AI-505', airline: 'Air India', route: 'BLR → DEL', price: '₹7,150', time: '08:00 - 10:45', duration: '2h 45m' }
          ];
        } else if (lower.includes('baggage') || lower.includes('luggage')) {
          tools.push('getBaggageAllowancePolicy()');
          reply = "🧳 **Standard Baggage Allowance Guidelines:**\n• Cabin Baggage: 1 Piece up to 7 kg free.\n• Check-in Luggage: 15 kg included on IndiGo/Akasa Air (25 kg on Air India).\n• Extra luggage can be pre-purchased at discounted rates during checkout.";
        } else if (lower.includes('cancel') || lower.includes('refund')) {
          tools.push('getCancellationPolicy()');
          reply = "📋 **SkyRoute Cancellation & Refund Rules:**\n• Flat cancellation fee: **₹500** per passenger.\n• Cancellations permitted up to 2 hours before scheduled departure.\n• Automated refund settlement directly to source bank within 3-5 business days.";
        } else {
          reply = "I am your SkyRoute AI Travel Copilot. Ask me about Roundtrip discounts, Multi-City itineraries, baggage allowances, cancellation refunds, or flight schedules!";
        }

        this.aiMessages.push({
          sender: 'assistant',
          content: reply,
          time: new Date().toLocaleTimeString(),
          toolCalls: tools,
          suggestedFlights: suggestions
        });

        this.render();
      }, 500);
    });

    // AI Quick Chips
    document.querySelectorAll('.ai-quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent?.trim() || '';
        const input = document.getElementById('ai-chat-input') as HTMLInputElement;
        if (input) {
          input.value = text;
          document.getElementById('ai-chat-form')?.dispatchEvent(new Event('submit'));
        }
      });
    });

    // Auth Modal Actions
    document.getElementById('close-auth-modal-btn')?.addEventListener('click', () => {
      this.isAuthModalOpen = false;
      this.render();
    });

    document.getElementById('toggle-auth-mode-btn')?.addEventListener('click', () => {
      this.authModalMode = this.authModalMode === 'login' ? 'register' : 'login';
      this.render();
    });

    document.getElementById('quick-fill-user-btn')?.addEventListener('click', () => {
      const nameEl = document.getElementById('auth-fullname') as HTMLInputElement;
      const emailEl = document.getElementById('auth-email') as HTMLInputElement;
      const passEl = document.getElementById('auth-password') as HTMLInputElement;
      if (nameEl) nameEl.value = 'Johnathan Doe';
      if (emailEl) emailEl.value = 'john.doe@example.com';
      if (passEl) passEl.value = 'User@12345';
    });

    document.getElementById('quick-fill-admin-btn')?.addEventListener('click', () => {
      const nameEl = document.getElementById('auth-fullname') as HTMLInputElement;
      const emailEl = document.getElementById('auth-email') as HTMLInputElement;
      const passEl = document.getElementById('auth-password') as HTMLInputElement;
      if (nameEl) nameEl.value = 'SkyRoute Operations Admin';
      if (emailEl) emailEl.value = 'admin@skyroute.com';
      if (passEl) passEl.value = 'Admin@12345';
    });

    document.getElementById('auth-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = (document.getElementById('auth-fullname') as HTMLInputElement)?.value || '';
      const email = (document.getElementById('auth-email') as HTMLInputElement)?.value || 'john.doe@example.com';

      this.store.registerOrLogin(nameInput, email);

      this.isAuthModalOpen = false;
      this.render();
    });
  }
}

// Bootstrap SkyRoute Application
new SkyRouteApp();
