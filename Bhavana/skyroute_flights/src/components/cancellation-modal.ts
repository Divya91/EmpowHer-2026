export function renderCancellationModal(
  bookingId: number,
  pnr: string,
  totalAmount: number
): string {
  const fee = 500;
  const refund = Math.max(0, totalAmount - fee);

  return `
    <div id="cancellation-backdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        <div class="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Cancel Booking</h3>
              <p class="text-xs text-slate-500">PNR: <strong class="font-mono text-slate-900">${pnr}</strong></p>
            </div>
          </div>
          <button id="close-cancel-modal-btn" class="w-7 h-7 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Refund Calculation Breakdown -->
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4 space-y-2 text-xs">
          <div class="flex justify-between text-slate-600">
            <span>Ticket Price Paid:</span>
            <span class="font-bold text-slate-900">₹${totalAmount.toLocaleString()}</span>
          </div>
          <div class="flex justify-between text-rose-600">
            <span>Cancellation Policy Fee:</span>
            <span class="font-semibold">-₹${fee.toLocaleString()}</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
            <span>Refund Payable:</span>
            <span class="text-emerald-600">₹${refund.toLocaleString()}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">Refund will be processed immediately to original payment source within 3-5 business days.</p>
        </div>

        <!-- Reason Selection -->
        <form id="confirm-cancel-form" class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Cancellation Reason *</label>
            <select id="cancel-reason" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Personal emergency">Personal emergency</option>
              <option value="Booked incorrect date/flight">Booked incorrect date/flight</option>
              <option value="Flight schedule inconvenient">Flight schedule inconvenient</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Additional Comments (Optional)</label>
            <textarea id="cancel-comments" rows="2" placeholder="Tell us if we can improve..." class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"></textarea>
          </div>

          <div class="pt-2 flex items-center justify-end space-x-2.5">
            <button type="button" id="cancel-abort-btn" class="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Keep Booking
            </button>
            <button type="submit" id="cancel-confirm-submit-btn" class="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-all flex items-center space-x-1.5" data-id="${bookingId}">
              <span>Confirm & Refund ₹${refund.toLocaleString()}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}

