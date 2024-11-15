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
    if (!app) {
        console.error("App container not found");
        return;
    }

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
            <div class="relative max-w-[1136px] mx-auto min-h-[836px]">
                <div class="flex gap-6">
                    <!-- Main Content Area -->
                    <div class="flex-1 flex flex-col gap-6">
                        <!-- Top Row -->
                        <div class="flex gap-6">
                            <!-- System Size & Cost Overview -->
                            <div class="flex flex-col gap-6 w-[325px]">
                                <div class="bg-white rounded-2xl p-6 h-[183px] flex flex-col justify-between">
                                    ${this.renderSystemSizeCard()}
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
        </div>
    `;
  }

  renderSystemSizeCard() {
    return `
        <div class="flex flex-col h-full">
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
            <div id="system-size-progress" class="h-2 mt-4"></div>
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

  initializeComponents() {
    this.initCharts();
    this.initCounters();
    this.initProgressBars();
    this.startAnimations();
  }

  initCharts() {
    this.initProductionChart();
    this.initSavingsChart();
    this.initMonthlyProductionChart();
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
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
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
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
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

  initMonthlyProductionChart() {
    const ctx = document.getElementById("monthly-production-chart");
    if (!ctx) return;

    const data = this.generateMonthlyProductionData();

    this.charts.monthlyProduction = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Monthly Production",
            data: data.production,
            backgroundColor: "#10b981",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} kWh`,
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

  initCounters() {
    const counterData = [
      {
        id: "system-size-value",
        value: this.billData.recommendedSystemSize,
        decimals: 2,
      },
      {
        id: "total-cost",
        value: this.billData.estimatedSystemCost,
        prefix: "PKR ",
        separator: ",",
      },
      {
        id: "co2-value",
        value: this.calculateCO2Offset(),
        decimals: 1,
        suffix: " tons/year",
      },
      {
        id: "trees-value",
        value: Math.round(this.calculateCO2Offset() * 40),
      },
      {
        id: "homes-value",
        value: Math.round(this.billData.estimatedAnnualProduction / 12000),
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
        suffix: counter.suffix || "",
        decimals: counter.decimals || 0,
      });

      if (!this.countUps[counter.id].error) {
        this.countUps[counter.id].start();
      }
    });
  }

  initProgressBars() {
    // System Size Progress Bar
    const systemSizeProgress = document.getElementById("system-size-progress");
    if (systemSizeProgress) {
      this.progressBars.systemSize = new ProgressBar.Line(systemSizeProgress, {
        strokeWidth: 4,
        easing: "easeInOut",
        duration: 1400,
        color: "#3b82f6",
        trailColor: "#e5e7eb",
        trailWidth: 4,
        svgStyle: { width: "100%", height: "100%" },
      });

      this.progressBars.systemSize.animate(0.8);
    }
  }

  startAnimations() {
    // Animate cards entrance
    gsap.from(".rounded-2xl", {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: {
        amount: 0.4,
        from: "random",
      },
      ease: "power3.out",
    });

    // Animate progress bars
    gsap.to(".bg-white.h-full.rounded-full", {
      width: "75%",
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out",
    });

    // Add hover animations for cards
    document.querySelectorAll(".rounded-2xl").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.01,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }

  calculateCO2Offset() {
    // Calculate CO2 offset based on annual production
    // Average of 0.7 kg CO2 per kWh
    return this.billData.estimatedAnnualProduction * 0.0007; // Convert to tons
  }

  cleanup() {
    // Destroy all charts
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.charts = {};

    // Destroy all progress bars
    Object.values(this.progressBars).forEach((progressBar) => {
      if (progressBar) progressBar.destroy();
    });
    this.progressBars = {};

    // Reset all counters
    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) countUp.reset();
    });
    this.countUps = {};

    // Kill all GSAP animations
    gsap.killTweensOf("*");

    // Remove event listeners
    document.querySelectorAll(".rounded-2xl").forEach((card) => {
      card.removeEventListener("mouseenter", () => {});
      card.removeEventListener("mouseleave", () => {});
    });
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

// Export the class
export default QuoteResultPage;
