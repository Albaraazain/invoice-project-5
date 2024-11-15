import { gsap } from "gsap";
import { getBillData, getError } from "../store/solarSizingState.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";
import ProgressBar from "progressbar.js";

export class QuoteResultPage {
    constructor() {
        try {
            this.billData = getBillData();
            this.error = getError();
        } catch (error) {
            console.error("Error in QuoteResultPage constructor:", error);
            this.error = "Failed to load bill data. Please try again.";
        }
        this.charts = {};
        this.progressBars = {};
        this.countUps = {};
    }

    render() {
        const app = document.getElementById("app");
        app.innerHTML = `
            <div class="min-h-screen bg-slate-50 p-8">
                <!-- Header -->
                <div class="max-w-7xl mx-auto mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Your Solar System Quote</h1>
                    <p class="text-gray-600 mt-2">Based on your energy consumption analysis</p>
                </div>

                <!-- Main Grid -->
                <div class="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                    <!-- System Size Card - Span 4 columns -->
                    <div class="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Recommended System Size</p>
                                <h2 class="text-4xl font-bold text-gray-900 mt-1">
                                    <span id="system-size-value">0</span>
                                    <span class="text-xl font-normal text-gray-500">kW</span>
                                </h2>
                            </div>
                            <div class="bg-blue-50 p-3 rounded-xl">
                                <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div id="system-size-progress" class="h-2 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    <!-- Cost Card - Span 4 columns -->
                    <div class="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Total Investment</p>
                                <h2 class="text-4xl font-bold text-gray-900 mt-1">
                                    <span id="cost-value">0</span>
                                </h2>
                            </div>
                            <div class="bg-green-50 p-3 rounded-xl">
                                <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center justify-between text-sm">
                            <span class="text-gray-600">Federal Tax Credit</span>
                            <span class="text-green-600 font-medium">-30%</span>
                        </div>
                    </div>

                    <!-- Payback Period Card - Span 4 columns -->
                    <div class="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-gray-600 text-sm">Payback Period</p>
                                <h2 class="text-4xl font-bold text-gray-900 mt-1">
                                    <span id="payback-value">0</span>
                                    <span class="text-xl font-normal text-gray-500">years</span>
                                </h2>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-xl">
                                <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center justify-between text-sm">
                            <span class="text-gray-600">Annual Savings</span>
                            <span id="annual-savings-value" class="text-purple-600 font-medium">
                                0
                            </span>
                        </div>
                    </div>
                    <!-- Production Chart - Span 8 columns -->
                    <div class="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Energy Production</h3>
                        <canvas id="energy-production-chart" height="300"></canvas>
                    </div>

                    <!-- Statistics Grid - Span 4 columns -->
                    <div class="col-span-4 grid grid-cols-2 gap-4">
                        ${this.renderStatCards()}
                    </div>

                    <!-- CO2 Impact - Span 6 columns -->
                    <div class="col-span-6 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
                        <div class="grid grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-600 text-sm">CO2 Offset</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">
                                    <span id="co2-offset-value">0</span>
                                    <span class="text-lg font-normal text-gray-500">tons/year</span>
                                </p>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Equivalent to Trees Planted</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">
                                    <span id="trees-value">0</span>
                                    <span class="text-lg font-normal text-gray-500">trees</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- System Details - Span 6 columns -->
                    <div class="col-span-6 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">System Details</h3>
                        <div class="grid grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-600 text-sm">Number of Panels</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">
                                    <span id="panels-value">0</span>
                                    <span class="text-lg font-normal text-gray-500">units</span>
                                </p>
                            </div>
                            <div>
                                <p class="text-gray-600 text-sm">Required Roof Area</p>
                                <p class="text-3xl font-bold text-gray-900 mt-1">
                                    <span id="roof-area-value">0</span>
                                    <span class="text-lg font-normal text-gray-500">sq ft</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initializeComponents();
    }

    renderStatCards() {
        const stats = [
            {
                label: "Daily Production",
                value: this.billData.estimatedDailyProduction,
                unit: "kWh",
                bg: "bg-yellow-50",
                icon: "⚡️",
                id: "daily-production-value"
            },
            {
                label: "Monthly Production",
                value: this.billData.estimatedMonthlyProduction,
                unit: "kWh",
                bg: "bg-blue-50",
                icon: "📊",
                id: "monthly-production-value"
            },
            {
                label: "Coverage",
                value: this.billData.coveragePercentage,
                unit: "%",
                bg: "bg-green-50",
                icon: "🎯",
                id: "coverage-value"
            },
            {
                label: "Panel Efficiency",
                value: "21.5",
                unit: "%",
                bg: "bg-purple-50",
                icon: "⚙️",
                id: "efficiency-value"
            }
        ];

        return stats.map(stat => `
            <div class="bg-white rounded-xl p-4 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600 text-xs">${stat.label}</span>
                    <span class="${stat.bg} w-8 h-8 flex items-center justify-center rounded-lg text-sm">
                        ${stat.icon}
                    </span>
                </div>
                <p class="text-xl font-bold text-gray-900">
                    <span id="${stat.id}">0</span>
                    <span class="text-sm font-normal text-gray-500">${stat.unit}</span>
                </p>
            </div>
        `).join('');
    }
    initializeComponents() {
      this.initializeCountUps();
      this.initializeProgressBars();
      this.initializeCharts();
      this.startAnimations();
  }

  initializeCountUps() {
      const countUpOptions = {
          duration: 2.5,
          useEasing: true,
          useGrouping: true,
      };

      // System Size
      this.countUps.systemSize = new CountUp('system-size-value', 0, this.billData.recommendedSystemSize, 2, countUpOptions);

      // Cost
      this.countUps.cost = new CountUp('cost-value', 0, this.billData.estimatedSystemCost, 0, {
          ...countUpOptions,
          prefix: 'PKR ',
          formattingFn: (value) => {
              return new Intl.NumberFormat('en-PK', {
                  style: 'currency',
                  currency: 'PKR',
                  maximumFractionDigits: 0
              }).format(value);
          }
      });

      // Payback Period
      this.countUps.payback = new CountUp('payback-value', 0, this.billData.estimatedPaybackPeriod, 1, countUpOptions);

      // Annual Savings
      this.countUps.annualSavings = new CountUp('annual-savings-value', 0, this.billData.estimatedAnnualSavings, 0, {
          ...countUpOptions,
          prefix: 'PKR ',
          formattingFn: (value) => {
              return new Intl.NumberFormat('en-PK', {
                  style: 'currency',
                  currency: 'PKR',
                  maximumFractionDigits: 0
              }).format(value);
          }
      });

      // Production Stats
      this.countUps.dailyProduction = new CountUp('daily-production-value', 0, this.billData.estimatedDailyProduction, 1, countUpOptions);
      this.countUps.monthlyProduction = new CountUp('monthly-production-value', 0, this.billData.estimatedMonthlyProduction, 0, countUpOptions);
      this.countUps.coverage = new CountUp('coverage-value', 0, this.billData.coveragePercentage, 1, countUpOptions);
      this.countUps.efficiency = new CountUp('efficiency-value', 0, 21.5, 1, countUpOptions);

      // Environmental Impact
      const co2Offset = this.billData.estimatedAnnualProduction * 0.0007;
      this.countUps.co2Offset = new CountUp('co2-offset-value', 0, co2Offset, 1, countUpOptions);
      this.countUps.trees = new CountUp('trees-value', 0, Math.round(co2Offset * 40), 0, countUpOptions);

      // System Details
      this.countUps.panels = new CountUp('panels-value', 0, this.billData.numberOfPanels, 0, countUpOptions);
      this.countUps.roofArea = new CountUp('roof-area-value', 0, this.billData.numberOfPanels * 17.5, 0, countUpOptions);
  }

  initializeProgressBars() {
      // System Size Progress Bar
      this.progressBars.systemSize = new ProgressBar.Line('#system-size-progress', {
          color: '#3B82F6',
          trailColor: '#E5E7EB',
          trailWidth: 8,
          strokeWidth: 8,
          duration: 2000,
          easing: 'easeInOut',
          from: { color: '#93C5FD' },
          to: { color: '#3B82F6' },
          step: (state, bar) => {
              bar.path.setAttribute('stroke', state.color);
          }
      });
  }

  initializeCharts() {
      const ctx = document.getElementById('energy-production-chart');
      if (!ctx) return;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const baseProduction = this.billData.estimatedMonthlyProduction;

      const productionData = months.map(month => {
          const seasonalFactor = this.getSeasonalFactor(month);
          return baseProduction * seasonalFactor;
      });

      this.charts.production = new Chart(ctx, {
          type: 'line',
          data: {
              labels: months,
              datasets: [{
                  label: 'Estimated Production (kWh)',
                  data: productionData,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                  pointRadius: 4,
                  pointHoverRadius: 6
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      display: false
                  },
                  tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#1F2937',
                      bodyColor: '#4B5563',
                      borderColor: '#E5E7EB',
                      borderWidth: 1,
                      padding: 12,
                      displayColors: false,
                      callbacks: {
                          label: (context) => `${context.parsed.y.toLocaleString()} kWh`
                      }
                  }
              },
              scales: {
                  x: {
                      grid: {
                          display: false
                      }
                  },
                  y: {
                      beginAtZero: true,
                      grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                      }
                  }
              }
          }
      });
  }

  getSeasonalFactor(month) {
      const seasonalFactors = {
          'Dec': 0.7, 'Jan': 0.7, 'Feb': 0.8,
          'Mar': 0.9, 'Apr': 1.0, 'May': 1.1,
          'Jun': 1.2, 'Jul': 1.2, 'Aug': 1.1,
          'Sep': 1.0, 'Oct': 0.9, 'Nov': 0.8
      };
      return seasonalFactors[month];
  }

  startAnimations() {
      // Start all CountUp animations
      Object.values(this.countUps).forEach(countUp => {
          if (countUp && !countUp.error) {
              countUp.start();
          }
      });

      // Animate progress bars
      if (this.progressBars.systemSize) {
          this.progressBars.systemSize.animate(0.75); // Example progress value
      }

      // Add entrance animations with GSAP
      const cards = document.querySelectorAll('.rounded-2xl');
      gsap.fromTo(cards, 
          { 
              y: 20,
              opacity: 0
          },
          {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out"
          }
      );
  }

  cleanup() {
      // Cleanup charts
      Object.values(this.charts).forEach(chart => {
          if (chart) chart.destroy();
      });
      this.charts = {};

      // Cleanup progress bars
      Object.values(this.progressBars).forEach(progressBar => {
          if (progressBar) progressBar.destroy();
      });
      this.progressBars = {};

      // Reset CountUps
      Object.values(this.countUps).forEach(countUp => {
          if (countUp) countUp.reset();
      });
      this.countUps = {};
  }
}