import { SkyRouteStore } from '../services/store.service';
import { AdminDashboardDto, RefundDto } from '../types';

export function renderAdminDashboardView(
  metrics: AdminDashboardDto,
  refunds: RefundDto[]
): string {
  const store = SkyRouteStore.getInstance();
  const flights = store.flights;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Top Admin Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">OPERATIONS CONSOLE</span>
            <span class="text-xs text-slate-500">REST Backend Online</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Aviation Operations & Revenue Analytics</h2>
        </div>

        <div class="flex items-center space-x-3">
          <button id="admin-add-flight-btn" class="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all flex items-center space-x-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Schedule New Flight</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Bookings Revenue</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 mt-2">₹${metrics.totalRevenue.toLocaleString()}</p>
          <p class="text-[11px] text-emerald-600 font-semibold mt-1">↑ +18.4% from last week</p>
        </div>

        <!-- Total Bookings -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirmed Bookings</span>
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 mt-2">${metrics.totalBookings}</p>
          <p class="text-[11px] text-slate-500 font-medium mt-1">${metrics.todayBookings} bookings recorded today</p>
        </div>

        <!-- Pending Refunds -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Refunds</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 mt-2">${refunds.filter(r => r.refundStatus === 'PROCESSING').length}</p>
          <p class="text-[11px] text-amber-600 font-semibold mt-1">Requires banking settlement</p>
        </div>

        <!-- Active Commercial Flights -->
        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Flights</span>
            <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 mt-2">${flights.length}</p>
          <p class="text-[11px] text-slate-500 font-medium mt-1">Across 10 domestic & intl hubs</p>
        </div>

      </div>

      <!-- Route Performance & Airline Market Share Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Popular Routes Table (7 cols) -->
        <div class="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Top Revenue Routes</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th class="pb-3">Route</th>
                  <th class="pb-3">Bookings</th>
                  <th class="pb-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                ${metrics.popularRoutes.map(r => `
                  <tr>
                    <td class="py-3 font-semibold text-slate-900 flex items-center space-x-2">
                      <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>${r.route}</span>
                    </td>
                    <td class="py-3 text-slate-600">${r.bookings} pax</td>
                    <td class="py-3 text-right font-bold text-blue-600">${r.revenue}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Airline Share Distribution (5 cols) -->
        <div class="lg:col-span-5 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Airline Market Share</h3>
          <div class="space-y-3.5">
            ${metrics.airlineDistribution.map(a => `
              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>${a.airline}</span>
                  <span class="font-bold text-slate-900">${a.share}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div class="bg-blue-600 h-full rounded-full" style="width: ${a.share}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Refund Management & Settlement Table -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900">Refund Settlement Ledger</h3>
            <p class="text-xs text-slate-500 mt-0.5">Audit trail for user cancellations and automated banking refund disbursements.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th class="pb-3">Ref ID / PNR</th>
                <th class="pb-3">Customer</th>
                <th class="pb-3">Reason</th>
                <th class="pb-3">Refund Amount</th>
                <th class="pb-3">Status</th>
                <th class="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              ${refunds.map(r => `
                <tr>
                  <td class="py-3.5">
                    <span class="font-mono font-bold text-slate-900 block">${r.refundReference}</span>
                    <span class="text-[10px] text-slate-400">PNR: ${r.pnr}</span>
                  </td>
                  <td class="py-3.5">
                    <span class="font-semibold text-slate-900 block">${r.userName}</span>
                    <span class="text-[10px] text-slate-400">${r.userEmail}</span>
                  </td>
                  <td class="py-3.5 text-slate-600 max-w-[160px] truncate">${r.cancellationReason}</td>
                  <td class="py-3.5 font-bold text-slate-900 text-xs">₹${r.refundAmount.toLocaleString()}</td>
                  <td class="py-3.5">
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      r.refundStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }">
                      ${r.refundStatus}
                    </span>
                  </td>
                  <td class="py-3.5 text-right">
                    ${r.refundStatus === 'PROCESSING' ? `
                      <button class="approve-refund-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all" data-id="${r.id}">
                        Approve & Settle
                      </button>
                    ` : `
                      <span class="text-[10px] text-slate-400 font-semibold">Settled</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

