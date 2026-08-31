import { FlightResponseDto, TripType } from '../types';
import { SkyRouteStore } from '../services/store.service';

export function renderBookingCheckoutView(
  flight: FlightResponseDto,
  selectedSeats: string[] = [],
  step: number = 1,
  paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' = 'CARD',
  selectedAddons: { insurance: boolean; meal: string; baggage: string } = { insurance: true, meal: 'VEG', baggage: '0' },
  upiSubMode: 'ID' | 'QR' = 'ID',
  selectedBank: string = 'HDFC',
  paymentTimeRemaining: number = 600,
  tripType: TripType = 'ONE_WAY',
  returnFlight: FlightResponseDto | null = null,
  multiCityFlights: FlightResponseDto[] = [],
  returnSeats: string[] = ['16F'],
  multiCitySeats: { [legIndex: number]: string[] } = {}
): string {
  const store = SkyRouteStore.getInstance();
  const user = store.currentUser;
  
  let basePrice = flight.baseFare;
  let taxes = flight.taxAmount;
  let seatSurcharge = (selectedSeats.length || 1) * 250;

  if (tripType === 'ROUND_TRIP' && returnFlight) {
    basePrice = flight.baseFare + returnFlight.baseFare;
    taxes = flight.taxAmount + returnFlight.taxAmount;
    seatSurcharge = ((selectedSeats.length || 1) + (returnSeats.length || 1)) * 250;
  } else if (tripType === 'MULTI_CITY' && multiCityFlights.length > 0) {
    basePrice = multiCityFlights.reduce((acc, f) => acc + f.baseFare, 0);
    taxes = multiCityFlights.reduce((acc, f) => acc + f.taxAmount, 0);
    seatSurcharge = multiCityFlights.length * 250;
  }
  
  const mealCost = selectedAddons.meal === 'VEG' ? 350 : selectedAddons.meal === 'NON_VEG' ? 400 : 0;
  const baggageCost = selectedAddons.baggage === '5' ? 1800 : selectedAddons.baggage === '10' ? 3500 : 0;
  const insuranceCost = selectedAddons.insurance ? 299 : 0;
  
  const total = basePrice + taxes + seatSurcharge + mealCost + baggageCost + insuranceCost;

  // Format timer minutes and seconds
  const timerMinutes = Math.floor(paymentTimeRemaining / 60);
  const timerSeconds = paymentTimeRemaining % 60;
  const formattedTimer = `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;
  const isTimerCritical = paymentTimeRemaining <= 60;
  const isTimerWarning = paymentTimeRemaining <= 180 && !isTimerCritical;

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Checkout Stepper Progress Bar -->
      <div class="mb-8 max-w-xl mx-auto">
        <div class="flex items-center justify-between relative">
          <div class="w-full absolute top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-7 h-7 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-xs flex items-center justify-center shadow-sm">1</div>
            <span class="text-[11px] font-semibold text-slate-700 mt-1">Passenger</span>
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div class="w-7 h-7 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-xs flex items-center justify-center shadow-sm">2</div>
            <span class="text-[11px] font-semibold text-slate-700 mt-1">Add-ons</span>
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <div class="w-7 h-7 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-xs flex items-center justify-center shadow-sm">3</div>
            <span class="text-[11px] font-semibold text-slate-700 mt-1">Payment</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Steps Form -->
        <div class="lg:col-span-8 space-y-6">
          
          ${step === 1 ? `
            <!-- Step 1: Passenger Details -->
            <div class="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
              <div class="border-b border-slate-100 pb-3">
                <h3 class="text-sm font-bold text-slate-900">Passenger Information</h3>
                <p class="text-xs text-slate-500 mt-0.5">Please ensure name matches government-issued photo ID (Aadhaar / Passport).</p>
              </div>

              <form id="passenger-form" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">First & Middle Name *</label>
                    <input type="text" id="p-first-name" value="${user ? user.fullName.split(' ')[0] : ''}" placeholder="First name" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Last Name *</label>
                    <input type="text" id="p-last-name" value="${user && user.fullName.split(' ').length > 1 ? user.fullName.split(' ').slice(1).join(' ') : ''}" placeholder="Last name" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender *</label>
                    <select id="p-gender" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date of Birth *</label>
                    <input type="date" id="p-dob" value="1992-06-15" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Assigned Seat(s)</label>
                    <input type="text" id="p-seat" value="${tripType === 'ROUND_TRIP' ? `Out: ${selectedSeats[0] || '14A'} | Ret: ${returnSeats[0] || '16F'}` : tripType === 'MULTI_CITY' ? `${multiCityFlights.length} Seats Assigned` : (selectedSeats[0] || '14A')}" readonly class="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 cursor-not-allowed">
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Contact Details (for e-Ticket & SMS Updates)</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
                      <input type="email" id="p-email" value="${user?.email || 'john.doe@example.com'}" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Number *</label>
                      <input type="tel" id="p-phone" value="${user?.phoneNumber || '+91 9876543210'}" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex justify-end">
                  <button type="submit" id="passenger-step-next-btn" class="px-5 py-2.5 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all flex items-center space-x-1.5">
                    <span>Continue to Add-ons</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                </div>
              </form>
            </div>
          ` : step === 2 ? `
            <!-- Step 2: Add-ons (Meals, Insurance, Excess Baggage) -->
            <div class="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
              <div class="border-b border-slate-100 pb-3">
                <h3 class="text-sm font-bold text-slate-900">Customise Your Journey (Add-ons)</h3>
                <p class="text-xs text-slate-500 mt-0.5">Select optional inflight dining, luggage upgrades, and travel protection.</p>
              </div>

              <div class="space-y-3">
                
                <!-- Travel Insurance -->
                <div class="p-3.5 rounded-lg border border-slate-200 flex items-start justify-between bg-slate-50/50 hover:bg-blue-50/20 transition-colors">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">SkyRoute Comprehensive Trip Cover</h4>
                      <p class="text-[11px] text-slate-500">Covers trip delays, emergency medical up to ₹5,00,000, and lost baggage compensation.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 flex-shrink-0">
                    <span class="text-xs font-bold text-slate-900">₹299</span>
                    <input type="checkbox" id="addon-insurance" ${selectedAddons.insurance ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                  </div>
                </div>

                <!-- In-flight Meal -->
                <div class="p-3.5 rounded-lg border border-slate-200 flex items-start justify-between bg-slate-50/50 hover:bg-blue-50/20 transition-colors">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">Gourmet In-flight Meal Box</h4>
                      <p class="text-[11px] text-slate-500">Freshly prepared chef meal box with hot beverage or juice.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 flex-shrink-0">
                    <select id="addon-meal-select" class="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500">
                      <option value="NONE" ${selectedAddons.meal === 'NONE' ? 'selected' : ''}>No Meal (₹0)</option>
                      <option value="VEG" ${selectedAddons.meal === 'VEG' ? 'selected' : ''}>Vegetarian Thali (+₹350)</option>
                      <option value="NON_VEG" ${selectedAddons.meal === 'NON_VEG' ? 'selected' : ''}>Butter Chicken Box (+₹400)</option>
                    </select>
                  </div>
                </div>

                <!-- Extra Baggage -->
                <div class="p-3.5 rounded-lg border border-slate-200 flex items-start justify-between bg-slate-50/50 hover:bg-blue-50/20 transition-colors">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">Pre-booked Extra Luggage</h4>
                      <p class="text-[11px] text-slate-500">Save up to 40% compared to airport check-in counter rates.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 flex-shrink-0">
                    <select id="addon-baggage-select" class="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500">
                      <option value="0" ${selectedAddons.baggage === '0' ? 'selected' : ''}>Standard (15 kg Free)</option>
                      <option value="5" ${selectedAddons.baggage === '5' ? 'selected' : ''}>+5 kg Extra (+₹1,800)</option>
                      <option value="10" ${selectedAddons.baggage === '10' ? 'selected' : ''}>+10 kg Extra (+₹3,500)</option>
                    </select>
                  </div>
                </div>

              </div>

              <div class="pt-4 flex justify-between">
                <button type="button" id="step2-back-btn" class="px-4 py-2 rounded-lg font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-colors">
                  Back
                </button>
                <button type="button" id="step2-next-btn" class="px-5 py-2.5 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all flex items-center space-x-1.5">
                  <span>Proceed to Payment</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          ` : `
            <!-- Step 3: Secure Payment Gateway Simulator -->
            <div class="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
              
              <!-- Payment Session Live Countdown Banner -->
              <div id="payment-timer-banner" class="p-3.5 rounded-xl border flex items-center justify-between transition-all ${isTimerCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : isTimerWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50/70 border-blue-200/80 text-blue-900'}">
                <div class="flex items-center space-x-2.5">
                  <div class="w-8 h-8 rounded-lg ${isTimerCritical ? 'bg-rose-100 text-rose-600 animate-pulse' : isTimerWarning ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <div class="flex items-center space-x-1.5">
                      <span class="text-xs font-bold">Fare & Seat Hold Active</span>
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${isTimerCritical ? 'bg-rose-200/70 text-rose-800' : isTimerWarning ? 'bg-amber-200/70 text-amber-800' : 'bg-blue-200/70 text-blue-800'}">Live Timer</span>
                    </div>
                    <p class="text-[11px] ${isTimerCritical ? 'text-rose-700 font-medium' : isTimerWarning ? 'text-amber-700' : 'text-slate-500'}">Please complete payment before session expires to guarantee your seat & fare lock.</p>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <span class="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-bold">REMAINING</span>
                  <span id="payment-timer-display" class="font-mono text-base font-bold ${isTimerCritical ? 'text-rose-600 animate-pulse' : isTimerWarning ? 'text-amber-600' : 'text-blue-600'}">${formattedTimer}</span>
                </div>
              </div>

              <div class="border-b border-slate-100 pb-3">
                <h3 class="text-sm font-bold text-slate-900">Select Payment Method</h3>
                <p class="text-xs text-slate-500 mt-0.5">256-Bit SSL Encrypted Payment Processing</p>
              </div>

              <!-- Payment Method Selector Tabs -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button type="button" class="pay-method-tab p-3 rounded-lg border text-center transition-all ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'}" data-method="CARD">
                  <span class="text-xs block">Credit / Debit Card</span>
                </button>
                <button type="button" class="pay-method-tab p-3 rounded-lg border text-center transition-all ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'}" data-method="UPI">
                  <span class="text-xs block">UPI / QR Code</span>
                </button>
                <button type="button" class="pay-method-tab p-3 rounded-lg border text-center transition-all ${paymentMethod === 'NETBANKING' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'}" data-method="NETBANKING">
                  <span class="text-xs block">Net Banking</span>
                </button>
                <button type="button" class="pay-method-tab p-3 rounded-lg border text-center transition-all ${paymentMethod === 'WALLET' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'}" data-method="WALLET">
                  <span class="text-xs block">Wallets</span>
                </button>
              </div>

              <form id="payment-form" class="space-y-4 pt-2">
                ${paymentMethod === 'CARD' ? `
                  <div class="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Card Number</label>
                      <input type="text" id="card-num" value="4532 •••• •••• 8842" placeholder="4532 0000 0000 0000" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Valid Thru</label>
                        <input type="text" id="card-exp" value="08/28" placeholder="MM/YY" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>
                      <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">CVV / CVC</label>
                        <input type="password" id="card-cvv" value="789" placeholder="123" maxlength="4" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cardholder Name</label>
                      <input type="text" id="card-name" value="${user?.fullName || 'Johnathan Doe'}" placeholder="Name on card" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                  </div>
                ` : paymentMethod === 'UPI' ? `
                  <div class="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                    <div class="flex items-center space-x-3 border-b border-slate-200 pb-3">
                      <button type="button" class="upi-submode-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${upiSubMode === 'ID' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}" data-mode="ID">
                        VPA / UPI ID
                      </button>
                      <button type="button" class="upi-submode-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${upiSubMode === 'QR' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}" data-mode="QR">
                        Scan QR Code
                      </button>
                    </div>

                    ${upiSubMode === 'ID' ? `
                      <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Virtual Payment Address (VPA)</label>
                        <input type="text" id="upi-vpa" value="john.doe@okhdfcbank" placeholder="yourname@upi" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <p class="text-[11px] text-slate-500 mt-1">Accept the payment notification prompt on Google Pay, PhonePe, or Paytm.</p>
                      </div>
                    ` : `
                      <div class="text-center py-3">
                        <div class="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 shadow-sm mx-auto mb-2 flex items-center justify-center">
                          <svg class="w-32 h-32 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-6-8h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm8-2h2v2h-2v-2zm-4-4h2v2h-2V6zm4 0h2v2h-2V6z"/>
                          </svg>
                        </div>
                        <span class="text-xs font-bold text-slate-800">Scan & Pay ₹${total.toLocaleString()}</span>
                        <p class="text-[10px] text-slate-500 mt-0.5">Compatible with any BHIM UPI enabled banking app</p>
                      </div>
                    `}
                  </div>
                ` : paymentMethod === 'NETBANKING' ? `
                  <div class="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Select Your Bank</label>
                    <select id="bank-select" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="HDFC" ${selectedBank === 'HDFC' ? 'selected' : ''}>HDFC Bank</option>
                      <option value="ICICI" ${selectedBank === 'ICICI' ? 'selected' : ''}>ICICI Bank</option>
                      <option value="SBI" ${selectedBank === 'SBI' ? 'selected' : ''}>State Bank of India (SBI)</option>
                      <option value="AXIS" ${selectedBank === 'AXIS' ? 'selected' : ''}>Axis Bank</option>
                      <option value="KOTAK" ${selectedBank === 'KOTAK' ? 'selected' : ''}>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                ` : `
                  <div class="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Select Digital Wallet</label>
                    <div class="space-y-2">
                      <label class="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-500 cursor-pointer transition-colors">
                        <div class="flex items-center space-x-3">
                          <input type="radio" name="wallet" value="AMAZON" checked class="w-4 h-4 text-blue-600 focus:ring-blue-500">
                          <div>
                            <p class="text-xs font-bold text-slate-900">Amazon Pay Balance</p>
                            <p class="text-[10px] text-slate-500">Fast one-click checkout</p>
                          </div>
                        </div>
                        <span class="text-xs font-mono font-bold text-emerald-600">₹3,450 Available</span>
                      </label>
                    </div>
                  </div>
                `}

                <div class="pt-4 flex justify-between items-center">
                  <button type="button" id="step3-back-btn" class="px-4 py-2 rounded-lg font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-colors">
                    Back
                  </button>
                  <button type="submit" id="pay-confirm-btn" class="px-6 py-2.5 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-sm transition-all flex items-center space-x-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Pay ₹${total.toLocaleString()} & Confirm Ticket</span>
                  </button>
                </div>
              </form>

            </div>
          `}

        </div>

        <!-- Right Side Flight Itinerary & Order Summary -->
        <div class="lg:col-span-4 space-y-5">
          <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 class="text-sm font-bold text-slate-900">Fare Summary</h3>

            ${tripType === 'ROUND_TRIP' && returnFlight ? `
              <!-- Roundtrip Flight Cards -->
              <div class="space-y-2">
                <div class="flex items-center space-x-3 p-2.5 bg-blue-50/40 rounded-lg border border-blue-100">
                  <img src="${flight.airlineLogo}" class="w-7 h-7 rounded object-cover" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold text-blue-700 uppercase">Outbound</span>
                      <span class="text-xs font-bold text-slate-900">₹${flight.totalPrice.toLocaleString()}</span>
                    </div>
                    <p class="text-xs font-bold text-slate-900">${flight.originCity} → ${flight.destinationCity}</p>
                    <p class="text-[10px] text-slate-500">${flight.flightNumber} • ${flight.travelDate} (Seat: ${selectedSeats[0] || '14A'})</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3 p-2.5 bg-blue-50/40 rounded-lg border border-blue-100">
                  <img src="${returnFlight.airlineLogo}" class="w-7 h-7 rounded object-cover" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold text-blue-700 uppercase">Return</span>
                      <span class="text-xs font-bold text-slate-900">₹${returnFlight.totalPrice.toLocaleString()}</span>
                    </div>
                    <p class="text-xs font-bold text-slate-900">${returnFlight.originCity} → ${returnFlight.destinationCity}</p>
                    <p class="text-[10px] text-slate-500">${returnFlight.flightNumber} • ${returnFlight.travelDate} (Seat: ${returnSeats[0] || '16F'})</p>
                  </div>
                </div>
              </div>
            ` : tripType === 'MULTI_CITY' && multiCityFlights.length > 0 ? `
              <div class="space-y-2">
                ${multiCityFlights.map((f, i) => `
                  <div class="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">${i + 1}</span>
                    <div class="min-w-0 flex-1">
                      <p class="font-bold text-slate-900">${f.originIata} → ${f.destinationIata}</p>
                      <p class="text-[10px] text-slate-500">${f.flightNumber} • ${f.travelDate}</p>
                    </div>
                    <span class="font-bold text-slate-900">₹${f.totalPrice.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <!-- Single Flight Miniature Ribbon -->
              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <img src="${flight.airlineLogo}" class="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <p class="text-xs font-bold text-slate-900">${flight.originCity} → ${flight.destinationCity}</p>
                  <p class="text-[10px] text-slate-500">${flight.flightNumber} • ${flight.travelDate}</p>
                </div>
              </div>
            `}

            <!-- Itemized Pricing Breakdown -->
            <div class="space-y-2 text-xs text-slate-600">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span>Airfare (${tripType === 'ROUND_TRIP' ? '2 Flights' : tripType === 'MULTI_CITY' ? `${multiCityFlights.length} Flights` : '1 Adult'})</span>
                <span class="font-bold text-slate-900">₹${basePrice.toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span>Aviation Taxes & Fees</span>
                <span class="font-bold text-slate-900">₹${taxes.toLocaleString()}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span>Seat Selection</span>
                <span class="font-bold text-blue-600">+₹${seatSurcharge.toLocaleString()}</span>
              </div>
              ${mealCost > 0 ? `
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span>In-flight Meal (${selectedAddons.meal === 'VEG' ? 'Vegetarian' : 'Non-Veg'})</span>
                  <span class="font-bold text-slate-900">+₹${mealCost.toLocaleString()}</span>
                </div>
              ` : ''}
              ${baggageCost > 0 ? `
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span>Extra Baggage (+${selectedAddons.baggage} kg)</span>
                  <span class="font-bold text-slate-900">+₹${baggageCost.toLocaleString()}</span>
                </div>
              ` : ''}
              ${insuranceCost > 0 ? `
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span>Comprehensive Insurance</span>
                  <span class="font-bold text-slate-900">+₹${insuranceCost.toLocaleString()}</span>
                </div>
              ` : ''}
            </div>

            <div class="pt-3 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span class="text-xs text-slate-400">Total Payable</span>
                <p class="text-xl font-black text-slate-900">₹${total.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;
}
