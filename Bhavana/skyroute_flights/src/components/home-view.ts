import { SkyRouteStore } from '../services/store.service';
import { TripType, MultiCityLeg } from '../types';

export function renderHomeView(
  tripType: TripType = 'ONE_WAY',
  origin: string = 'BLR',
  destination: string = 'DEL',
  departureDate?: string,
  returnDate?: string,
  multiCityLegs?: MultiCityLeg[],
  cabinClass: string = 'ECONOMY',
  passengers: number = 1
): string {
  const store = SkyRouteStore.getInstance();
  const airports = store.airports;
  const today = new Date().toISOString().split('T')[0];
  const defaultDeparture = departureDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const defaultReturn = returnDate || new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0];

  const legs: MultiCityLeg[] = multiCityLegs && multiCityLegs.length >= 2 ? multiCityLegs : [
    { id: 'leg-1', origin: origin || 'BLR', destination: destination || 'DEL', date: defaultDeparture },
    { id: 'leg-2', origin: destination || 'DEL', destination: 'BOM', date: defaultReturn }
  ];

  return `
    <div class="relative overflow-hidden">
      
      <!-- Hero Section with Aviation Backdrop -->
      <section class="relative bg-slate-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <!-- Flight flying in the air background image with theme-matched atmospheric overlay -->
        <div class="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80" 
            alt="Commercial airliner flying through clouds" 
            class="w-full h-full object-cover object-center opacity-35 filter brightness-90 saturate-110"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-900"></div>
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.2),rgba(15,23,42,0.7))]"></div>
        </div>

        <div class="max-w-6xl mx-auto text-center relative z-10">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Fly Smarter • Travel Better</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Commercial Flight Operations & <span class="text-blue-400">Reservation Gateway</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Search real-time inventory, book one-way, roundtrip or multi-city flights, inspect live aircraft seating, and coordinate trips with 24/7 AI assistance.
          </p>

          <!-- Main Flight Search Widget Card -->
          <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-slate-900 border border-slate-200 text-left max-w-5xl mx-auto">
            
            <!-- Trip Type & Class Tabs -->
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <!-- Active Trip Type Switcher -->
              <div class="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200/80">
                <button type="button" id="trip-oneway" data-triptype="ONE_WAY" class="trip-type-btn px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${tripType === 'ONE_WAY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'}">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  <span>One Way</span>
                </button>
                <button type="button" id="trip-round" data-triptype="ROUND_TRIP" class="trip-type-btn px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${tripType === 'ROUND_TRIP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'}">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  <span>Round Trip</span>
                </button>
                <button type="button" id="trip-multi" data-triptype="MULTI_CITY" class="trip-type-btn px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${tripType === 'MULTI_CITY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'}">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  <span>Multi-City</span>
                </button>
              </div>

              <div class="flex items-center space-x-3 text-xs font-medium text-slate-600">
                <div class="flex items-center space-x-1.5">
                  <span class="text-slate-400 font-semibold">Class:</span>
                  <select id="cabin-class-select" class="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option value="ECONOMY" ${cabinClass === 'ECONOMY' ? 'selected' : ''}>Economy</option>
                    <option value="PREMIUM_ECONOMY" ${cabinClass === 'PREMIUM_ECONOMY' ? 'selected' : ''}>Premium Economy</option>
                    <option value="BUSINESS" ${cabinClass === 'BUSINESS' ? 'selected' : ''}>Business Class</option>
                    <option value="FIRST" ${cabinClass === 'FIRST' ? 'selected' : ''}>First Class</option>
                  </select>
                </div>

                <div class="flex items-center space-x-1.5">
                  <span class="text-slate-400 font-semibold">Travellers:</span>
                  <select id="passengers-count-select" class="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                    <option value="1" ${passengers === 1 ? 'selected' : ''}>1 Adult</option>
                    <option value="2" ${passengers === 2 ? 'selected' : ''}>2 Adults</option>
                    <option value="3" ${passengers === 3 ? 'selected' : ''}>3 Adults</option>
                    <option value="4" ${passengers === 4 ? 'selected' : ''}>4 Adults</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- DYNAMIC SEARCH FORM BASED ON TRIP TYPE -->

            ${tripType === 'ONE_WAY' ? `
              <!-- ONE WAY FORM -->
              <form id="hero-search-form" class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                
                <!-- Origin Airport -->
                <div class="md:col-span-3 relative">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">From (Origin)</label>
                  <div class="relative">
                    <select id="search-origin-select" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === origin ? 'selected' : ''}>${a.city} (${a.iataCode}) - ${a.name}</option>`).join('')}
                    </select>
                  </div>
                </div>

                <!-- Swap Button -->
                <div class="hidden md:flex md:col-span-1 justify-center items-center pb-1">
                  <button type="button" id="swap-airports-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm transition-transform active:rotate-180" title="Swap Origin & Destination">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  </button>
                </div>

                <!-- Destination Airport -->
                <div class="md:col-span-3 relative">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">To (Destination)</label>
                  <div class="relative">
                    <select id="search-dest-select" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === destination ? 'selected' : ''}>${a.city} (${a.iataCode}) - ${a.name}</option>`).join('')}
                    </select>
                  </div>
                </div>

                <!-- Departure Date -->
                <div class="md:col-span-3">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Departure Date</label>
                  <input type="date" id="search-dep-date" value="${defaultDeparture}" min="${today}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>

                <!-- Submit Button -->
                <div class="md:col-span-2">
                  <button type="submit" id="hero-search-submit-btn" class="w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-sm flex items-center justify-center space-x-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>Search Flights</span>
                  </button>
                </div>
              </form>
            ` : tripType === 'ROUND_TRIP' ? `
              <!-- ROUND TRIP FORM -->
              <form id="hero-search-form" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  
                  <!-- Origin Airport -->
                  <div class="md:col-span-3 relative">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">From (Origin)</label>
                    <select id="search-origin-select" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === origin ? 'selected' : ''}>${a.city} (${a.iataCode})</option>`).join('')}
                    </select>
                  </div>

                  <!-- Swap Button -->
                  <div class="hidden md:flex md:col-span-1 justify-center items-center pb-1">
                    <button type="button" id="swap-airports-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm transition-transform active:rotate-180" title="Swap Origin & Destination">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </button>
                  </div>

                  <!-- Destination Airport -->
                  <div class="md:col-span-3 relative">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">To (Destination)</label>
                    <select id="search-dest-select" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === destination ? 'selected' : ''}>${a.city} (${a.iataCode})</option>`).join('')}
                    </select>
                  </div>

                  <!-- Departure Date -->
                  <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Depart</label>
                    <input type="date" id="search-dep-date" value="${defaultDeparture}" min="${today}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                  </div>

                  <!-- Return Date -->
                  <div class="md:col-span-3">
                    <label class="block text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center justify-between">
                      <span>Return Date</span>
                      <span class="text-[10px] font-semibold text-slate-400">Roundtrip saving 15%</span>
                    </label>
                    <input type="date" id="search-return-date" value="${defaultReturn}" min="${defaultDeparture}" class="w-full bg-blue-50/50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                  </div>

                </div>

                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center space-x-2 text-xs text-slate-500">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Combined roundtrip booking with linked return seats & single PNR receipt</span>
                  </div>

                  <button type="submit" id="hero-search-submit-btn" class="py-2.5 px-6 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-sm flex items-center justify-center space-x-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>Search Roundtrip Flights</span>
                  </button>
                </div>
              </form>
            ` : `
              <!-- MULTI-CITY FORM -->
              <form id="hero-search-form" class="space-y-4">
                
                <div class="space-y-3" id="multi-city-legs-container">
                  ${legs.map((leg, index) => `
                    <div class="multi-city-leg-row p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center gap-3" data-index="${index}">
                      
                      <!-- Leg Label Indicator -->
                      <div class="flex items-center justify-between md:justify-start space-x-2 md:w-24 flex-shrink-0">
                        <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">${index + 1}</span>
                        <span class="text-xs font-bold text-slate-800">Flight ${index + 1}</span>
                        
                        ${legs.length > 2 ? `
                          <button type="button" class="remove-multi-leg-btn md:hidden p-1 text-slate-400 hover:text-rose-600 text-xs font-semibold" data-index="${index}" title="Remove this flight segment">
                            ✕ Remove
                          </button>
                        ` : ''}
                      </div>

                      <!-- Leg Origin -->
                      <div class="flex-1 min-w-0">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</label>
                        <select class="multi-leg-origin w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" data-index="${index}">
                          ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === leg.origin ? 'selected' : ''}>${a.city} (${a.iataCode})</option>`).join('')}
                        </select>
                      </div>

                      <!-- Arrow Icon -->
                      <div class="hidden md:flex items-center justify-center text-slate-400 pt-3">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </div>

                      <!-- Leg Destination -->
                      <div class="flex-1 min-w-0">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To</label>
                        <select class="multi-leg-dest w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" data-index="${index}">
                          ${airports.map(a => `<option value="${a.iataCode}" ${a.iataCode === leg.destination ? 'selected' : ''}>${a.city} (${a.iataCode})</option>`).join('')}
                        </select>
                      </div>

                      <!-- Leg Travel Date -->
                      <div class="w-full md:w-36 flex-shrink-0">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
                        <input type="date" class="multi-leg-date w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" data-index="${index}" value="${leg.date}" min="${today}" required />
                      </div>

                      <!-- Desktop Remove Button -->
                      ${legs.length > 2 ? `
                        <div class="hidden md:flex items-center pt-3">
                          <button type="button" class="remove-multi-leg-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" data-index="${index}" title="Remove flight">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      ` : ''}

                    </div>
                  `).join('')}
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div>
                    ${legs.length < 4 ? `
                      <button type="button" id="add-multi-leg-btn" class="px-3.5 py-1.5 rounded-lg border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 active:scale-98 font-bold text-xs flex items-center space-x-1.5 transition-all">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                        <span>+ Add Another Flight Leg (Max 4)</span>
                      </button>
                    ` : `
                      <span class="text-xs text-slate-400 font-medium">Maximum 4 flight legs reached</span>
                    `}
                  </div>

                  <button type="submit" id="hero-search-submit-btn" class="py-2.5 px-6 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-98 shadow-sm flex items-center justify-center space-x-2 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>Search Multi-City Flights</span>
                  </button>
                </div>

              </form>
            `}

            <!-- Popular Quick Searches -->
            <div class="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-400 font-medium">Quick Routes:</span>
              <button class="quick-route-chip px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-slate-700 transition-colors" data-from="BLR" data-to="DEL">BLR → DEL (Bengaluru - Delhi)</button>
              <button class="quick-route-chip px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-slate-700 transition-colors" data-from="BLR" data-to="BOM">BLR → BOM (Bengaluru - Mumbai)</button>
              <button class="quick-route-chip px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-slate-700 transition-colors" data-from="BLR" data-to="DXB">BLR → DXB (Bengaluru - Dubai)</button>
            </div>

          </div>
        </div>
      </section>

      <!-- Key Value Pillars -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start space-x-4">
            <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">Zero Hidden Surcharges</h4>
              <p class="text-xs text-slate-500 mt-1">Itemized base airfare, fuel surcharge, and aviation taxes upfront.</p>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start space-x-4">
            <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">Interactive Seat Selection</h4>
              <p class="text-xs text-slate-500 mt-1">Pick your preferred window, extra-legroom or exit seat in real time.</p>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start space-x-4">
            <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">Automated Refunds</h4>
              <p class="text-xs text-slate-500 mt-1">Cancel online in 2 clicks with automated policy engine and refunds.</p>
            </div>
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start space-x-4">
            <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">AI Flight Copilot</h4>
              <p class="text-xs text-slate-500 mt-1">Live assistant with flight queries, policy checks, and itinerary tips.</p>
            </div>
          </div>

        </div>
      </section>

      <!-- Popular Destinations Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Featured Domestic & International Routes</h2>
            <p class="text-xs text-slate-500 mt-1">Direct commercial routes with guaranteed lowest inventory fares</p>
          </div>
          <button id="view-all-flights-btn" class="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center space-x-1">
            <span>Explore all flights</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div class="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer card-dest border border-slate-200" data-origin="BLR" data-dest="DEL">
            <div class="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style="background-image: url('https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">India Northern Hub</span>
                  <h3 class="text-lg font-bold">New Delhi (DEL)</h3>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-slate-300">From</span>
                  <p class="text-base font-bold text-white">₹5,800</p>
                </div>
              </div>
            </div>
          </div>

          <div class="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer card-dest border border-slate-200" data-origin="BLR" data-dest="BOM">
            <div class="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style="background-image: url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Financial Capital</span>
                  <h3 class="text-lg font-bold">Mumbai (BOM)</h3>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-slate-300">From</span>
                  <p class="text-base font-bold text-white">₹4,200</p>
                </div>
              </div>
            </div>
          </div>

          <div class="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer card-dest border border-slate-200" data-origin="BLR" data-dest="DXB">
            <div class="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style="background-image: url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80');"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">International Hub</span>
                  <h3 class="text-lg font-bold">Dubai (DXB)</h3>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-slate-300">From</span>
                  <p class="text-base font-bold text-white">₹18,500</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  `;
}
