import { SkyRouteStore } from '../services/store.service';
import { FlightResponseDto, TripType, MultiCityLeg } from '../types';

export function renderFlightSearchView(
  flights: FlightResponseDto[],
  origin: string,
  destination: string,
  travelDate: string,
  selectedSort: string = 'cheapest',
  filterState: { maxPrice: number; airline: string; nonStopOnly: boolean } = { maxPrice: 30000, airline: 'ALL', nonStopOnly: false },
  tripType: TripType = 'ONE_WAY',
  returnDate: string = '',
  multiCityLegs: MultiCityLeg[] = [],
  selectedOutboundFlight: FlightResponseDto | null = null,
  selectedReturnFlight: FlightResponseDto | null = null,
  selectedMultiCityFlights: { [legIndex: number]: FlightResponseDto | null } = {},
  activeRoundTripTab: 'outbound' | 'return' = 'outbound',
  activeMultiCityLegIndex: number = 0
): string {
  const store = SkyRouteStore.getInstance();
  const originAirport = store.airports.find(a => a.iataCode === origin) || { city: origin, name: 'Airport', iataCode: origin };
  const destAirport = store.airports.find(a => a.iataCode === destination) || { city: destination, name: 'Airport', iataCode: destination };

  // Current active leg context for multi-city
  const currentMultiLeg = multiCityLegs[activeMultiCityLegIndex] || {
    id: `leg-${activeMultiCityLegIndex + 1}`,
    origin,
    destination,
    date: travelDate
  };

  const currentLegOriginAirport = store.airports.find(a => a.iataCode === currentMultiLeg.origin) || { city: currentMultiLeg.origin, name: 'Airport', iataCode: currentMultiLeg.origin };
  const currentLegDestAirport = store.airports.find(a => a.iataCode === currentMultiLeg.destination) || { city: currentMultiLeg.destination, name: 'Airport', iataCode: currentMultiLeg.destination };

  // Calculate totals for roundtrip and multi-city
  let roundTripTotal = (selectedOutboundFlight?.totalPrice || 0) + (selectedReturnFlight?.totalPrice || 0);
  let multiCityTotal = 0;
  let allMultiLegsSelected = multiCityLegs.length > 0;
  multiCityLegs.forEach((_, idx) => {
    if (selectedMultiCityFlights[idx]) {
      multiCityTotal += selectedMultiCityFlights[idx]!.totalPrice;
    } else {
      allMultiLegsSelected = false;
    }
  });

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      
      <!-- Top Search Summary Ribbon -->
      <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              ${tripType === 'ROUND_TRIP' ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              ` : tripType === 'MULTI_CITY' ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              ` : `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              `}
            </div>

            <div>
              ${tripType === 'ROUND_TRIP' ? `
                <div class="flex items-center space-x-2">
                  <span class="text-base font-bold text-slate-900">${originAirport.city} (${originAirport.iataCode})</span>
                  <span class="text-blue-600 font-bold">⇄</span>
                  <span class="text-base font-bold text-slate-900">${destAirport.city} (${destAirport.iataCode})</span>
                  <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">Round Trip</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  Depart: <span class="font-semibold text-slate-700">${travelDate}</span> • Return: <span class="font-semibold text-slate-700">${returnDate}</span> • Economy
                </p>
              ` : tripType === 'MULTI_CITY' ? `
                <div class="flex items-center space-x-2 flex-wrap">
                  <span class="text-base font-bold text-slate-900">Multi-City (${multiCityLegs.length} Flights)</span>
                  <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider">Multi-City Itinerary</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xl">
                  ${multiCityLegs.map((l, i) => `${l.origin} → ${l.destination} (${l.date})`).join(' • ')}
                </p>
              ` : `
                <div class="flex items-center space-x-2">
                  <span class="text-base font-bold text-slate-900">${originAirport.city} (${originAirport.iataCode})</span>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  <span class="text-base font-bold text-slate-900">${destAirport.city} (${destAirport.iataCode})</span>
                  <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">One Way</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">Date: <span class="font-semibold text-slate-700">${travelDate}</span> • 1 Passenger • Economy Class</p>
              `}
            </div>
          </div>

          <!-- Trip Switcher Tabs & Modify Search -->
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              <button type="button" class="search-triptype-toggle px-3 py-1 rounded text-xs font-semibold ${tripType === 'ONE_WAY' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}" data-triptype="ONE_WAY">
                One Way
              </button>
              <button type="button" class="search-triptype-toggle px-3 py-1 rounded text-xs font-semibold ${tripType === 'ROUND_TRIP' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}" data-triptype="ROUND_TRIP">
                Round Trip
              </button>
              <button type="button" class="search-triptype-toggle px-3 py-1 rounded text-xs font-semibold ${tripType === 'MULTI_CITY' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}" data-triptype="MULTI_CITY">
                Multi-City
              </button>
            </div>

            <button id="modify-search-home-btn" class="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all">
              Modify Search
            </button>
          </div>

        </div>

        <!-- ROUND TRIP STEP TABS (If Trip Type is Round Trip) -->
        ${tripType === 'ROUND_TRIP' ? `
          <div class="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <!-- Outbound Flight Tab Button -->
            <button type="button" class="roundtrip-tab-btn p-3 rounded-xl border text-left transition-all ${activeRoundTripTab === 'outbound' ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'}" data-tab="outbound">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider ${activeRoundTripTab === 'outbound' ? 'text-blue-600' : 'text-slate-500'}">
                  Step 1 • Outbound Flight
                </span>
                ${selectedOutboundFlight ? `
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span>Selected</span>
                  </span>
                ` : `
                  <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">In Progress</span>
                `}
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">${originAirport.city} (${originAirport.iataCode}) → ${destAirport.city} (${destAirport.iataCode})</h4>
                  <p class="text-xs text-slate-500">${travelDate}</p>
                </div>
                ${selectedOutboundFlight ? `
                  <div class="text-right">
                    <span class="text-xs font-bold text-slate-900">${selectedOutboundFlight.flightNumber}</span>
                    <p class="text-xs font-bold text-blue-600">₹${selectedOutboundFlight.totalPrice.toLocaleString()}</p>
                  </div>
                ` : `
                  <span class="text-xs text-blue-600 font-semibold underline">Choose Flight</span>
                `}
              </div>
            </button>

            <!-- Return Flight Tab Button -->
            <button type="button" class="roundtrip-tab-btn p-3 rounded-xl border text-left transition-all ${activeRoundTripTab === 'return' ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'}" data-tab="return">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider ${activeRoundTripTab === 'return' ? 'text-blue-600' : 'text-slate-500'}">
                  Step 2 • Return Flight
                </span>
                ${selectedReturnFlight ? `
                  <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span>Selected</span>
                  </span>
                ` : `
                  <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">Pending</span>
                `}
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">${destAirport.city} (${destAirport.iataCode}) → ${originAirport.city} (${originAirport.iataCode})</h4>
                  <p class="text-xs text-slate-500">${returnDate}</p>
                </div>
                ${selectedReturnFlight ? `
                  <div class="text-right">
                    <span class="text-xs font-bold text-slate-900">${selectedReturnFlight.flightNumber}</span>
                    <p class="text-xs font-bold text-blue-600">₹${selectedReturnFlight.totalPrice.toLocaleString()}</p>
                  </div>
                ` : `
                  <span class="text-xs text-blue-600 font-semibold underline">Choose Flight</span>
                `}
              </div>
            </button>

          </div>
        ` : ''}

        <!-- MULTI-CITY STEP TABS (If Trip Type is Multi-City) -->
        ${tripType === 'MULTI_CITY' ? `
          <div class="mt-4 pt-4 border-t border-slate-100">
            <div class="flex items-center space-x-2 overflow-x-auto pb-1">
              ${multiCityLegs.map((leg, idx) => {
                const legOrigin = store.airports.find(a => a.iataCode === leg.origin) || { city: leg.origin, iataCode: leg.origin };
                const legDest = store.airports.find(a => a.iataCode === leg.destination) || { city: leg.destination, iataCode: leg.destination };
                const isSelected = !!selectedMultiCityFlights[idx];
                const isActive = activeMultiCityLegIndex === idx;

                return `
                  <button type="button" class="multicity-tab-btn flex-shrink-0 p-3 rounded-xl border text-left transition-all min-w-[200px] ${isActive ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}" data-index="${idx}">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-500'}">
                        Flight ${idx + 1}
                      </span>
                      ${isSelected ? `
                        <span class="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <svg class="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                          <span>Selected</span>
                        </span>
                      ` : `
                        <span class="text-[10px] font-semibold text-slate-400">Select</span>
                      `}
                    </div>
                    <div class="font-bold text-xs text-slate-900">${legOrigin.iataCode} → ${legDest.iataCode}</div>
                    <div class="text-[11px] text-slate-500">${leg.date}</div>
                    ${isSelected ? `
                      <div class="text-[11px] font-bold text-blue-600 mt-1">${selectedMultiCityFlights[idx]!.flightNumber} • ₹${selectedMultiCityFlights[idx]!.totalPrice.toLocaleString()}</div>
                    ` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Filter Panel -->
        <div class="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">Filters</h3>
            <button id="reset-filters-btn" class="text-xs text-blue-600 hover:text-blue-700 font-semibold">Reset</button>
          </div>

          <!-- Stops Filter -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Stops</label>
            <div class="space-y-2">
              <label class="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input type="checkbox" id="filter-nonstop" ${filterState.nonStopOnly ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                <span>Non-stop only</span>
              </label>
            </div>
          </div>

          <!-- Price Range Slider -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Max Budget</label>
              <span id="price-val-label" class="text-xs font-bold text-blue-600">₹${filterState.maxPrice.toLocaleString()}</span>
            </div>
            <input type="range" id="filter-price-range" min="3000" max="35000" step="500" value="${filterState.maxPrice}" class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
            <div class="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹3,000</span>
              <span>₹35,000+</span>
            </div>
          </div>

          <!-- Airlines Filter -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Airlines</label>
            <select id="filter-airline-select" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="ALL">All Airlines</option>
              ${store.airlines.map(a => `<option value="${a.iataCode}" ${filterState.airline === a.iataCode ? 'selected' : ''}>${a.name} (${a.iataCode})</option>`).join('')}
            </select>
          </div>

          <!-- Cabin Baggage Highlights -->
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
            <p class="font-bold flex items-center space-x-1 text-slate-900">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Baggage Policy</span>
            </p>
            <p class="text-[11px] text-slate-500">Standard airfare includes 7kg cabin baggage & up to 15-30kg check-in luggage.</p>
          </div>

        </div>

        <!-- Right Flight Results List -->
        <div class="lg:col-span-9 space-y-4">
          
          <!-- Sorting Header -->
          <div class="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-medium text-slate-500"><strong class="text-slate-900 text-sm font-bold">${flights.length}</strong> Flights Available</span>
              ${tripType === 'ROUND_TRIP' ? `
                <span class="text-xs text-slate-400">• Showing ${activeRoundTripTab === 'outbound' ? 'Outbound' : 'Return'} Options</span>
              ` : tripType === 'MULTI_CITY' ? `
                <span class="text-xs text-slate-400">• Showing Flight ${activeMultiCityLegIndex + 1} (${currentLegOriginAirport.iataCode} → ${currentLegDestAirport.iataCode})</span>
              ` : ''}
            </div>
            
            <div class="flex items-center space-x-2 text-xs">
              <span class="text-slate-400 font-medium">Sort By:</span>
              <button class="sort-tab-btn px-3 py-1 rounded-md font-semibold transition-all ${selectedSort === 'cheapest' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-sort="cheapest">Cheapest</button>
              <button class="sort-tab-btn px-3 py-1 rounded-md font-semibold transition-all ${selectedSort === 'fastest' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-sort="fastest">Fastest</button>
              <button class="sort-tab-btn px-3 py-1 rounded-md font-semibold transition-all ${selectedSort === 'earliest' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-sort="earliest">Earliest</button>
            </div>
          </div>

          <!-- Empty State when no flights match -->
          ${flights.length === 0 ? `
            <div class="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
              <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-1">No flights found</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto mb-6">Try adjusting your budget filters or switching dates to find available airline routes.</p>
              <button id="empty-reset-btn" class="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow-sm transition-all">
                Reset Filters & Search
              </button>
            </div>
          ` : `
            <div class="space-y-3">
              ${flights.map(f => {
                const isSelected = (tripType === 'ROUND_TRIP' && activeRoundTripTab === 'outbound' && selectedOutboundFlight?.id === f.id) ||
                                   (tripType === 'ROUND_TRIP' && activeRoundTripTab === 'return' && selectedReturnFlight?.id === f.id) ||
                                   (tripType === 'MULTI_CITY' && selectedMultiCityFlights[activeMultiCityLegIndex]?.id === f.id);

                return `
                  <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:border-slate-300 transition-all border ${isSelected ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20' : 'border-slate-200'} flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 group">
                    
                    <!-- Airline & Flight Info -->
                    <div class="flex items-center space-x-3 min-w-0 md:w-48 lg:w-52 flex-shrink-0">
                      <img src="${f.airlineLogo}" alt="${f.airlineName}" class="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-sm flex-shrink-0" />
                      <div class="min-w-0">
                        <h4 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">${f.airlineName}</h4>
                        <p class="text-xs font-medium text-slate-500 truncate">${f.flightNumber} • ${f.aircraftModel}</p>
                        <div class="flex items-center space-x-1.5 mt-1">
                          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Refundable</span>
                          ${f.availableSeats < 60 ? `
                            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">${f.availableSeats} seats left</span>
                          ` : ''}
                        </div>
                      </div>
                    </div>

                    <!-- Flight Timings & Route -->
                    <div class="flex items-center justify-between sm:justify-center space-x-3 sm:space-x-6 flex-1 min-w-0">
                      
                      <!-- Departure -->
                      <div class="text-left sm:text-right min-w-[55px]">
                        <span class="text-lg sm:text-xl font-bold text-slate-900 block">${f.departureTime}</span>
                        <p class="text-xs font-bold text-slate-700">${f.originIata}</p>
                        <p class="text-[10px] text-slate-400 hidden sm:block truncate max-w-[85px]">${f.originCity}</p>
                      </div>

                      <!-- Flight Duration Graphic -->
                      <div class="flex flex-col items-center px-1 flex-shrink-0">
                        <span class="text-[11px] font-medium text-slate-500">${Math.floor(f.durationMinutes / 60)}h ${f.durationMinutes % 60}m</span>
                        <div class="w-16 sm:w-24 md:w-28 flex items-center my-1">
                          <div class="h-0.5 w-full bg-slate-200 relative">
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-[2px] left-0"></div>
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-[2px] right-0"></div>
                          </div>
                        </div>
                        <span class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">${f.stops === 0 ? 'Non-stop' : `${f.stops} Stop`}</span>
                      </div>

                      <!-- Arrival -->
                      <div class="text-right sm:text-left min-w-[55px]">
                        <span class="text-lg sm:text-xl font-bold text-slate-900 block">${f.arrivalTime}</span>
                        <p class="text-xs font-bold text-slate-700">${f.destinationIata}</p>
                        <p class="text-[10px] text-slate-400 hidden sm:block truncate max-w-[85px]">${f.destinationCity}</p>
                      </div>

                    </div>

                    <!-- Price & Booking Action -->
                    <div class="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex-shrink-0 min-w-0 md:min-w-[130px]">
                      <div class="text-left md:text-right">
                        <span class="text-lg sm:text-xl font-bold text-slate-900 block">₹${f.totalPrice.toLocaleString()}</span>
                        <p class="text-[10px] text-slate-400 whitespace-nowrap">Taxes & fees included</p>
                      </div>
                      
                      ${tripType === 'ROUND_TRIP' ? `
                        <button class="select-roundtrip-flight-btn px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 ${isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-95'}" data-flight-id="${f.id}" data-leg="${activeRoundTripTab}">
                          ${isSelected ? `
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            <span>Selected</span>
                          ` : `
                            <span>Select ${activeRoundTripTab === 'outbound' ? 'Outbound' : 'Return'}</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                          `}
                        </button>
                      ` : tripType === 'MULTI_CITY' ? `
                        <button class="select-multicity-flight-btn px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 ${isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-95'}" data-flight-id="${f.id}" data-index="${activeMultiCityLegIndex}">
                          ${isSelected ? `
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            <span>Selected</span>
                          ` : `
                            <span>Select Flight ${activeMultiCityLegIndex + 1}</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                          `}
                        </button>
                      ` : `
                        <button class="select-flight-btn px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-sm transition-all flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0" data-flight-id="${f.id}" data-schedule-id="${f.scheduleId}">
                          <span>Select Flight</span>
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      `}

                    </div>

                  </div>
                `;
              }).join('')}
            </div>
          `}

        </div>
      </div>

      <!-- STICKY BOTTOM SUMMARY BAR FOR ROUNDTRIP OR MULTI-CITY -->
      ${tripType === 'ROUND_TRIP' ? `
        <div class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-8">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div class="flex items-center space-x-4 sm:space-x-8 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Outbound Flight</span>
                <span class="font-bold text-white text-xs sm:text-sm">
                  ${selectedOutboundFlight ? `${selectedOutboundFlight.airlineName} (${selectedOutboundFlight.flightNumber}) • ₹${selectedOutboundFlight.totalPrice.toLocaleString()}` : `<span class="text-amber-400">Not selected yet</span>`}
                </span>
              </div>

              <div class="hidden sm:block text-slate-600 text-lg font-light">+</div>

              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Return Flight</span>
                <span class="font-bold text-white text-xs sm:text-sm">
                  ${selectedReturnFlight ? `${selectedReturnFlight.airlineName} (${selectedReturnFlight.flightNumber}) • ₹${selectedReturnFlight.totalPrice.toLocaleString()}` : `<span class="text-amber-400">Not selected yet</span>`}
                </span>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="text-right">
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Combined Roundtrip Fare</span>
                <span class="text-lg sm:text-xl font-bold text-blue-400">₹${roundTripTotal.toLocaleString()}</span>
              </div>

              <button id="proceed-roundtrip-btn" class="px-5 py-2.5 rounded-lg font-bold text-xs text-white transition-all flex items-center space-x-2 shadow-md ${selectedOutboundFlight && selectedReturnFlight ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 cursor-pointer' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80'}" ${selectedOutboundFlight && selectedReturnFlight ? '' : 'disabled'}>
                <span>${selectedOutboundFlight && selectedReturnFlight ? 'Continue to Seat Selection →' : 'Select Both Flights'}</span>
              </button>
            </div>

          </div>
        </div>
      ` : tripType === 'MULTI_CITY' ? `
        <div class="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-8">
          <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div class="flex items-center space-x-3 text-xs overflow-x-auto max-w-full">
              <span class="text-slate-400 font-bold uppercase text-[10px]">Selected:</span>
              ${multiCityLegs.map((l, i) => `
                <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs flex-shrink-0">
                  <span class="font-mono text-slate-400">${i + 1}.</span>
                  <span class="font-bold">${l.origin}→${l.destination}</span>
                  ${selectedMultiCityFlights[i] ? `
                    <span class="text-emerald-400 font-bold">₹${selectedMultiCityFlights[i]!.totalPrice.toLocaleString()}</span>
                  ` : `
                    <span class="text-amber-400 text-[10px]">Pending</span>
                  `}
                </div>
              `).join('')}
            </div>

            <div class="flex items-center space-x-4 flex-shrink-0">
              <div class="text-right">
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Total Itinerary Fare</span>
                <span class="text-lg sm:text-xl font-bold text-blue-400">₹${multiCityTotal.toLocaleString()}</span>
              </div>

              <button id="proceed-multicity-btn" class="px-5 py-2.5 rounded-lg font-bold text-xs text-white transition-all flex items-center space-x-2 shadow-md ${allMultiLegsSelected ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 cursor-pointer' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80'}" ${allMultiLegsSelected ? '' : 'disabled'}>
                <span>${allMultiLegsSelected ? 'Continue to Seat Selection →' : 'Select All Leg Flights'}</span>
              </button>
            </div>

          </div>
        </div>
      ` : ''}

    </div>
  `;
}
