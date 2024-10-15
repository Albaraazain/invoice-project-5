// js/components/SystemSizing.js
import { saveBillData, getBillData } from '../store/solarSizingState.js';

export class SystemSizing {
    constructor(billData) {
        this.billData = billData;
        this.efficiency = 1; // Default efficiency factor
    }

    render(container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="bg-white rounded-lg shadow-sm p-6 space-y-8">
                    <h2 class="text-2xl font-semibold text-gray-800">Recommended Solar System</h2>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            ${this.renderSystemSizeCard()}
                            ${this.renderEstimatedCostCard()}
                            ${this.renderPaybackPeriodCard()}
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            ${this.renderEnergyProductionSection()}
                            ${this.renderSystemDetailsSection()}
                        </div>
                        ${this.renderEfficiencySlider()}
                        ${this.renderInfoNote()}
                    </div>
                    <button id="regenerate-quote" class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
                        Regenerate Quote
                    </button>
                </div>
            </div>
        `;
        this.attachEventListeners();
    }

    renderSystemSizeCard() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <span class="text-sm text-gray-500">System Size</span>
                <p class="text-lg font-semibold text-gray-800 mt-1">${this.billData.recommendedSystemSize} kW</p>
            </div>
        `;
    }

    renderEstimatedCostCard() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <span class="text-sm text-gray-500">Estimated Cost</span>
                <p class="text-lg font-semibold text-gray-800 mt-1">${this.formatCurrency(this.billData.estimatedSystemCost)}</p>
            </div>
        `;
    }

    renderPaybackPeriodCard() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <span class="text-sm text-gray-500">Payback Period</span>
                <p class="text-lg font-semibold text-gray-800 mt-1">${this.billData.estimatedPaybackPeriod} years</p>
            </div>
        `;
    }

    renderEnergyProductionSection() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">Energy Production</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Daily</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.estimatedDailyProduction} kWh</p>
                    </div>
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Monthly</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.estimatedMonthlyProduction} kWh</p>
                    </div>
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Annual</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.estimatedAnnualProduction} kWh</p>
                    </div>
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Coverage of Needs</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.coveragePercentage}%</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderSystemDetailsSection() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">System Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Number of Panels</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.numberOfPanels}</p>
                    </div>
                    <div class="p-2">
                        <span class="text-sm text-gray-500">Panel Wattage</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.billData.panelWattage} W</p>
                    </div>
                    <div class="p-2 col-span-2">
                        <span class="text-sm text-gray-500">Annual Savings</span>
                        <p class="text-base font-medium text-gray-800 mt-1">${this.formatCurrency(this.billData.estimatedAnnualSavings)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderEfficiencySlider() {
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <label for="efficiency-slider" class="block text-sm font-medium text-gray-700 mb-2">Adjust System Efficiency:</label>
                <div class="flex items-center space-x-4">
                    <input type="range" id="efficiency-slider" min="0.5" max="1.5" step="0.1" value="1" class="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer" aria-valuemin="0.5" aria-valuemax="1.5" aria-valuenow="1">
                    <span id="efficiency-value" class="text-sm font-medium text-gray-700">100%</span>
                </div>
            </div>
        `;
    }

    renderInfoNote() {
        return `
            <div class="bg-blue-50 rounded-lg p-4 text-sm text-gray-600">
                <p>
                    This recommendation is based on your average monthly consumption of
                    ${this.billData.averageMonthlyConsumption} kWh. Actual performance may
                    vary based on conditions.
                </p>
            </div>
        `;
    }

    attachEventListeners() {
        const regenerateBtn = document.getElementById("regenerate-quote");
        regenerateBtn.addEventListener("click", this.regenerateQuote.bind(this));

        const efficiencySlider = document.getElementById("efficiency-slider");
        efficiencySlider.addEventListener("input", this.updateEfficiency.bind(this));

        this.addKeyboardNavigation();
    }

    regenerateQuote() {
        console.log("Regenerating quote...");
        this.render(document.querySelector('.system-sizing-container'));
    }

    updateEfficiency(event) {
        this.efficiency = parseFloat(event.target.value);
        document.getElementById("efficiency-value").textContent = `${Math.round(this.efficiency * 100)}%`;
        this.updateCalculations();
    }

    updateCalculations() {
        // Update billData based on new efficiency
        this.billData.recommendedSystemSize *= this.efficiency;
        this.billData.estimatedSystemCost *= this.efficiency;
        this.billData.estimatedPaybackPeriod /= this.efficiency;
        this.billData.estimatedDailyProduction *= this.efficiency;
        this.billData.estimatedMonthlyProduction *= this.efficiency;
        this.billData.estimatedAnnualProduction *= this.efficiency;
        this.billData.coveragePercentage = Math.min(this.billData.coveragePercentage * this.efficiency, 100);
        this.billData.numberOfPanels = Math.ceil(this.billData.numberOfPanels * this.efficiency);
        this.billData.estimatedAnnualSavings *= this.efficiency;

        saveBillData(this.billData);
        this.render(document.querySelector('.system-sizing-container'));
    }

    addKeyboardNavigation() {
        const focusableElements = document.querySelectorAll('button, input, [tabindex="0"]');
        focusableElements.forEach((el, index) => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextElement = focusableElements[index + 1] || focusableElements[0];
                    nextElement.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevElement = focusableElements[index - 1] || focusableElements[focusableElements.length - 1];
                    prevElement.focus();
                }
            });
        });
    }

    formatCurrency(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    }
}