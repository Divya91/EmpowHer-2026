export function renderFooter(): string {
  return `
    <footer class="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <svg class="w-4 h-4 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span class="text-base font-extrabold text-white tracking-wider">SKYROUTE</span>
            </div>
            <p class="text-slate-400 text-[11px] leading-relaxed">
              Enterprise flight booking and reservation platform built on modern Angular 21 frontend and Java Spring Boot RESTful microservices.
            </p>
            <p class="text-[10px] text-sky-400 font-mono">IATA Certified OTA Platform</p>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Popular Hubs</h4>
            <ul class="space-y-2 text-[11px]">
              <li><a href="#" class="hover:text-white transition-colors">Bengaluru (BLR) Flights</a></li>
              <li><a href="#" class="hover:text-white transition-colors">New Delhi (DEL) Flights</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Mumbai (BOM) Flights</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Dubai (DXB) Non-Stop</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Singapore (SIN) Direct</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Policies & Guarantees</h4>
            <ul class="space-y-2 text-[11px]">
              <li><a href="#" class="hover:text-white transition-colors">Instant Cancellation Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Automated Refund Settlement</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Baggage Guidelines</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Fare Class Rules</a></li>
            </ul>
          </div>

          

        </div>

        <div class="border-t border-slate-900 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SkyRoute Aviation Systems. All rights reserved.</p>
          <p>Fly Smarter. Travel Better.</p>
        </div>

      </div>
    </footer>
  `;
}
