import { ChatMessageDto } from '../types';

export function renderAiAssistantWidget(
  isOpen: boolean,
  messages: ChatMessageDto[] = []
): string {
  if (!isOpen) {
    return `
      <!-- Floating AI Trigger Circular Button (Top Right) -->
      <button id="ai-floating-trigger-btn" title="SkyRoute AI Copilot" class="fixed top-20 right-4 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/95 backdrop-blur-sm text-white shadow-md hover:bg-slate-800 hover:border-blue-500 active:scale-95 transition-all flex items-center justify-center border border-slate-700 group">
        <svg class="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-slate-900"></span>
      </button>
    `;
  }

  return `
    <!-- Expanded Floating AI Assistant Chat Drawer (Top Right) -->
    <div id="ai-chat-drawer" class="fixed top-20 right-4 sm:right-6 z-50 w-[360px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-top-3 duration-200">
      
      <!-- Drawer Header -->
      <div class="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h3 class="text-xs font-bold flex items-center space-x-1.5 text-white">
              <span>SkyRoute AI Copilot</span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </h3>
            <p class="text-[9px] text-slate-400">Live Search & Policy Copilot</p>
          </div>
        </div>

        <button id="close-ai-drawer-btn" class="w-6 h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Messages Stream Container -->
      <div id="ai-messages-container" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
        
        <!-- Welcome Greeting -->
        <div class="flex items-start space-x-2">
          <div class="w-6 h-6 rounded-md bg-slate-900 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
            AI
          </div>
          <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-slate-800 max-w-[85%] space-y-1.5">
            <p>👋 Hello! I can assist you with finding commercial flights, seat configurations, cancellation policies, or live fare estimates.</p>
            <p class="text-[10px] text-slate-500 font-medium">Try asking: <em>"Find flights from BLR to DEL"</em> or <em>"Cancellation refund policy"</em></p>
          </div>
        </div>

        <!-- Rendered conversation -->
        ${messages.map(m => `
          <div class="flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
            ${m.sender === 'assistant' ? `
              <div class="w-6 h-6 rounded-md bg-slate-900 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                AI
              </div>
            ` : ''}
            <div class="${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-lg p-2.5 shadow-sm max-w-[80%]'
                : 'bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-slate-800 max-w-[88%] space-y-2'
            }">
              <p class="whitespace-pre-line leading-relaxed">${m.content}</p>

              ${m.toolCalls && m.toolCalls.length > 0 ? `
                <div class="p-2 bg-slate-900 text-blue-300 rounded font-mono text-[10px] space-y-0.5">
                  <span class="text-slate-400 block text-[9px]">⚡ Invoked Tool:</span>
                  ${m.toolCalls.map(t => `<div>> ${t}</div>`).join('')}
                </div>
              ` : ''}

              ${m.suggestedFlights && m.suggestedFlights.length > 0 ? `
                <div class="space-y-1.5 pt-1">
                  ${m.suggestedFlights.map(sf => `
                    <div class="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px]">
                      <div>
                        <span class="font-bold text-slate-900 block">${sf.flightNumber} • ${sf.airline}</span>
                        <span class="text-slate-500 text-[10px]">${sf.time} (${sf.duration})</span>
                      </div>
                      <span class="font-bold text-blue-600">${sf.price}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}

      </div>

      <!-- Quick Chips Bar -->
      <div class="px-3 py-2 bg-white border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <button class="ai-quick-chip whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
          BLR to DEL Flights
        </button>
        <button class="ai-quick-chip whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
          Baggage Limit
        </button>
        <button class="ai-quick-chip whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
          Cancellation Policy
        </button>
      </div>

      <!-- Chat Input Form -->
      <form id="ai-chat-form" class="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input type="text" id="ai-chat-input" placeholder="Type a message or flight request..." class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <button type="submit" class="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95">
          <svg class="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
        </button>
      </form>

    </div>
  `;
}

