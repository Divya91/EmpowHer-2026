import { SkyRouteStore } from '../services/store.service';

export function renderNavbar(
  activeRoute: string,
  isMobileMenuOpen: boolean = false
): string {
  const store = SkyRouteStore.getInstance();
  const user = store.currentUser;
  const isAdmin = user?.roles.includes('ROLE_ADMIN');
  const userInitial = (user?.fullName?.trim()?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();
  const unreadNotifCount = store.getUnreadNotificationCount();

  return `
    <header class="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-sm">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group" id="nav-brand">
            <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span class="font-bold text-base sm:text-lg tracking-tight text-white">SkyRoute</span>
              <div class="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 border border-slate-700/60 rounded text-[10px] text-slate-300 font-mono">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Flight Hub</span>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center space-x-1">
            <button id="nav-home-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeRoute === 'home' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}">
              Home
            </button>
            <button id="nav-search-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeRoute === 'search' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}">
              Search Flights
            </button>
            <button id="nav-history-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeRoute === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}">
              My Bookings
            </button>
            ${isAdmin ? `
              <button id="nav-admin-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-amber-300 hover:bg-slate-800 transition-colors border border-amber-500/30 ${activeRoute === 'admin' ? 'bg-slate-800 text-white font-bold' : ''}">
                <svg class="w-3.5 h-3.5 fill-none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span>Admin</span>
              </button>
            ` : ''}
          </nav>

          <!-- Right Actions (Notification Bell, User menu & Mobile Hamburger) -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            
            <!-- Notification Bell Icon Trigger -->
            <button id="nav-notifications-btn" class="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors" title="Notifications & Alerts">
              <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              ${unreadNotifCount > 0 ? `
                <span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                  ${unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              ` : ''}
            </button>

            <!-- User Profile (Desktop & Mobile) -->
            ${user ? `
              <div class="relative group">
                <button id="user-menu-btn" title="${user.fullName} (${isAdmin ? 'Admin' : 'Passenger'})" class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full ${isAdmin ? 'bg-amber-600 border-amber-500/40 text-amber-50' : 'bg-blue-600 border-blue-500/40 text-white'} border hover:opacity-90 active:scale-95 transition-all flex items-center justify-center font-bold text-xs sm:text-sm select-none shadow-sm">
                  <span>${userInitial}</span>
                  <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'} border-2 border-slate-900"></span>
                </button>

                <!-- Desktop Dropdown -->
                <div class="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 hidden group-hover:block transition-all z-50">
                  <div class="px-4 py-2 border-b border-slate-800">
                    <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400">${isAdmin ? 'Admin Account' : 'Passenger Account'}</p>
                    <p class="text-xs font-semibold text-white truncate">${user.fullName}</p>
                    <p class="text-[11px] text-slate-400 truncate">${user.email}</p>
                  </div>
                  <button id="dropdown-notif-btn" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      <span>Notifications</span>
                    </div>
                    ${unreadNotifCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">${unreadNotifCount}</span>` : ''}
                  </button>
                  <button id="dropdown-history-btn" class="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center space-x-2">
                    <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>My Bookings</span>
                  </button>
                  ${isAdmin ? `
                    <button id="dropdown-admin-btn" class="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 flex items-center space-x-2">
                      <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                      <span>Admin Operations</span>
                    </button>
                  ` : ''}
                  <div class="border-t border-slate-800 my-1"></div>
                  <button id="nav-logout-btn" class="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800 flex items-center space-x-2">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ` : `
              <button id="nav-login-btn" class="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-all">
                Sign In
              </button>
            `}

            <!-- Mobile Hamburger Toggle Button -->
            <button id="mobile-menu-toggle-btn" class="md:hidden p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 focus:outline-none transition-colors" aria-label="Toggle navigation menu">
              ${isMobileMenuOpen ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ` : `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              `}
            </button>

          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation Menu -->
      ${isMobileMenuOpen ? `
        <div id="mobile-nav-drawer" class="md:hidden bg-slate-900/98 border-t border-slate-800 px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          
          <div class="space-y-1">
            <button id="mobile-nav-home-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeRoute === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <span class="flex items-center space-x-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Home</span>
              </span>
              ${activeRoute === 'home' ? `<span class="w-1.5 h-1.5 rounded-full bg-white"></span>` : ''}
            </button>

            <button id="mobile-nav-search-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeRoute === 'search' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <span class="flex items-center space-x-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span>Search Flights</span>
              </span>
              ${activeRoute === 'search' ? `<span class="w-1.5 h-1.5 rounded-full bg-white"></span>` : ''}
            </button>

            <button id="mobile-nav-history-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeRoute === 'history' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}">
              <span class="flex items-center space-x-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>My Bookings</span>
              </span>
              ${activeRoute === 'history' ? `<span class="w-1.5 h-1.5 rounded-full bg-white"></span>` : ''}
            </button>

            <button id="mobile-nav-notif-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-300 hover:bg-slate-800 hover:text-white">
              <span class="flex items-center space-x-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span>Notifications</span>
              </span>
              ${unreadNotifCount > 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">${unreadNotifCount}</span>` : ''}
            </button>

            ${isAdmin ? `
              <button id="mobile-nav-admin-btn" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeRoute === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/40'}">
                <span class="flex items-center space-x-2.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <span>Admin Dashboard</span>
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-mono">Operations</span>
              </button>
            ` : ''}
          </div>

          <!-- User Details / Sign in section for Mobile -->
          <div class="pt-3 border-t border-slate-800/80">
            ${user ? `
              <div class="p-3 bg-slate-800/70 rounded-lg flex items-center justify-between">
                <div class="flex items-center space-x-2.5 min-w-0">
                  <div class="relative w-8 h-8 rounded-full ${isAdmin ? 'bg-amber-600 border-amber-500/40 text-amber-50' : 'bg-blue-600 border-blue-500/40 text-white'} border flex items-center justify-center font-bold text-xs select-none shadow-sm flex-shrink-0">
                    <span>${userInitial}</span>
                    <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'} border-2 border-slate-900"></span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-white truncate">${user.fullName}</p>
                    <p class="text-[10px] text-slate-400 truncate">${user.email}</p>
                  </div>
                </div>
                <button id="mobile-nav-logout-btn" class="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 flex-shrink-0 transition-colors" title="Sign Out">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                </button>
              </div>
            ` : `
              <button id="mobile-nav-login-btn" class="w-full py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-md transition-all text-center">
                Sign In to SkyRoute
              </button>
            `}
          </div>

        </div>
      ` : ''}
    </header>
  `;
}


