// src/components/BillReview/components/MetricsCard.js
import { html } from 'lit-html';

export function MetricsCard({ type, title, value, badge, progress, subtitle }) {
    return html`
        <div class="bg-white rounded-lg shadow-sm p-3 opacity-0 consumption-metric">
            <div class="flex items-center justify-between mb-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    ${type === 'bill' ? 
                        html`<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                        </svg>` :
                        html`<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>`
                    }
                </div>
                <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                    ${badge}
                </span>
            </div>
            <p class="text-xs text-gray-500 mb-1">${title}</p>
            <p class="text-lg font-bold text-gray-900">${value}</p>
            ${progress ? html`
                <div class="mt-2 h-1 bg-gray-100 rounded">
                    <div class="h-full bg-emerald-500 rounded" style="width: ${progress}%"></div>
                </div>
            ` : ''}
            ${subtitle ? html`
                <p class="text-xs text-gray-500 mt-2">${subtitle}</p>
            ` : ''}
        </div>
    `;
}