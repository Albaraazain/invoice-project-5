import { gsap } from "gsap";
import { getBillData, getError } from "../store/solarSizingState.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";
import ProgressBar from "progressbar.js";

export class QuoteResultPage {
  constructor() {
    try {
      this.billData = getBillData();
      console.log("Bill Data loaded:", this.billData); // Add this log
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
        <div class="min-h-screen max-h-screen overflow-hidden bg-gray-50 p-2 sm:p-4 md:p-8">
            <!-- Header -->
            <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Solar System Quote</h1>
                    <p class="text-sm sm:text-base text-gray-500">Based on your consumption analysis</p>
                </div>
                <button 
                    onclick="window.router.push('/bill-review')"
                    class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            <!-- Bento Grid Layout -->
            <div class="relative max-w-[1136px] mx-auto h-[calc(100vh-100px)] overflow-hidden">
                <div class="h-full flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <!-- Main Content Area -->
                    <div class="flex-1 flex flex-col gap-4 sm:gap-6 overflow-hidden">
                        <!-- Top Row -->
                        <div class="flex flex-col md:flex-row gap-4 sm:gap-6 h-auto md:h-[45%]">
                            <!-- System Size & Cost Overview -->
                            <div class="flex flex-row md:flex-col gap-4 sm:gap-6 w-full md:w-[325px]">
                                <div class="flex-1 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
                                    ${this.renderSystemSizeCard()}
                                </div>
                                
                                <!-- Quick Stats Card -->
                                <div class="flex-1 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                    ${this.renderQuickStats()}
                                </div>
                            </div>
                            
                            <!-- Energy Production Chart -->
                            <div class="flex-1 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[300px] md:min-h-0">
                                <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Energy Production</h3>
                                <div class="h-[calc(100%-2rem)]">
                                    <canvas id="production-chart"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Row -->
                        <div class="flex flex-col md:flex-row gap-4 sm:gap-6 h-auto md:h-[55%]">
                            <!-- Savings Timeline Chart -->
                            <div class="flex-[3] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[300px] md:min-h-0">
                                <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Savings Timeline</h3>
                                <div class="h-[calc(100%-2rem)]">
                                    <canvas id="savings-chart"></canvas>
                                </div>
                            </div>
                            
                            <!-- Environmental Impact -->
                            <div class="flex-1 bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                                ${this.renderEnvironmentalImpact()}
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="w-full lg:w-[324px] flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
                        <!-- Monthly Production Analysis -->
                        <div class="flex-1 lg:h-[55%] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[300px] lg:min-h-0">
                            <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Monthly Production</h3>
                            <div class="h-[calc(100%-2rem)]">
                                <canvas id="monthly-production-chart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Cost Analysis -->
                        <div class="flex-1 lg:h-[45%] bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                            ${this.renderCostAnalysis()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  // Update the card renderers to be responsive as well
  renderSystemSizeCard() {
    return `
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-between mb-2 sm:mb-4">
                <h3 class="text-base sm:text-lg font-semibold">System Size</h3>
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
            <div class="flex-1 flex flex-col justify-center">
                <div class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    <span id="system-size-value">0</span>
                    <span class="text-base sm:text-lg text-gray-500">kW</span>
                </div>
                <div class="text-xs sm:text-sm text-gray-500">Recommended capacity</div>
            </div>
            <div id="system-size-progress" class="h-2 mt-2 sm:mt-4"></div>
        </div>
    `;
  }

  renderQuickStats() {
    return `
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div class="text-center">
                <div class="text-xl sm:text-3xl font-bold text-emerald-600" id="daily-production">0</div>
                <div class="text-xs sm:text-sm text-gray-600">Daily kWh</div>
            </div>
            <div class="text-center">
                <div class="text-xl sm:text-3xl font-bold text-blue-600" id="monthly-savings">0</div>
                <div class="text-xs sm:text-sm text-gray-600">Monthly PKR</div>
            </div>
        </div>
    `;
  }

  renderEnvironmentalImpact() {
    return `
        <div class="h-full flex flex-col">
            <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Environmental Impact</h3>
            <div class="flex-1 flex flex-col justify-center">
                <div class="mb-4 sm:mb-6">
                    <div class="text-xs sm:text-sm opacity-80 mb-1">CO₂ Offset</div>
                    <div class="text-xl sm:text-3xl font-bold" id="co2-value">0</div>
                    <div class="w-full bg-white/20 h-1.5 sm:h-2 rounded-full mt-2">
                        <div class="bg-white h-full rounded-full" style="width: 75%"></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <div class="text-xs sm:text-sm opacity-80">Trees Equivalent</div>
                        <div class="text-lg sm:text-2xl font-bold" id="trees-value">0</div>
                    </div>
                    <div>
                        <div class="text-xs sm:text-sm opacity-80">Energy for Homes</div>
                        <div class="text-lg sm:text-2xl font-bold" id="homes-value">0</div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  renderCostAnalysis() {
    return `
        <div class="h-full flex flex-col">
            <h3 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Cost Analysis</h3>
            <div class="flex-1 flex flex-col justify-center">
                <div class="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2" id="total-cost">0</div>
                <div class="text-xs sm:text-sm opacity-80">Total Investment</div>
                <div class="mt-3 sm:mt-4 text-xs sm:text-sm bg-white/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-flex items-center">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    30% Tax Credit Available
                </div>
            </div>
        </div>
    `;
  }

  initializeComponents() {
    if (!this.billData) {
      console.error("No bill data available");
      // Optionally redirect back to input page
      window.router.push("/");
      return;
    }

    console.log("Initializing components with data:", this.billData);
    requestAnimationFrame(() => {
      try {
        this.initCharts();
        this.initCounters();
        this.initProgressBars();
        this.startAnimations();
      } catch (error) {
        console.error("Error initializing components:", error);
      }
    });
  }

  initCounters() {
    if (!this.billData) return;

    const counterConfigs = [
      {
        id: "system-size-value",
        value: this.billData.recommendedSystemSize,
        decimals: 2,
      },
      {
        id: "daily-production",
        value: this.billData.estimatedDailyProduction,
        decimals: 1,
      },
      {
        id: "monthly-savings",
        value: this.billData.estimatedAnnualSavings / 12,
        formatter: (value) => `PKR ${Math.round(value).toLocaleString()}`,
      },
      {
        id: "total-cost",
        value: this.billData.estimatedSystemCost,
        formatter: (value) => `PKR ${Math.round(value).toLocaleString()}`,
      },
      {
        id: "co2-value",
        value: this.calculateCO2Offset(),
        decimals: 1,
        suffix: " tons/year",
      },
    ];

    counterConfigs.forEach((config) => {
      const element = document.getElementById(config.id);
      if (!element) {
        console.warn(`Element not found for counter: ${config.id}`);
        return;
      }

      this.countUps[config.id] = new CountUp(config.id, config.value, {
        decimal: ".",
        decimals: config.decimals || 0,
        duration: 2,
        useEasing: true,
        useGrouping: true,
        separator: ",",
        ...config,
      });

      if (!this.countUps[config.id].error) {
        this.countUps[config.id].start();
      } else {
        console.error(
          `Error setting up counter for ${config.id}:`,
          this.countUps[config.id].error
        );
      }
    });
  }

  initCharts() {
    this.initProductionChart();
    this.initSavingsChart();
    this.initMonthlyProductionChart();
  }

  initProductionChart() {
    const ctx = document.getElementById("production-chart");
    if (!ctx) {
      console.error("Production chart canvas not found");
      return;
    }
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
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      Object.values(this.charts).forEach((chart) => {
        if (chart) {
          chart.resize();
        }
      });
    }, 250);
  };
}

// Export the class
export default QuoteResultPage;
