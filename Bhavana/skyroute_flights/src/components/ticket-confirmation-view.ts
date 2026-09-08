import { BookingResponseDto, FlightResponseDto } from '../types';

export function renderTicketConfirmationView(booking: BookingResponseDto): string {
  const flight = booking.flight;
  const passenger = booking.passengers[0] || { firstName: 'Passenger', lastName: '', seatNumber: '14A' };

  // Prepare list of legs to display
  const legs: { flight: FlightResponseDto; seatNumber: string; legLabel: string }[] = [];

  if (booking.tripType === 'ROUND_TRIP' && booking.returnFlight) {
    legs.push({
      flight: booking.flight,
      seatNumber: passenger.seatNumber || '14A',
      legLabel: 'Flight 1 • Outbound'
    });
    legs.push({
      flight: booking.returnFlight,
      seatNumber: (booking.returnSeats && booking.returnSeats[0]) || '16F',
      legLabel: 'Flight 2 • Return'
    });
  } else if (booking.tripType === 'MULTI_CITY' && booking.multiCityFlights && booking.multiCityFlights.length > 0) {
    booking.multiCityFlights.forEach((f, i) => {
      legs.push({
        flight: f,
        seatNumber: (booking.multiCitySeats && booking.multiCitySeats[i] && booking.multiCitySeats[i][0]) || `1${4 + i}A`,
        legLabel: `Flight ${i + 1} • Leg Segment`
      });
    });
  } else {
    legs.push({
      flight: booking.flight,
      seatNumber: passenger.seatNumber || '14A',
      legLabel: 'Flight Itinerary'
    });
  }

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Top Success Status Banner -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-200">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-900">
          ${booking.tripType === 'ROUND_TRIP' ? 'Roundtrip Booking Confirmed' : booking.tripType === 'MULTI_CITY' ? 'Multi-City Booking Confirmed' : 'Flight Booking Confirmed'}
        </h2>
        <p class="text-xs text-slate-500 mt-1">Your official e-Ticket receipt and digital boarding passes have been confirmed and sent to <span class="font-semibold text-slate-700">${booking.contactEmail}</span>.</p>
      </div>

      <!-- Printable Ticket Container -->
      <div id="e-ticket-card" class="ticket-printable-container space-y-6 mb-6">
        
        ${legs.map((legItem, index) => {
          const legFlight = legItem.flight;
          return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
              
              <!-- Ticket Header Band -->
              <div class="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                <div class="flex items-center space-x-3">
                  <img src="${legFlight.airlineLogo}" alt="${legFlight.airlineName}" class="w-10 h-10 rounded-lg object-cover border border-white/20" />
                  <div>
                    <div class="flex items-center space-x-2">
                      <h3 class="text-base font-bold text-white">${legFlight.airlineName}</h3>
                      <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">${legItem.legLabel}</span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium">${legFlight.flightNumber} • ${legFlight.aircraftModel}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-6">
                  <div class="text-right">
                    <span class="text-[10px] text-slate-400 font-mono uppercase tracking-widest block">BOOKING REFERENCE (PNR)</span>
                    <span class="text-xl font-mono font-bold text-blue-400 tracking-wider">${booking.pnr}</span>
                  </div>
                </div>
              </div>

              <!-- Ticket Body Content -->
              <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <!-- Left Route & Timings (8 Cols) -->
                <div class="md:col-span-8 space-y-6">
                  
                  <!-- Route Banner -->
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-[11px] font-bold text-slate-400 uppercase">From</span>
                      <h4 class="text-2xl font-bold text-slate-900">${legFlight.originIata}</h4>
                      <p class="text-xs font-semibold text-slate-600">${legFlight.originCity}</p>
                      <p class="text-[11px] text-slate-400">${legFlight.departureTime}</p>
                    </div>

                    <!-- Graphic line -->
                    <div class="flex flex-col items-center px-4">
                      <span class="text-[11px] font-medium text-slate-500">${Math.floor(legFlight.durationMinutes / 60)}h ${legFlight.durationMinutes % 60}m</span>
                      <div class="w-24 sm:w-36 flex items-center my-1">
                        <div class="h-0.5 w-full bg-slate-200 relative">
                          <div class="w-2 h-2 rounded-full bg-blue-600 absolute -top-[3px] left-0"></div>
                          <div class="w-2 h-2 rounded-full bg-blue-600 absolute -top-[3px] right-0"></div>
                        </div>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">${legFlight.stops === 0 ? 'Non-Stop' : `${legFlight.stops} Stop`}</span>
                    </div>

                    <div class="text-right">
                      <span class="text-[11px] font-bold text-slate-400 uppercase">To</span>
                      <h4 class="text-2xl font-bold text-slate-900">${legFlight.destinationIata}</h4>
                      <p class="text-xs font-semibold text-slate-600">${legFlight.destinationCity}</p>
                      <p class="text-[11px] text-slate-400">${legFlight.arrivalTime}</p>
                    </div>
                  </div>

                  <!-- Passenger Details Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Passenger</span>
                      <span class="font-bold text-slate-900 text-xs truncate block">${passenger.firstName} ${passenger.lastName}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Assigned Seat</span>
                      <span class="font-bold text-blue-600 text-xs">${legItem.seatNumber}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Cabin Class</span>
                      <span class="font-bold text-slate-900 text-xs">${booking.cabinClass}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Travel Date</span>
                      <span class="font-bold text-slate-900 text-xs">${legFlight.travelDate}</span>
                    </div>
                  </div>

                </div>

                <!-- Right QR Code & Boarding Tear-off (4 Cols) -->
                <div class="md:col-span-4 border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-6 md:pt-0 md:pl-8 flex flex-col items-center text-center">
                  
                  <!-- Simulated High-Res QR Code -->
                  <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-sm mb-3">
                    <svg class="w-28 h-28 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-6-8h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm8-2h2v2h-2v-2zm-4-4h2v2h-2V6zm4 0h2v2h-2V6z"/>
                    </svg>
                  </div>
                  
                  <p class="text-[10px] font-mono text-slate-400 tracking-wider">SCAN AT SECURITY GATE</p>
                  <p class="text-xs font-semibold text-slate-700 mt-1">Terminal Gate closes 25 min prior</p>
                </div>

              </div>

              <!-- Ticket Footer Bar -->
              <div class="bg-slate-50 px-6 sm:px-8 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="font-semibold text-slate-700">Status: Confirmed & Ticketed</span>
                </div>
                <div class="font-medium text-slate-600">
                  Fare: <span class="font-bold text-slate-900">₹${legFlight.totalPrice.toLocaleString()}</span>
                </div>
              </div>

            </div>
          `;
        }).join('')}

      </div>

      <!-- Total Combined Summary & Actions -->
      <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs text-slate-400 uppercase font-bold">Total Itinerary Price Paid</span>
          <p class="text-2xl font-black text-slate-900">₹${booking.totalAmount.toLocaleString()}</p>
        </div>

        <!-- Action Buttons (Download, Print, Bookings) -->
        <div class="flex flex-wrap items-center gap-3">
          <button id="download-ticket-btn" class="px-5 py-2.5 rounded-lg font-semibold text-xs text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 shadow-sm transition-all flex items-center space-x-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Download e-Ticket (HTML)</span>
          </button>

          <button id="print-ticket-btn" class="px-5 py-2.5 rounded-lg font-semibold text-xs text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 active:scale-95 shadow-sm transition-all flex items-center space-x-2">
            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            <span>Print Boarding Pass</span>
          </button>

          <button id="view-history-btn" class="px-5 py-2.5 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-sm transition-all flex items-center space-x-1.5">
            <span>Go to My Bookings</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>

    </div>
  `;
}
