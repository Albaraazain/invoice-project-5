// src/components/BillReview/components/ConsumptionChart.js
import { html } from 'lit-html';

export function ConsumptionChart(trendData) {
    return html`
        <div class="bg-white rounded-lg shadow-sm p-4 opacity-0" id="consumption-card">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-gray-900">Consumption Analysis</h3>
                <div class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                    ${trendData.change}% vs last month
                </div>
            </div>
            <div class="relative h-[200px] sm:h-[250px] w-full">
                <canvas id="consumption-trend-chart"></canvas>
            </div>
        </div>
    `;
}