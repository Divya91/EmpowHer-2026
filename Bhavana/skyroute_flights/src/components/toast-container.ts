import { ToastItem } from '../types';

export function renderToastContainer(toasts: ToastItem[] = []): string {
  if (toasts.length === 0) return '';

  const getToastBadge = (type: 'success' | 'info' | 'warning' | 'alert') => {
    switch (type) {
      case 'success':
        return `
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        `;
      case 'warning':
        return `
          <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        `;
      case 'alert':
        return `
          <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        `;
      case 'info':
      default:
        return `
          <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        `;
    }
  };

  const getToastBorderClass = (type: 'success' | 'info' | 'warning' | 'alert') => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 shadow-emerald-950/5';
      case 'warning':
        return 'border-amber-200 shadow-amber-950/5';
      case 'alert':
        return 'border-rose-200 shadow-rose-950/5';
      case 'info':
      default:
        return 'border-blue-200 shadow-blue-950/5';
    }
  };

  return `
    <div id="toast-notification-region" aria-live="polite" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      ${toasts.map(toast => `
        <div class="pointer-events-auto bg-white rounded-xl p-3.5 shadow-xl border ${getToastBorderClass(toast.type)} flex items-start space-x-3 animate-in slide-in-from-bottom-3 duration-200" role="alert">
          ${getToastBadge(toast.type)}

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h5 class="text-xs font-bold text-slate-900 truncate">${toast.title}</h5>
              <button class="toast-close-btn text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors" data-id="${toast.id}" title="Dismiss">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <p class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">${toast.message}</p>

            ${toast.pnr || toast.actionLabel ? `
              <div class="mt-2 flex items-center space-x-2 pt-1 border-t border-slate-100">
                ${toast.pnr ? `
                  <button class="toast-view-ticket-btn text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline" data-pnr="${toast.pnr}">
                    View PNR ${toast.pnr} →
                  </button>
                ` : ''}
                ${toast.actionLabel && toast.actionRoute ? `
                  <button class="toast-action-btn text-[10px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors" data-route="${toast.actionRoute}">
                    ${toast.actionLabel}
                  </button>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
