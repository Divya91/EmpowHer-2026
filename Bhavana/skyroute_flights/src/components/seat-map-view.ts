import { FlightResponseDto, SeatDto, TripType } from '../types';

export function renderSeatMapView(
  flight: FlightResponseDto,
  seats: SeatDto[],
  selectedSeats: string[] = [],
  tripType: TripType = 'ONE_WAY',
  outboundFlight: FlightResponseDto | null = null,
  returnFlight: FlightResponseDto | null = null,
  multiCityFlights: FlightResponseDto[] = [],
  selectedOutboundSeats: string[] = ['14A'],
  selectedReturnSeats: string[] = ['16F'],
  selectedMultiCitySeats: { [legIndex: number]: string[] } = {},
  activeSeatLeg: string = 'outbound'
): string {
  const selectedSeatObjs = seats.filter(s => selectedSeats.includes(s.seatNumber));
  const totalSeatSurcharge = selectedSeatObjs.reduce((acc, s) => acc + (s.priceSurcharge || 0), 0);

  // Group seats by row
  const rowsMap = new Map<number, SeatDto[]>();
  seats.forEach(s => {
    const rowNum = parseInt(s.seatNumber.replace(/[A-F]/g, ''), 10);
    if (!rowsMap.has(rowNum)) {
      rowsMap.set(rowNum, []);
    }
    rowsMap.get(rowNum)!.push(s);
  });

  const rowNumbers = Array.from(rowsMap.keys()).sort((a, b) => a - b);

  // Total flights price calculation
  let combinedBaseFare = flight.totalPrice;
  if (tripType === 'ROUND_TRIP' && outboundFlight && returnFlight) {
    combinedBaseFare = outboundFlight.totalPrice + returnFlight.totalPrice;
  } else if (tripType === 'MULTI_CITY' && multiCityFlights.length > 0) {
    combinedBaseFare = multiCityFlights.reduce((acc, f) => acc + f.totalPrice, 0);
  }

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Top Trip Segment Tabs for Roundtrip or Multi-city -->
      ${tripType === 'ROUND_TRIP' && outboundFlight && returnFlight ? `
        <div class="bg-white rounded-xl p-3 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">Select Seats for:</span>
          
          <button type="button" class="seatmap-leg-tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${activeSeatLeg === 'outbound' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-leg="outbound">
            <span>✈️ Flight 1 (Outbound): ${outboundFlight.originIata} → ${outboundFlight.destinationIata}</span>
            <span class="px-1.5 py-0.5 rounded bg-black/20 text-[10px]">${selectedOutboundSeats.join(', ') || 'No Seat'}</span>
          </button>

          <button type="button" class="seatmap-leg-tab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${activeSeatLeg === 'return' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-leg="return">
            <span>✈️ Flight 2 (Return): ${returnFlight.originIata} → ${returnFlight.destinationIata}</span>
            <span class="px-1.5 py-0.5 rounded bg-black/20 text-[10px]">${selectedReturnSeats.join(', ') || 'No Seat'}</span>
          </button>
        </div>
      ` : tripType === 'MULTI_CITY' && multiCityFlights.length > 0 ? `
        <div class="bg-white rounded-xl p-3 shadow-sm border border-slate-200 mb-6 flex items-center gap-2 overflow-x-auto">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2 flex-shrink-0">Flight Legs:</span>
          ${multiCityFlights.map((f, i) => `
            <button type="button" class="seatmap-leg-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 ${activeSeatLeg === String(i) ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-leg="${i}">
              <span>${i + 1}. ${f.originIata} → ${f.destinationIata}</span>
              <span class="px-1.5 py-0.5 rounded bg-black/20 text-[10px]">${(selectedMultiCitySeats[i] || ['14A']).join(', ')}</span>
            </button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Top Flight Reference Banner -->
      <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <img src="${flight.airlineLogo}" alt="${flight.airlineName}" class="w-10 h-10 rounded-lg object-cover border border-slate-100" />
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-base font-bold text-slate-900">${flight.originCity} (${flight.originIata})</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              <span class="text-base font-bold text-slate-900">${flight.destinationCity} (${flight.destinationIata})</span>
              ${tripType === 'ROUND_TRIP' ? `
                <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">${activeSeatLeg === 'outbound' ? 'Outbound Leg' : 'Return Leg'}</span>
              ` : ''}
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${flight.airlineName} ${flight.flightNumber} • ${flight.travelDate} • ${flight.departureTime} - ${flight.arrivalTime} (${flight.aircraftModel})</p>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs text-slate-400 font-medium">Selected Seat:</span>
          <p class="text-base font-mono font-bold text-blue-600">${selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Aircraft Fuselage Representation -->
        <div class="lg:col-span-8 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
          
          <!-- Cockpit Nose Cone -->
          <div class="w-32 h-14 mx-auto bg-slate-800 rounded-t-full border-t-2 border-blue-500/50 flex items-center justify-center mb-6 relative">
            <span class="text-[10px] font-mono tracking-widest text-slate-400 uppercase">COCKPIT</span>
            <div class="w-10 h-2 bg-blue-500/20 rounded-full absolute bottom-2"></div>
          </div>

          <!-- Seat Legend -->
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-slate-800/80 p-3 rounded-xl mb-6 text-[11px] text-slate-300 border border-slate-700">
            <div class="flex items-center space-x-1.5">
              <div class="w-4 h-4 rounded bg-slate-700 border border-slate-600"></div>
              <span>Free Seat</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <div class="w-4 h-4 rounded bg-cyan-900/40 border border-cyan-500"></div>
              <span>Extra Legroom (+₹600)</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <div class="w-4 h-4 rounded bg-blue-600 shadow-sm shadow-blue-400/50"></div>
              <span class="font-bold text-white">Your Selection</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <div class="w-4 h-4 rounded bg-slate-800 border border-slate-700 opacity-40"></div>
              <span class="text-slate-500">Occupied</span>
            </div>
          </div>

          <!-- Column Header Indicators (A B C | D E F) -->
          <div class="flex items-center justify-between max-w-sm mx-auto mb-3 px-2 text-xs font-mono font-bold text-slate-400">
            <div class="flex space-x-2">
              <span class="w-8 text-center">A</span>
              <span class="w-8 text-center">B</span>
              <span class="w-8 text-center">C</span>
            </div>
            <span class="w-8 text-center text-slate-600 text-[10px]">AISLE</span>
            <div class="flex space-x-2">
              <span class="w-8 text-center">D</span>
              <span class="w-8 text-center">E</span>
              <span class="w-8 text-center">F</span>
            </div>
          </div>

          <!-- Rows of Seats -->
          <div class="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            ${rowNumbers.map(rNum => {
              const rowSeats = rowsMap.get(rNum) || [];
              const leftSeats = rowSeats.filter(s => ['A', 'B', 'C'].includes(s.seatNumber.slice(-1)));
              const rightSeats = rowSeats.filter(s => ['D', 'E', 'F'].includes(s.seatNumber.slice(-1)));
              const isExitRow = rNum === 12 || rNum === 13;

              return `
                <div class="flex items-center justify-between max-w-sm mx-auto p-1 rounded-lg ${isExitRow ? 'bg-amber-950/30 border border-amber-500/30' : ''}">
                  
                  <!-- Left Side Seats (A, B, C) -->
                  <div class="flex space-x-2">
                    ${leftSeats.map(s => renderSeatButton(s, selectedSeats.includes(s.seatNumber))).join('')}
                  </div>

                  <!-- Row Number in Center Aisle -->
                  <div class="w-8 text-center font-mono text-xs font-bold ${isExitRow ? 'text-amber-400' : 'text-slate-500'}">
                    ${rNum}
                  </div>

                  <!-- Right Side Seats (D, E, F) -->
                  <div class="flex space-x-2">
                    ${rightSeats.map(s => renderSeatButton(s, selectedSeats.includes(s.seatNumber))).join('')}
                  </div>

                </div>
              `;
            }).join('')}
          </div>

        </div>

        <!-- Right Side Seat Summary & Pricing Card -->
        <div class="lg:col-span-4 space-y-5">
          
          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 class="text-sm font-bold text-slate-900">Seat Summary</h3>
            
            <div class="space-y-2 text-xs text-slate-600">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span>Selected Seats (${flight.originIata} → ${flight.destinationIata})</span>
                <span class="font-bold text-slate-900">${selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Auto-Assign'}</span>
              </div>
              ${tripType === 'ROUND_TRIP' && returnFlight ? `
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span>Outbound Seat:</span>
                  <span class="font-bold text-blue-600">${selectedOutboundSeats.join(', ') || '14A'}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span>Return Seat:</span>
                  <span class="font-bold text-blue-600">${selectedReturnSeats.join(', ') || '16F'}</span>
                </div>
              ` : ''}
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span>Seat Surcharge</span>
                <span class="font-bold text-blue-600">+₹${totalSeatSurcharge.toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-1 font-bold text-sm text-slate-900">
                <span>${tripType === 'ROUND_TRIP' ? 'Combined Roundtrip Airfare' : tripType === 'MULTI_CITY' ? 'Total Flights Airfare' : 'Flight Base Fare'}</span>
                <span>₹${combinedBaseFare.toLocaleString()}</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span class="text-xs text-slate-400">Total Estimated</span>
                <p class="text-xl font-bold text-slate-900">₹${(combinedBaseFare + totalSeatSurcharge).toLocaleString()}</p>
              </div>
            </div>

            <button id="confirm-seat-btn" class="w-full py-3 px-4 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all flex items-center justify-center space-x-2">
              <span>Continue to Passenger Details</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>

            <button id="skip-seat-btn" class="w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-700">
              Skip seat selection (Free Auto-Assign)
            </button>

          </div>

          <!-- Price Guarantee banner -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <p class="font-bold flex items-center space-x-1.5 text-slate-900">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span>SkyRoute Inventory Guarantee</span>
            </p>
            <p class="text-[11px] text-slate-500">Selected seats are held exclusively in real-time inventory during booking checkout.</p>
          </div>

        </div>

      </div>
    </div>
  `;
}

function renderSeatButton(s: SeatDto, isSelected: boolean): string {
  if (s.isBooked) {
    return `<div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[10px] text-slate-600 font-mono cursor-not-allowed opacity-50 select-none">${s.seatNumber.slice(-1)}</div>`;
  }

  if (isSelected) {
    return `<button type="button" class="seat-btn w-8 h-8 rounded-lg bg-blue-600 text-white font-bold font-mono text-[10px] shadow-md shadow-blue-500/50 flex items-center justify-center transform scale-105 border border-white/50" data-seat="${s.seatNumber}">${s.seatNumber.slice(-1)}</button>`;
  }

  const isExtraLegroom = s.seatType === 'EMERGENCY_EXIT' || s.seatType === 'EXTRA_LEGROOM';
  const isBusiness = s.cabinClass === 'BUSINESS';

  let bgClass = 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600';
  if (isBusiness) bgClass = 'bg-amber-900/40 text-amber-300 border-amber-600/40 hover:bg-amber-800/60';
  else if (isExtraLegroom) bgClass = 'bg-cyan-900/40 text-cyan-300 border-cyan-600/40 hover:bg-cyan-800/60';

  return `<button type="button" class="seat-btn w-8 h-8 rounded-lg border font-mono text-[10px] font-semibold transition-all ${bgClass} seat-available" data-seat="${s.seatNumber}" title="${s.seatNumber} (${s.seatType} - +₹${s.priceSurcharge})">${s.seatNumber.slice(-1)}</button>`;
}
