import { BookingResponseDto } from '../types';

export function renderBookingHistoryView(
  bookings: BookingResponseDto[],
  activeTab: 'UPCOMING' | 'COMPLETED' | 'CANCELLED' = 'UPCOMING'
): string {
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'CANCELLED') return b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REFUNDED';
    if (activeTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING';
  });

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- History Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900">My Flight Bookings</h2>
          <p class="text-xs text-slate-500 mt-1">Manage your e-tickets, view flight statuses, or process cancellations & refunds.</p>
        </div>

        <!-- Filter Status Tabs -->
        <div class="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button class="history-tab-btn px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'UPCOMING' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="UPCOMING">
            Upcoming
          </button>
          <button class="history-tab-btn px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'COMPLETED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="COMPLETED">
            Completed
          </button>
          <button class="history-tab-btn px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'CANCELLED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-tab="CANCELLED">
            Cancelled & Refunds
          </button>
        </div>
      </div>

      <!-- Bookings List -->
      ${filteredBookings.length === 0 ? `
        <div class="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div class="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-900 mb-1">No ${activeTab.toLowerCase()} bookings found</h3>
          <p class="text-xs text-slate-500 mb-6">You don't have any flights currently filed under this category.</p>
          <button id="history-search-flight-btn" class="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow-sm transition-all">
            Search Flights Now
          </button>
        </div>
      ` : `
        <div class="space-y-4">
          ${filteredBookings.map(b => renderBookingItem(b)).join('')}
        </div>
      `}

    </div>
  `;
}

function renderBookingItem(b: BookingResponseDto): string {
  const flight = b.flight;
  const isCancelled = b.bookingStatus === 'CANCELLED';
  const isRoundTrip = b.tripType === 'ROUND_TRIP' && b.returnFlight;
  const isMultiCity = b.tripType === 'MULTI_CITY' && b.multiCityFlights && b.multiCityFlights.length > 0;

  return `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-slate-300 transition-all">
      
      <!-- Top Band -->
      <div class="bg-slate-50 px-5 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div class="flex items-center space-x-4">
          <div>
            <span class="text-slate-400 font-medium block text-[10px] uppercase">PNR</span>
            <span class="font-mono font-bold text-slate-900 text-sm">${b.pnr}</span>
          </div>
          <div class="hidden sm:block">
            <span class="text-slate-400 font-medium block text-[10px] uppercase">Booked On</span>
            <span class="font-semibold text-slate-700">${new Date(b.createdAt).toLocaleDateString()}</span>
          </div>
          ${isRoundTrip ? `
            <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Round Trip</span>
          ` : isMultiCity ? `
            <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">Multi-City (${b.multiCityFlights?.length} Legs)</span>
          ` : `
            <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">One Way</span>
          `}
        </div>

        <div class="flex items-center space-x-3">
          <span class="px-2.5 py-0.5 rounded text-[11px] font-bold ${
            isCancelled ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }">
            ${isCancelled ? 'Cancelled' : 'Confirmed'}
          </span>
          <span class="font-bold text-slate-900 text-sm">₹${b.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <!-- Card Main Body -->
      <div class="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        <!-- Flight Info -->
        <div class="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div class="flex items-center space-x-3 min-w-[140px]">
            <img src="${flight.airlineLogo}" alt="${flight.airlineName}" class="w-10 h-10 rounded-lg object-cover border border-slate-100" />
            <div>
              <h4 class="text-xs font-bold text-slate-900">${flight.airlineName}</h4>
              <p class="text-[11px] font-medium text-slate-500">${flight.flightNumber}</p>
            </div>
          </div>

          <!-- Route & Timings -->
          <div class="flex items-center space-x-6">
            <div>
              <span class="text-lg font-bold text-slate-900">${flight.departureTime}</span>
              <p class="text-xs font-bold text-slate-700">${flight.originIata}</p>
              <p class="text-[10px] text-slate-400">${flight.originCity}</p>
            </div>

            <div class="flex flex-col items-center">
              <span class="text-[10px] font-medium text-slate-500">${flight.travelDate}</span>
              <div class="w-16 h-0.5 bg-slate-200 my-1 relative">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-[2px] left-0"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-[2px] right-0"></div>
              </div>
              <span class="text-[9px] font-semibold text-emerald-600 uppercase">
                ${isRoundTrip ? 'Roundtrip' : isMultiCity ? 'Multi-Segment' : 'Non-stop'}
              </span>
            </div>

            <div>
              <span class="text-lg font-bold text-slate-900">${flight.arrivalTime}</span>
              <p class="text-xs font-bold text-slate-700">${flight.destinationIata}</p>
              <p class="text-[10px] text-slate-400">${flight.destinationCity}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="md:col-span-4 flex flex-wrap md:flex-col items-end justify-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div class="flex items-center space-x-1.5">
            <button class="download-history-ticket-btn p-1.5 rounded-lg text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors" title="Download e-Ticket" data-pnr="${b.pnr}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
            <button class="view-ticket-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors" data-pnr="${b.pnr}">
              View e-Ticket
            </button>
          </div>
          
          ${!isCancelled ? `
            <button class="cancel-booking-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors" data-id="${b.id}" data-pnr="${b.pnr}" data-amount="${b.totalAmount}">
              Cancel Ticket & Refund
            </button>
          ` : `
            <span class="text-[11px] text-slate-400 font-medium">Refund processed</span>
          `}
        </div>

      </div>

    </div>
  `;
}
