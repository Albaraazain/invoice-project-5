import { gsap } from "gsap";
import ProgressBar from "progressbar.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";

export class SystemSizing {
  constructor(billData) {
    this.billData = billData;
    this.charts = {};
    this.progressBar = null;
    this.countUps = {};
  }

  cleanup() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.charts = {};

    if (this.progressBar) {
      this.progressBar.destroy();
      this.progressBar = null;
    }

    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) countUp.reset();
    });
    this.countUps = {};
  }

  render(container) {
    this.cleanup();
  
    container.innerHTML = `
      <div id="system-sizing" class="w-full h-full overflow-y-auto px-4 py-6 space-y-4">
        <h2 class="text-2xl font-bold text-gray-800">Solar System Dashboard</h2>
        
        <!-- Top Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.renderSystemSizeCard()}
          ${this.renderEstimatedCostCard()}
          ${this.renderPaybackPeriodCard()}
        </div>

        <!-- Energy Production Section -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Energy Production</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            ${this.renderEnergyProductionStat("Daily", "daily-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Monthly", "monthly-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Annual", "annual-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Coverage", "coverage-percentage-value", "%")}
          </div>
          <div class="h-64 md:h-80">
            <canvas id="energy-production-chart"></canvas>
          </div>
        </div>

        <!-- System Details Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          ${this.renderSystemDetailsCards()}
        </div>
      </div>
    `;

    this.attachStyles();
    this.initializeComponents();
    this.startAnimations();
  }

  renderSystemSizeCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">System Size</h3>
        <div class="flex items-center justify-between">
          <div class="w-16 h-16" id="system-size-progress"></div>
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-900">
              <span id="system-size-value">0</span>
            </p>
            <p class="text-sm text-gray-500">kW</p>
          </div>
        </div>
      </div>
    `;
  }

  renderEstimatedCostCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Estimated Cost</h3>
        <div class="flex justify-between items-start mb-4">
          <p class="text-2xl font-bold text-gray-900">$<span id="estimated-cost-value">0</span></p>
          <div class="text-sm">
            <p class="text-gray-600">Before incentives</p>
            <p class="text-green-600 font-medium">-$${this.calculateIncentives()} in incentives</p>
          </div>
        </div>
        <div class="h-32">
          <canvas id="cost-breakdown-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderPaybackPeriodCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Payback Period</h3>
        <div class="flex justify-between items-start mb-4">
          <p class="text-2xl font-bold text-gray-900"><span id="payback-period-value">0</span> years</p>
          <div class="text-sm">
            <p class="text-gray-600">Annual Savings</p>
            <p class="text-green-600 font-medium">$<span id="annual-savings-value">0</span></p>
          </div>
        </div>
        <div class="h-32">
          <canvas id="payback-period-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderSystemDetailsCards() {
    const cards = [
      { title: "Number of Panels", id: "number-of-panels-value", unit: "", icon: "solar-panel" },
      { title: "Panel Wattage", id: "panel-wattage-value", unit: "W", icon: "lightning-bolt" },
      { title: "CO2 Offset", id: "co2-offset-value", unit: "tons/year", icon: "leaf" },
      { title: "Roof Area", id: "roof-area-value", unit: "sq ft", icon: "home" },
      { title: "Total Savings", id: "total-savings-value", unit: "$/25yr", icon: "piggy-bank" },
      { title: "Warranty", id: "warranty-period", unit: "years", icon: "shield-check", value: "25" }
    ];

    return cards.map(card => this.renderDetailCard(card)).join('');
  }

  renderDetailCard({ title, id, unit, icon, value }) {
    return `
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <div class="flex items-start gap-3">
          ${this.getIcon(icon)}
          <div>
            <p class="text-sm text-gray-600">${title}</p>
            <p class="text-lg font-semibold text-gray-900">
              <span id="${id}">${value || '0'}</span> ${unit}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderEnergyProductionStat(label, id, unit) {
    return `
      <div class="bg-gray-50 rounded p-3">
        <p class="text-sm text-gray-600">${label}</p>
        <p class="text-lg font-semibold text-gray-900">
          <span id="${id}">0</span> ${unit}
        </p>
      </div>
    `;
  }

  initializeComponents() {
    this.initSystemSizeProgress();
    this.initializeCharts();
    this.initCountUps();
  }

  initSystemSizeProgress() {
    const progressContainer = document.getElementById("system-size-progress");
    if (!progressContainer) return;

    this.progressBar = new ProgressBar.Circle(progressContainer, {
      color: '#3B82F6',
      trailColor: '#E5E7EB',
      trailWidth: 4,
      duration: 2000,
      easing: 'easeInOut',
      strokeWidth: 8,
      from: { color: '#93C5FD', width: 4 },
      to: { color: '#3B82F6', width: 8 },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
      }
    });
  }

  getBaseChartOptions() {
    const isMobile = window.innerWidth < 768;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#111827',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: isMobile ? 6 : 8,
          bodyFont: {
            size: isMobile ? 11 : 13
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      }
    };
  }


  
  getIcon(name) {
    // Icon SVGs implementation
    const icons = {
      'solar-panel': `<svg class="w-6 h-6 text-blue-500" ...></svg>`,
      'lightning-bolt': `<svg class="w-6 h-6 text-yellow-500" ...></svg>`,
      'leaf': `<svg class="w-6 h-6 text-green-500" ...></svg>`,
      'home': `<svg class="w-6 h-6 text-gray-500" ...></svg>`,
      'piggy-bank': `<svg class="w-6 h-6 text-green-500" ...></svg>`,
      'shield-check': `<svg class="w-6 h-6 text-blue-500" ...></svg>`
    };
    return icons[name] || '';
  }

  startAnimations() {
    // Initialize GSAP timeline for card animations
    const cards = document.querySelectorAll('#system-sizing > div');
    
    gsap.fromTo(cards, 
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          // Start other animations after cards are visible
          this.startCountUps();
          if (this.progressBar) {
            this.progressBar.animate(0.75); // Example value
          }
        }
      }
    );
  }

  attachStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Add any custom styles we need */
      #system-sizing {
        scrollbar-width: thin;
        scrollbar-color: rgba(0,0,0,0.2) transparent;
      }

      #system-sizing::-webkit-scrollbar {
        width: 6px;
      }

      #system-sizing::-webkit-scrollbar-track {
        background: transparent;
      }

      #system-sizing::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.2);
        border-radius: 3px;
      }

      @media (max-width: 640px) {
        #system-sizing .text-2xl {
          font-size: 1.25rem;
        }
        #system-sizing .text-lg {
          font-size: 1rem;
        }
        #system-sizing .p-4 {
          padding: 0.75rem;
        }
        #system-sizing .gap-4 {
          gap: 0.75rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Utility methods
  calculateIncentives() {
    const federalTaxCredit = this.billData.estimatedSystemCost * 0.3;
    const stateTaxCredit = this.billData.estimatedSystemCost * 0.1;
    return (federalTaxCredit + stateTaxCredit).toFixed(0);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}