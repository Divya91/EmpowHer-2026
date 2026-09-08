import { SkyRouteStore } from '../services/store.service';
import { NotificationDto } from '../types';

export function renderNotificationPanel(
  isOpen: boolean,
  currentFilter: 'ALL' | 'FLIGHTS' | 'BOOKINGS' | 'OFFERS' = 'ALL'
): string {
  if (!isOpen) return '';

  const store = SkyRouteStore.getInstance();
  const allNotifications = store.notifications;
  const unreadCount = store.getUnreadNotificationCount();

  const filteredNotifications = allNotifications.filter(n => {
    if (currentFilter === 'ALL') return true;
    if (currentFilter === 'FLIGHTS') {
      return ['FLIGHT_UPDATE', 'GATE_CHANGE', 'CHECKIN'].includes(n.notificationType);
    }
    if (currentFilter === 'BOOKINGS') {
      return ['BOOKING', 'PAYMENT', 'REFUND'].includes(n.notificationType);
    }
    if (currentFilter === 'OFFERS') {
      return ['OFFER', 'WELCOME'].includes(n.notificationType);
    }
    return true;
  });

  const formatTimeAgo = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    if (priority === 'URGENT' || type === 'GATE_CHANGE') {
      return `
        <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      `;
    }
    if (type === 'FLIGHT_UPDATE' || type === 'CHECKIN') {
      return `
        <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </div>
      `;
    }
    if (type === 'BOOKING') {
      return `
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      `;
    }
    if (type === 'REFUND') {
      return `
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
        </div>
      `;
    }
    return `
      <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      </div>
    `;
  };

  return `
    <div id="notification-backdrop" class="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div id="notification-panel-drawer" class="w-full sm:w-[420px] max-w-full h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200" onclick="event.stopPropagation()">
        
        <!-- Panel Header -->
        <div class="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-bold text-white flex items-center space-x-2">
                <span>Notification Hub</span>
                ${unreadCount > 0 ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">${unreadCount} Unread</span>
                ` : ''}
              </h2>
              <p class="text-[11px] text-slate-400">Real-time gate, flight and booking alerts</p>
            </div>
          </div>

          <button id="close-notification-panel-btn" class="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors" title="Close notifications">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Filter Tabs & Quick Action Bar -->
        <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <!-- Filter Tabs -->
          <div class="flex items-center space-x-1">
            <button data-filter="ALL" class="notif-filter-btn px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${currentFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}">
              All (${allNotifications.length})
            </button>
            <button data-filter="FLIGHTS" class="notif-filter-btn px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${currentFilter === 'FLIGHTS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}">
              Flights
            </button>
            <button data-filter="BOOKINGS" class="notif-filter-btn px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${currentFilter === 'BOOKINGS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}">
              Bookings
            </button>
            <button data-filter="OFFERS" class="notif-filter-btn px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${currentFilter === 'OFFERS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}">
              Offers
            </button>
          </div>

          <!-- Actions: Mark all read / Clear -->
          <div class="flex items-center space-x-1.5 text-[11px]">
            ${unreadCount > 0 ? `
              <button id="mark-all-read-btn" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline" title="Mark all notifications as read">
                Mark read
              </button>
              <span class="text-slate-300">•</span>
            ` : ''}
            <button id="clear-all-notifs-btn" class="text-slate-500 hover:text-rose-600 font-medium hover:underline" title="Clear all notifications">
              Clear all
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/60">
          ${filteredNotifications.length === 0 ? `
            <div class="py-16 text-center text-slate-500 space-y-3">
              <div class="w-12 h-12 rounded-full bg-slate-200 text-slate-400 mx-auto flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <p class="text-xs font-semibold text-slate-700">No Notifications</p>
              <p class="text-[11px] text-slate-400 max-w-xs mx-auto">You're all caught up! Live flight updates, gate assignments and booking confirmations will appear here.</p>
            </div>
          ` : `
            ${filteredNotifications.map(item => `
              <div class="notif-card p-3.5 bg-white rounded-xl border ${item.isRead ? 'border-slate-200 opacity-90' : 'border-blue-200 ring-1 ring-blue-100'} shadow-xs space-y-2 cursor-pointer hover:border-slate-300 transition-all relative group" data-id="${item.id}">
                
                <div class="flex items-start space-x-3">
                  ${getNotificationIcon(item.notificationType, item.priority)}

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1.5">
                      <h4 class="text-xs font-bold text-slate-900 truncate flex items-center space-x-1.5">
                        <span>${item.title}</span>
                        ${!item.isRead ? `<span class="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"></span>` : ''}
                      </h4>
                      <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">${formatTimeAgo(item.createdAt)}</span>
                    </div>

                    <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">${item.message}</p>

                    <!-- Meta Tags / CTAs -->
                    <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        ${item.pnr ? `
                          <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            PNR: ${item.pnr}
                          </span>
                        ` : ''}
                        ${item.priority === 'URGENT' ? `
                          <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold uppercase">
                            Urgent
                          </span>
                        ` : ''}
                      </div>

                      <div class="flex items-center space-x-2">
                        ${item.pnr ? `
                          <button class="notif-view-ticket-btn text-[11px] font-bold text-blue-600 hover:text-blue-800" data-pnr="${item.pnr}">
                            View Ticket →
                          </button>
                        ` : item.notificationType === 'OFFER' ? `
                          <button class="notif-search-deal-btn text-[11px] font-bold text-blue-600 hover:text-blue-800">
                            Search Deal →
                          </button>
                        ` : ''}

                        <button class="notif-delete-btn opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity" data-id="${item.id}" title="Delete notification">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            `).join('')}
          `}
        </div>

        <!-- Real-Time Simulator Trigger Bar -->
        <div class="p-3 bg-slate-900 text-white border-t border-slate-800 flex-shrink-0 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Trigger Live Event Simulation</span>
            </span>
          </div>

          <div class="grid grid-cols-2 gap-1.5">
            <button id="sim-gate-change-btn" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-rose-300 hover:text-white rounded-lg border border-slate-700 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all">
              <span>🚨 Gate Change</span>
            </button>
            <button id="sim-flight-delay-btn" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-white rounded-lg border border-slate-700 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all">
              <span>⏳ Flight Delay</span>
            </button>
            <button id="sim-checkin-btn" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-300 hover:text-white rounded-lg border border-slate-700 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all">
              <span>🎫 Check-in Open</span>
            </button>
            <button id="sim-price-drop-btn" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-300 hover:text-white rounded-lg border border-slate-700 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-all">
              <span>🔥 Price Drop</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
