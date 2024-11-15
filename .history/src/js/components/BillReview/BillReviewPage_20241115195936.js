// src/js/components/BillReview/BillReviewPage.js
import { html, render } from 'lit-html';
import { getBillData } from '../../store/solarSizingState.js';

export class BillReviewPage {
    constructor() {
        try {
            this.billData = getBillData();
            console.log('BillReviewPage initialized with data:', this.billData);
            if (!this.billData) {
                console.error('No bill data available');
                window.router.push('/');
                return;
            }
        } catch (error) {
            console.error('Error initializing BillReviewPage:', error);
            window.router.push('/');
        }
    }

    render() {
        try {
            const app = document.getElementById('app');
            if (!app) {
                console.error('App container not found');
                return;
            }

            console.log('Rendering BillReviewPage with data:', this.billData);

            const template = html`
                <div class="min-h-screen bg-gray-50 p-4">
                    <div class="max-w-7xl mx-auto">
                        <!-- Back Button -->
                        <button 
                            @click=${() => window.router.push('/')}
                            class="mb-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Back
                        </button>

                        <!-- Main Content -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h1 class="text-2xl font-bold text-gray-900 mb-6">Bill Review</h1>
                            
                            <!-- Bill Information -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                ${this.renderConsumptionCard()}
                                ${this.renderSolarSystemCard()}
                            </div>

                            <!-- Charts Section -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                ${this.renderProductionChart()}
                                ${this.renderSavingsChart()}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            render(template, app);
            this.initializeCharts();
        } catch (error) {
            console.error('Error rendering BillReviewPage:', error);
        }
    }

    renderConsumptionCard() {
        return html`
            <div class="bg-gray-50 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Consumption Details</h2>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Units Consumed</span>
                        <span class="text-gray-900 font-medium">${this.billData.unitsConsumed} kWh</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Rate per Unit</span>
                        <span class="text-gray-900 font-medium">PKR ${this.billData.ratePerUnit}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Total Amount</span>
                        <span class="text-gray-900 font-medium">PKR ${this.billData.amount}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSolarSystemCard() {
        return html`
            <div class="bg-gray-50 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Solar System Details</h2>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Recommended Size</span>
                        <span class="text-gray-900 font-medium">${this.billData.recommendedSystemSize} kW</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Daily Production</span>
                        <span class="text-gray-900 font-medium">${this.billData.estimatedDailyProduction} kWh</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Annual Savings</span>
                        <span class="text-gray-900 font-medium">PKR ${this.billData.estimatedAnnualSavings}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductionChart() {
        return html`
            <div class="bg-gray-50 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Energy Production</h2>
                <div class="h-64">
                    <canvas id="production-chart"></canvas>
                </div>
            </div>
        `;
    }

    renderSavingsChart() {
        return html`
            <div class="bg-gray-50 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Savings Analysis</h2>
                <div class="h-64">
                    <canvas id="savings-chart"></canvas>
                </div>
            </div>
        `;
    }

    initializeCharts() {
        // Initialize Production Chart
        const productionCtx = document.getElementById('production-chart');
        if (productionCtx) {
            new Chart(productionCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Expected Production (kWh)',
                        data: this.generateMonthlyProduction(),
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }

        // Initialize Savings Chart
        const savingsCtx = document.getElementById('savings-chart');
        if (savingsCtx) {
            new Chart(savingsCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 12}, (_, i) => `Year ${i + 1}`),
                    datasets: [{
                        label: 'Cumulative Savings (PKR)',
                        data: this.generateSavingsProjection(),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
    }

    generateMonthlyProduction() {
        // Generate realistic monthly production data based on system size
        const baseProduction = this.billData.estimatedDailyProduction * 30;
        const seasonalFactors = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7];
        return seasonalFactors.map(factor => baseProduction * factor);
    }

    generateSavingsProjection() {
        // Generate 12-year savings projection
        const annualSavings = this.billData.estimatedAnnualSavings;
        return Array.from({length: 12}, (_, i) => annualSavings * (i + 1));
    }
}