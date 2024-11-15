// src/components/BillReview/components/Header.js
import { html } from 'lit-html';

export function Header() {
    return html`
        <div class="opacity-0" id="insights-header">
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 
                              flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h2 class="text-base sm:text-lg font-bold text-gray-900">Bill Analysis</h2>
                    <p class="text-xs sm:text-sm text-gray-500">Understanding your consumption</p>
                </div>
            </div>
        </div>
    `;
}