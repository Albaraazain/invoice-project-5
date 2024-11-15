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
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="min-h-screen bg-gray-50 p-4 md:p-8">
            <!-- Header -->
            <div class="mb-8 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Solar System Quote</h1>
                    <p class="text-gray-500">Based on your consumption analysis</p>
                </div>
                <button 
                    onclick="window.router.push('/bill-review')"
                    class="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            <!-- Bento Grid Layout -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[120px]">
                <!-- System Size Card - Tall -->
                <div class="rounded-xl bg-white p-6 shadow-sm md:row-span-2">
                    ${this.renderSystemSizeCard()}
                </div>

                <!-- Cost Card - Wide -->
                <div class="rounded-xl bg-white p-6 shadow-sm md:col-span-2">
                    ${this.renderCostCard()}
                </div>

                <!-- Environmental Impact - Square -->
                <div class="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm row-span-2">
                    ${this.renderEnvironmentalImpact()}
                </div>

                <!-- Energy Production Chart - Wide & Tall -->
                <div class="rounded-xl bg-white p-6 shadow-sm md:col-span-2 md:row-span-2">
                    <h3 class="text-lg font-semibold mb-4">Energy Production</h3>
                    <div class="h-[300px]">
                        <canvas id="production-chart"></canvas>
                    </div>
                </div>

                <!-- Quick Stats - Wide -->
                <div class="rounded-xl bg-white p-6 shadow-sm md:col-span-2">
                    ${this.renderQuickStats()}
                </div>

                <!-- Savings Timeline - Extra Wide & Tall -->
                <div class="rounded-xl bg-white p-6 shadow-sm md:col-span-3 md:row-span-2">
                    <h3 class="text-lg font-semibold mb-4">Savings Timeline</h3>
                    <div class="h-[300px]">
                        <canvas id="savings-chart"></canvas>
                    </div>
                </div>

                <!-- System Details - Square -->
                <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                    ${this.renderSystemDetails()}
                </div>
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
      this.initializeComponents();
    });
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
    const co2Offset = this.billData.estimatedAnnualProduction * 0.0007; // tons of CO2 per kWh
    const treesEquivalent = Math.round(co2Offset * 40); // Each tree absorbs ~0.025 tons CO2 per year
    const gasoline = Math.round(co2Offset * 113); // gallons of gasoline equivalent

    return `
        <div class="relative pt-1">
            <div class="flex mb-2 items-center justify-between">
                <div>
                    <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                        CO₂ Offset
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold inline-block text-green-600">
                        ${co2Offset.toFixed(1)} tons/year
                    </span>
                </div>
            </div>
            <div class="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                <div id="co2-progress" 
                     class="w-0 transition-all duration-1000 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500">
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center">
                    <span class="text-2xl mr-3">🌳</span>
                    <div>
                        <p class="text-sm text-gray-600">Equivalent to</p>
                        <p class="text-lg font-semibold text-gray-900">${treesEquivalent.toLocaleString()} trees planted</p>
                    </div>
                </div>
            </div>

            <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-center">
                    <span class="text-2xl mr-3">⛽</span>
                    <div>
                        <p class="text-sm text-gray-600">Equal to removing</p>
                        <p class="text-lg font-semibold text-gray-900">${gasoline.toLocaleString()} gallons of gasoline</p>
                    </div>
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
    // Fade in sections
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

    // Animate progress bars
    gsap.to("#co2-progress", {
      width: "75%",
      duration: 1.5,
      ease: "power2.out",
      delay: 0.5,
    });

    // Number counting animations
    this.initializeCounters();
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
}
