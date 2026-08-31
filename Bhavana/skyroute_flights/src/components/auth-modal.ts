export function renderAuthModal(mode: 'login' | 'register' = 'login'): string {
  return `
    <div id="auth-modal-backdrop" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200 relative">
        
        <!-- Close button -->
        <button id="close-auth-modal-btn" class="absolute top-5 right-5 w-7 h-7 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Brand Header -->
        <div class="text-center mb-5">
          <div class="w-11 h-11 rounded-lg bg-slate-900 flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-800">
            <svg class="w-5 h-5 text-blue-400 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900">${mode === 'login' ? 'Welcome Back to SkyRoute' : 'Create SkyRoute Account'}</h3>
          <p class="text-xs text-slate-500 mt-1">${mode === 'login' ? 'Sign in to access your flight bookings & privileges' : 'Join thousands of smart travelers worldwide'}</p>
        </div>

        <!-- Quick Demo Profiles Bar -->
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-center">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Demo Fill</span>
          <div class="flex justify-center space-x-2">
            <button type="button" id="quick-fill-user-btn" class="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all">
              Demo Passenger
            </button>
            <button type="button" id="quick-fill-admin-btn" class="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-900 hover:border-slate-400 shadow-sm transition-all">
              Demo Admin
            </button>
          </div>
        </div>

        <!-- Auth Form -->
        <form id="auth-form" class="space-y-3.5">
          ${mode === 'register' ? `
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name *</label>
              <input type="text" id="auth-fullname" placeholder="e.g. Johnathan Doe" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          ` : ''}

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
            <input type="email" id="auth-email" value="john.doe@example.com" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
            <input type="password" id="auth-password" value="User@12345" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <button type="submit" id="auth-submit-btn" class="w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all flex items-center justify-center space-x-2">
            <span>${mode === 'login' ? 'Sign In' : 'Register Account'}</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="mt-4 text-center text-xs text-slate-500">
          ${mode === 'login' ? `
            <span>Don't have an account?</span>
            <button id="toggle-auth-mode-btn" class="font-bold text-blue-600 hover:text-blue-700 ml-1">Sign Up Free</button>
          ` : `
            <span>Already have an account?</span>
            <button id="toggle-auth-mode-btn" class="font-bold text-blue-600 hover:text-blue-700 ml-1">Sign In</button>
          `}
        </div>

      </div>
    </div>
  `;
}

