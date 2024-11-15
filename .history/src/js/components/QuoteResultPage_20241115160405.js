import { gsap } from "gsap";
import { getBillData, getError } from "../store/solarSizingState.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";
import ProgressBar from "progressbar.js";

// QuoteResultPage.js
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
    return `
        <div class="relative max-w-[1136px] mx-auto p-8 min-h-[836px]">
            <div class="flex gap-6">
                <!-- Main Content Area -->
                <div class="flex-1 flex flex-col gap-6">
                    <!-- Top Row -->
                    <div class="flex gap-6">
                        <!-- System Size & Cost Overview -->
                        <div class="flex flex-col gap-6 w-[325px]">
                            <div class="bg-white rounded-2xl p-6 h-[183px] flex flex-col justify-between">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-semibold">System Size</h3>
                                    <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div id="system-size-progress"></div>
                            </div>
                            
                            <!-- Quick Stats Card -->
                            <div class="bg-white rounded-2xl p-6">
                                ${this.renderQuickStats()}
                            </div>
                        </div>
                        
                        <!-- Energy Production Chart -->
                        <div class="flex-1 bg-white rounded-2xl p-6">
                            <h3 class="text-lg font-semibold mb-4">Energy Production</h3>
                            <div class="h-[calc(100%-2rem)]">
                                <canvas id="production-chart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Row -->
                    <div class="flex gap-6">
                        <!-- Savings Timeline Chart -->
                        <div class="flex-[3] bg-white rounded-2xl p-6">
                            <h3 class="text-lg font-semibold mb-4">Savings Timeline</h3>
                            <div class="h-[calc(100%-2rem)]">
                                <canvas id="savings-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Environmental Impact -->
                        <div class="flex-1 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-2xl p-6 text-white">
                            ${this.renderEnvironmentalImpact()}
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="w-[324px] flex flex-col gap-6">
                    <!-- Monthly Production Analysis -->
                    <div class="h-[384px] bg-white rounded-2xl p-6">
                        <h3 class="text-lg font-semibold mb-4">Monthly Production</h3>
                        <div class="h-[calc(100%-2rem)]">
                            <canvas id="monthly-production-chart"></canvas>
                        </div>
                    </div>
                    
                    <!-- Cost Analysis -->
                    <div class="flex-1 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl p-6 text-white">
                        ${this.renderCostAnalysis()}
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  renderQuickStats() {
    return `
        <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
                <div class="text-3xl font-bold text-emerald-600" id="daily-production">0</div>
                <div class="text-sm text-gray-600">Daily kWh</div>
            </div>
            <div class="text-center">
                <div class="text-3xl font-bold text-blue-600" id="monthly-savings">0</div>
                <div class="text-sm text-gray-600">Monthly PKR</div>
            </div>
        </div>
    `;
  }

  renderEnvironmentalImpact() {
    return `
        <div class="h-full flex flex-col">
            <h3 class="text-lg font-semibold mb-4">Environmental Impact</h3>
            <div class="flex-1 flex flex-col justify-center">
                <div class="mb-6">
                    <div class="text-sm opacity-80 mb-1">CO₂ Offset</div>
                    <div class="text-3xl font-bold" id="co2-value">0</div>
                    <div class="w-full bg-white/20 h-2 rounded-full mt-2">
                        <div class="bg-white h-full rounded-full" style="width: 75%"></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-sm opacity-80">Trees Equivalent</div>
                        <div class="text-2xl font-bold" id="trees-value">0</div>
                    </div>
                    <div>
                        <div class="text-sm opacity-80">Energy for Homes</div>
                        <div class="text-2xl font-bold" id="homes-value">0</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  renderCostAnalysis() {
    return `
        <div class="h-full flex flex-col">
            <h3 class="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div class="flex-1 flex flex-col justify-center">
                <div class="text-4xl font-bold mb-2" id="total-cost">0</div>
                <div class="text-sm opacity-80">Total Investment</div>
                <div class="mt-4 text-sm bg-white/20 rounded-lg px-3 py-2 inline-flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    30% Tax Credit Available
                </div>
            </div>
        </div>
    `;
  }

  renderSystemSizeCard() {
    return `
        <div class="h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">System Size</h3>
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
            <div class="flex-1 flex flex-col justify-center">
                <div class="text-3xl font-bold text-gray-900 mb-2">
                    <span id="system-size-value">0</span>
                    <span class="text-lg text-gray-500">kW</span>
                </div>
                <div class="text-sm text-gray-500">Recommended capacity</div>
            </div>
            <div id="system-size-progress" class="mt-4 h-2"></div>
        </div>
    `;
  }

  renderCostCard() {
    return `
        <div class="flex items-center justify-between h-full">
            <div>
                <h3 class="text-lg font-semibold mb-2">Total Investment</h3>
                <div class="text-3xl font-bold text-gray-900">
                    <span class="text-sm text-gray-500">PKR</span>
                    <span id="total-cost-value">0</span>
                </div>
                <div class="mt-2 inline-flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    30% Tax Credit Available
                </div>
            </div>
            <div class="w-24 h-24" id="cost-progress"></div>
        </div>
    `;
  }
  initializeComponents() {
    this.initCharts();
    this.initCounters();
    this.initProgressBars();
    this.startAnimations();
  }

  initCharts() {
    this.initProductionChart();
    this.initSavingsChart();
  }

  initCounters() {
    const counterData = [
      {
        id: "system-size-value",
        value: this.billData.recommendedSystemSize,
        decimals: 2,
      },
      {
        id: "total-cost-value",
        value: this.billData.estimatedSystemCost,
        prefix: "PKR ",
        separator: ",",
      },
      {
        id: "payback-period-value",
        value: this.billData.estimatedPaybackPeriod,
        decimals: 1,
      },
    ];

    counterData.forEach((counter) => {
      const element = document.getElementById(counter.id);
      if (!element) return;

      this.countUps[counter.id] = new CountUp(counter.id, counter.value, {
        startVal: 0,
        duration: 2,
        useEasing: true,
        useGrouping: true,
        separator: counter.separator || "",
        decimal: ".",
        prefix: counter.prefix || "",
        decimals: counter.decimals || 0,
      });

      if (!this.countUps[counter.id].error) {
        this.countUps[counter.id].start();
      }
    });
  }

  initProgressBars() {
    const progressBarElements = document.querySelectorAll('[id$="-progress"]');
    progressBarElements.forEach((element) => {
      if (!element) return;

      this.progressBars[element.id] = new ProgressBar.Line(element, {
        strokeWidth: 4,
        easing: "easeInOut",
        duration: 1400,
        color: "#3b82f6",
        trailColor: "#e5e7eb",
        trailWidth: 4,
        svgStyle: { width: "100%", height: "100%" },
      });

      this.progressBars[element.id].animate(0.75);
    });
  }

  startAnimations() {
    gsap.fromTo(
      ".bg-white",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }

  cleanup() {
    // Destroy all charts
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });

    // Destroy all progress bars
    Object.values(this.progressBars).forEach((progressBar) => {
      if (progressBar) progressBar.destroy();
    });

    // Reset all counters
    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) countUp.reset();
    });

    // Kill all GSAP animations
    gsap.killTweensOf("*");

    // Clear all objects
    this.charts = {};
    this.progressBars = {};
    this.countUps = {};
  }

  renderDetailsSections() {
    return `
        <!-- System Specifications -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">System Specifications</h3>
            <div class="grid grid-cols-2 gap-4">
                ${this.renderSpecificationDetails()}
            </div>
        </div>

        <!-- Environmental Impact -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Environmental Impact</h3>
            <div class="space-y-6">
                ${this.renderEnvironmentalImpact()}
            </div>
        </div>
    `;
  }
  attachBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .bento-card {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
        }

        .bento-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            background: linear-gradient(
                120deg,
                transparent 20%,
                rgba(255, 255, 255, 0.1) 28%,
                transparent 40%
            );
            transform: translateX(-100%);
            transition: transform 0.7s ease;
        }

        .bento-card:hover::after {
            transform: translateX(100%);
        }

        .stat-value {
            transition: color 0.3s ease;
        }

        .bento-card:hover .stat-value {
            color: #3b82f6;
        }

        .chart-container {
            position: relative;
        }

        .chart-container canvas {
            transition: transform 0.3s ease;
        }

        .chart-container:hover canvas {
            transform: scale(1.02);
        }

        .environmental-impact-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }

        .savings-card {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }
    `;
    document.head.appendChild(style);
  }

  renderSpecificationDetails() {
    const specs = [
      {
        label: "Number of Panels",
        value: this.billData.numberOfPanels,
        unit: "panels",
        icon: "solar_power",
      },
      {
        label: "Panel Wattage",
        value: this.billData.panelWattage,
        unit: "W",
        icon: "bolt",
      },
      {
        label: "Required Roof Area",
        value: Math.ceil(this.billData.numberOfPanels * 17.5),
        unit: "sq ft",
        icon: "home",
      },
      {
        label: "Annual Production",
        value: Math.round(this.billData.estimatedAnnualProduction),
        unit: "kWh",
        icon: "power",
      },
    ];

    return specs
      .map(
        (spec) => `
        <div class="relative flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex-shrink-0">
                <span class="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                    <span class="material-icons text-xl">${spec.icon}</span>
                </span>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">${spec.label}</p>
                <p class="mt-1 text-sm text-gray-500">
                    <span class="font-semibold">${spec.value.toLocaleString()}</span> ${
          spec.unit
        }
                </p>
            </div>
        </div>
    `
      )
      .join("");
  }

  renderEnvironmentalImpact() {
    return `
        <div class="h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Environmental Impact</h3>
                <span class="text-2xl">🌍</span>
            </div>
            
            <div class="flex-1 space-y-4">
                <div class="relative">
                    
                    <div class="w-full h-2 bg-green-100 rounded-full">
                        <div id="co2-progress-bar" 
                             class="h-2 bg-green-500 rounded-full transition-all duration-1000"
                             style="width: 0%">
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-2xl mb-1">🌳</div>
                        <div class="text-sm text-gray-600">Equal to</div>
                        <div class="text-lg font-semibold text-gray-900">
                            <span id="trees-value">0</span> trees
                        </div>
                    </div>
                    <div class="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-2xl mb-1">⚡</div>
                        <div class="text-sm text-gray-600">Energy for</div>
                        <div class="text-lg font-semibold text-gray-900">
                            <span id="homes-value">0</span> homes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  renderQuickStats() {
    const stats = [
      {
        label: "Daily Production",
        value: this.billData.estimatedDailyProduction,
        unit: "kWh",
        icon: "⚡",
        id: "daily-production",
      },
      {
        label: "Monthly Savings",
        value: this.billData.estimatedAnnualSavings / 12,
        unit: "PKR",
        icon: "💰",
        id: "monthly-savings",
      },
      {
        label: "Payback Period",
        value: this.billData.estimatedPaybackPeriod,
        unit: "years",
        icon: "⏱️",
        id: "payback-period",
      },
    ];

    return `
        <div class="grid grid-cols-3 gap-4 h-full">
            ${stats
              .map(
                (stat) => `
                <div class="flex flex-col justify-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div class="text-2xl mb-2">${stat.icon}</div>
                    <div class="text-sm text-gray-600">${stat.label}</div>
                    <div class="text-lg font-semibold text-gray-900 mt-1">
                        <span id="${stat.id}-value">0</span>
                        <span class="text-sm text-gray-500">${stat.unit}</span>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  }

  renderSystemDetails() {
    return `
        <div class="h-full flex flex-col">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">System Details</h3>
            <div class="grid grid-cols-2 gap-3 flex-1">
                <div class="bg-white/50 rounded-lg p-3">
                    <div class="text-sm text-gray-600">Panels</div>
                    <div class="text-lg font-semibold text-gray-900">
                        <span id="panels-value">0</span>
                    </div>
                </div>
                <div class="bg-white/50 rounded-lg p-3">
                    <div class="text-sm text-gray-600">Roof Area</div>
                    <div class="text-lg font-semibold text-gray-900">
                        <span id="area-value">0</span> sq ft
                    </div>
                </div>
                <div class="bg-white/50 rounded-lg p-3">
                    <div class="text-sm text-gray-600">Warranty</div>
                    <div class="text-lg font-semibold text-gray-900">25 years</div>
                </div>
                <div class="bg-white/50 rounded-lg p-3">
                    <div class="text-sm text-gray-600">Efficiency</div>
                    <div class="text-lg font-semibold text-gray-900">21.5%</div>
                </div>
            </div>
        </div>
    `;
  }
  renderChartSections() {
    return `
        <!-- Energy Production Chart -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Energy Production Forecast</h3>
            <div class="h-[400px] relative">
                <canvas id="production-chart"></canvas>
            </div>
        </div>

        <!-- Cost Savings Chart -->
        <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Cost Savings Analysis</h3>
            <div class="h-[400px] relative">
                <canvas id="savings-chart"></canvas>
            </div>
        </div>
    `;
  }

  renderKeyMetrics() {
    const metrics = [
      {
        title: "Recommended System Size",
        value: this.billData.recommendedSystemSize,
        unit: "kW",
        icon: "⚡",
        color: "blue",
        id: "system-size",
      },
      {
        title: "Total Investment",
        value: this.billData.estimatedSystemCost,
        prefix: "PKR",
        icon: "💰",
        color: "green",
        id: "total-cost",
      },
      {
        title: "Payback Period",
        value: this.billData.estimatedPaybackPeriod,
        unit: "years",
        icon: "⏱️",
        color: "purple",
        id: "payback-period",
      },
    ];

    return metrics
      .map(
        (metric) => `
        <div class="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-gray-500">${
                      metric.title
                    }</p>
                    <div class="mt-1 flex items-baseline">
                        ${
                          metric.prefix
                            ? `<span class="text-sm text-gray-600 mr-1">${metric.prefix}</span>`
                            : ""
                        }
                        <span class="text-2xl font-semibold text-gray-900" id="${
                          metric.id
                        }-value">0</span>
                        ${
                          metric.unit
                            ? `<span class="ml-1 text-sm text-gray-600">${metric.unit}</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="p-2 bg-${metric.color}-100 rounded-lg">
                    <span class="text-xl">${metric.icon}</span>
                </div>
            </div>
            <div class="mt-4" id="${metric.id}-progress"></div>
        </div>
    `
      )
      .join("");
  }

  renderStatCards() {
    const stats = [
      {
        label: "Daily Production",
        value: this.billData.estimatedDailyProduction,
        unit: "kWh",
        bg: "bg-yellow-50",
        icon: "⚡️",
        id: "daily-production-value",
      },
      {
        label: "Monthly Production",
        value: this.billData.estimatedMonthlyProduction,
        unit: "kWh",
        bg: "bg-blue-50",
        icon: "📊",
        id: "monthly-production-value",
      },
      {
        label: "Coverage",
        value: this.billData.coveragePercentage,
        unit: "%",
        bg: "bg-green-50",
        icon: "🎯",
        id: "coverage-value",
      },
      {
        label: "Panel Efficiency",
        value: "21.5",
        unit: "%",
        bg: "bg-purple-50",
        icon: "⚙️",
        id: "efficiency-value",
      },
    ];

    return stats
      .map(
        (stat) => `
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
        `
      )
      .join("");
  }

  initializeProgressBars() {
    // System Size Progress Bar
    this.progressBars.systemSize = new ProgressBar.Line(
      "#system-size-progress",
      {
        color: "#3B82F6",
        trailColor: "#E5E7EB",
        trailWidth: 8,
        strokeWidth: 8,
        duration: 2000,
        easing: "easeInOut",
        from: { color: "#93C5FD" },
        to: { color: "#3B82F6" },
        step: (state, bar) => {
          bar.path.setAttribute("stroke", state.color);
        },
      }
    );
  }

  initializeCharts() {
    this.initProductionChart();
    this.initSavingsChart();
  }

  initSavingsChart() {
    const ctx = document.getElementById("savings-chart");
    if (!ctx) return;

    const years = 25; // Standard solar panel warranty period
    const yearlyLabels = Array.from(
      { length: years + 1 },
      (_, i) => `Year ${i}`
    );
    const systemCost = this.billData.estimatedSystemCost;
    const yearlySavings = this.billData.estimatedAnnualSavings;

    const cumulativeSavings = yearlyLabels.map((_, index) =>
      Math.round(yearlySavings * index)
    );

    const investmentLine = yearlyLabels.map(() => systemCost);

    this.charts.savings = new Chart(ctx, {
      type: "line",
      data: {
        labels: yearlyLabels,
        datasets: [
          {
            label: "Cumulative Savings",
            data: cumulativeSavings,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Initial Investment",
            data: investmentLine,
            borderColor: "rgb(239, 68, 68)",
            borderDash: [5, 5],
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return `${
                  context.dataset.label
                }: PKR ${context.parsed.y.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "PKR " + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  initProductionChart() {
    const ctx = document.getElementById("production-chart");
    if (!ctx) return;

    // Generate monthly data
    const monthlyData = this.generateMonthlyProductionData();

    // Create chart with proper configuration
    this.charts.production = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Solar Production",
            data: monthlyData.production,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Energy Consumption",
            data: monthlyData.consumption,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.parsed.y || 0;
                return `${label}: ${value.toLocaleString()} kWh`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              font: {
                size: 12,
              },
              callback: function (value) {
                return value.toLocaleString() + " kWh";
              },
            },
          },
        },
      },
    });
  }

  generateMonthlyProductionData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const seasonalFactors = {
      winter: 0.7,
      spring: 0.9,
      summer: 1.2,
      fall: 0.8,
    };

    const monthlyProduction = months.map((month, index) => {
      let factor;
      if (index < 2 || index === 11) factor = seasonalFactors.winter;
      else if (index < 5) factor = seasonalFactors.spring;
      else if (index < 8) factor = seasonalFactors.summer;
      else factor = seasonalFactors.fall;

      // Base production from system size
      const baseProduction = this.billData.recommendedSystemSize * 30 * 4; // kW * days * peak hours
      return Math.round(baseProduction * factor);
    });

    const monthlyConsumption = months.map(() =>
      Math.round(this.billData.unitsConsumed * (0.9 + Math.random() * 0.2))
    );

    return {
      labels: months,
      production: monthlyProduction,
      consumption: monthlyConsumption,
    };
  }

  getSeasonalFactor(month) {
    const seasonalFactors = {
      Dec: 0.7,
      Jan: 0.7,
      Feb: 0.8,
      Mar: 0.9,
      Apr: 1.0,
      May: 1.1,
      Jun: 1.2,
      Jul: 1.2,
      Aug: 1.1,
      Sep: 1.0,
      Oct: 0.9,
      Nov: 0.8,
    };
    return seasonalFactors[month];
  }

  initializeAnimations() {
    // Initial fade in animation for all cards
    gsap.from(".bento-card", {
      duration: 0.8,
      opacity: 0,
      y: 30,
      stagger: {
        amount: 0.8,
        from: "random",
      },
      ease: "power3.out",
    });

    // Animate progress bars
    this.animateProgressBars();

    // Start counters with slight delays
    this.animateCounters();

    // Add hover animations
    this.initializeHoverEffects();
  }

  animateProgressBars() {
    // CO2 Progress animation
    gsap.to("#co2-progress-bar", {
      width: "75%",
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out",
    });

    // System size progress animation
    if (this.progressBars["system-size-progress"]) {
      this.progressBars["system-size-progress"].animate(0.8, {
        duration: 1500,
        easing: "easeInOut",
      });
    }
  }

  animateCounters() {
    Object.values(this.countUps).forEach((counter, index) => {
      if (counter && !counter.error) {
        setTimeout(() => {
          counter.start();
        }, index * 200); // Staggered start
      }
    });
  }

  initializeHoverEffects() {
    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card.querySelectorAll(".stat-value"), {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card.querySelectorAll(".stat-value"), {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }

  initializeCounters() {
    const counters = [
      {
        id: "system-size-value",
        value: this.billData.recommendedSystemSize,
        decimals: 2,
      },
      {
        id: "total-cost-value",
        value: this.billData.estimatedSystemCost,
        prefix: "PKR ",
        separator: ",",
      },
      {
        id: "payback-period-value",
        value: this.billData.estimatedPaybackPeriod,
        decimals: 1,
      },
    ];

    counters.forEach((counter) => {
      const element = document.getElementById(counter.id);
      if (!element) return;

      const options = {
        startVal: 0,
        duration: 2,
        useEasing: true,
        useGrouping: true,
        separator: counter.separator || "",
        decimal: ".",
        prefix: counter.prefix || "",
        decimals: counter.decimals || 0,
      };

      const countUp = new CountUp(counter.id, counter.value, options);
      if (!countUp.error) {
        countUp.start();
      }
    });
  }

  cleanup() {
    // Destroy all charts
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.charts = {};

    // Kill all GSAP animations
    gsap.killTweensOf("*");

    // Remove any event listeners if needed
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    // Debounced resize handler for chart responsiveness
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      Object.values(this.charts).forEach((chart) => {
        if (chart) chart.resize();
      });
    }, 250);
  };

  renderCostCard() {
    return `
        <div class="flex items-center justify-between h-full">
            <div>
                <h3 class="text-lg font-semibold mb-2">Total Investment</h3>
                <div class="text-3xl font-bold text-gray-900">
                    <span class="text-sm text-gray-500">PKR</span>
                    <span id="total-cost-value" class="stat-value">0</span>
                </div>
                <div class="mt-2 inline-flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    30% Tax Credit Available
                </div>
            </div>
            <div class="w-24 h-24" id="cost-progress"></div>
        </div>
    `;
  }

  renderEnvironmentalImpact() {
    const co2Offset = this.calculateCO2Offset();
    const treesEquivalent = Math.round(co2Offset * 40);

    return `
        <div class="h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Environmental Impact</h3>
                <span class="text-2xl">🌍</span>
            </div>
            
            <div class="flex-1 space-y-4">
                <div class="relative">
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700">CO₂ Offset</span>
                        <span class="text-sm font-medium text-gray-700" id="co2-value">
                            ${co2Offset.toFixed(1)} tons/year
                        </span>
                    </div>
                    <div class="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                        <div id="co2-progress-bar" 
                             class="h-2 bg-green-500 rounded-full transition-all duration-1000"
                             style="width: 0%">
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-2xl mb-1">🌳</div>
                        <div class="text-sm text-gray-600">Equal to</div>
                        <div class="text-lg font-semibold text-gray-900">
                            <span id="trees-value" class="stat-value">0</span> trees
                        </div>
                    </div>
                    <div class="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-2xl mb-1">⚡</div>
                        <div class="text-sm text-gray-600">Energy for</div>
                        <div class="text-lg font-semibold text-gray-900">
                            <span id="homes-value" class="stat-value">0</span> homes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  renderQuickStats() {
    const stats = [
      {
        label: "Daily Production",
        value: this.billData.estimatedDailyProduction,
        unit: "kWh",
        icon: "⚡",
        id: "daily-production",
      },
      {
        label: "Monthly Savings",
        value: this.billData.estimatedAnnualSavings / 12,
        unit: "PKR",
        icon: "💰",
        id: "monthly-savings",
      },
      {
        label: "Payback Period",
        value: this.billData.estimatedPaybackPeriod,
        unit: "years",
        icon: "⏱️",
        id: "payback-period",
      },
    ];

    return `
        <div class="grid grid-cols-3 gap-4 h-full">
            ${stats
              .map(
                (stat) => `
                <div class="flex flex-col justify-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div class="text-2xl mb-2">${stat.icon}</div>
                    <div class="text-sm text-gray-600">${stat.label}</div>
                    <div class="text-lg font-semibold text-gray-900 mt-1">
                        <span id="${stat.id}-value" class="stat-value">0</span>
                        <span class="text-sm text-gray-500">${stat.unit}</span>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  }

  initializeComponents() {
    this.initCharts();
    this.initCounters();
    this.initProgressBars();
    this.initializeAnimations();
  }

  initCharts() {
    this.initProductionChart();
    this.initSavingsChart();
  }

  initProductionChart() {
    const ctx = document.getElementById("production-chart");
    if (!ctx) return;

    const monthlyData = this.generateMonthlyProductionData();

    this.charts.production = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Solar Production",
            data: monthlyData.production,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Energy Consumption",
            data: monthlyData.consumption,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    });
  }

  initSavingsChart() {
    const ctx = document.getElementById("savings-chart");
    if (!ctx) return;

    const years = Array.from({ length: 26 }, (_, i) => `Year ${i}`);
    const systemCost = this.billData.estimatedSystemCost;
    const annualSavings = this.billData.estimatedAnnualSavings;

    const cumulativeSavings = years.map((_, i) => i * annualSavings);
    const investmentLine = years.map(() => systemCost);

    this.charts.savings = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Cumulative Savings",
            data: cumulativeSavings,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Initial Investment",
            data: investmentLine,
            borderColor: "#ef4444",
            borderDash: [5, 5],
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `PKR ${value.toLocaleString()}`,
            },
          },
        },
      },
    });
  }

  generateMonthlyProductionData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const seasonalFactors = {
      winter: 0.7,
      spring: 0.9,
      summer: 1.2,
      fall: 0.8,
    };

    const production = months.map((_, index) => {
      let factor;
      if (index < 2 || index === 11) factor = seasonalFactors.winter;
      else if (index < 5) factor = seasonalFactors.spring;
      else if (index < 8) factor = seasonalFactors.summer;
      else factor = seasonalFactors.fall;

      return Math.round(this.billData.estimatedDailyProduction * 30 * factor);
    });

    const consumption = months.map(() =>
      Math.round(this.billData.unitsConsumed * (0.9 + Math.random() * 0.2))
    );

    return {
      labels: months,
      production,
      consumption,
    };
  }

  calculateCO2Offset() {
    return this.billData.estimatedAnnualProduction * 0.0007; // tons CO2 per kWh
  }

  initializeAnimations() {
    gsap.from(".bento-card", {
      duration: 0.8,
      opacity: 0,
      y: 30,
      stagger: {
        amount: 0.8,
        from: "random",
      },
      ease: "power3.out",
    });

    gsap.to("#co2-progress-bar", {
      width: "75%",
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out",
    });

    this.initializeHoverEffects();
  }

  initializeHoverEffects() {
    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card.querySelectorAll(".stat-value"), {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card.querySelectorAll(".stat-value"), {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }

  cleanup() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    gsap.killTweensOf("*");
    document.querySelectorAll(".bento-card").forEach((card) => {
      card.removeEventListener("mouseenter", () => {});
      card.removeEventListener("mouseleave", () => {});
    });
  }
}
