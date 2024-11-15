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
            <div class="min-h-screen bg-gray-50">
                <!-- Header Section -->
                <header class="bg-white shadow-sm">
                    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">Solar System Quote</h1>
                                <p class="mt-1 text-sm text-gray-500">Based on your electricity consumption analysis</p>
                            </div>
                            <button 
                                onclick="window.router.push('/bill-review')"
                                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg class="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Analysis
                            </button>
                        </div>
                    </div>
                </header>
    
                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <!-- Key Metrics Grid -->
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                        ${this.renderKeyMetrics()}
                    </div>
    
                    <!-- Charts Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        ${this.renderChartSections()}
                    </div>
    
                    <!-- Additional Details -->
                    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        ${this.renderDetailsSections()}
                    </div>
                </main>
            </div>
        `;

    // Initialize components after DOM is ready
    requestAnimationFrame(() => {
      this.initializeComponents();
    });
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
    this.countUps.systemSize = new CountUp(
      "system-size-value",
      0,
      this.billData.recommendedSystemSize,
      2,
      countUpOptions
    );

    // Cost
    this.countUps.cost = new CountUp(
      "cost-value",
      0,
      this.billData.estimatedSystemCost,
      0,
      {
        ...countUpOptions,
        prefix: "PKR ",
        formattingFn: (value) => {
          return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0,
          }).format(value);
        },
      }
    );

    // Payback Period
    this.countUps.payback = new CountUp(
      "payback-value",
      0,
      this.billData.estimatedPaybackPeriod,
      1,
      countUpOptions
    );

    // Annual Savings
    this.countUps.annualSavings = new CountUp(
      "annual-savings-value",
      0,
      this.billData.estimatedAnnualSavings,
      0,
      {
        ...countUpOptions,
        prefix: "PKR ",
        formattingFn: (value) => {
          return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0,
          }).format(value);
        },
      }
    );

    // Production Stats
    this.countUps.dailyProduction = new CountUp(
      "daily-production-value",
      0,
      this.billData.estimatedDailyProduction,
      1,
      countUpOptions
    );
    this.countUps.monthlyProduction = new CountUp(
      "monthly-production-value",
      0,
      this.billData.estimatedMonthlyProduction,
      0,
      countUpOptions
    );
    this.countUps.coverage = new CountUp(
      "coverage-value",
      0,
      this.billData.coveragePercentage,
      1,
      countUpOptions
    );
    this.countUps.efficiency = new CountUp(
      "efficiency-value",
      0,
      21.5,
      1,
      countUpOptions
    );

    // Environmental Impact
    const co2Offset = this.billData.estimatedAnnualProduction * 0.0007;
    this.countUps.co2Offset = new CountUp(
      "co2-offset-value",
      0,
      co2Offset,
      1,
      countUpOptions
    );
    this.countUps.trees = new CountUp(
      "trees-value",
      0,
      Math.round(co2Offset * 40),
      0,
      countUpOptions
    );

    // System Details
    this.countUps.panels = new CountUp(
      "panels-value",
      0,
      this.billData.numberOfPanels,
      0,
      countUpOptions
    );
    this.countUps.roofArea = new CountUp(
      "roof-area-value",
      0,
      this.billData.numberOfPanels * 17.5,
      0,
      countUpOptions
    );
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
    const ctx = document.getElementById("energy-production-chart");
    if (!ctx) return;

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
    const baseProduction = this.billData.estimatedMonthlyProduction;

    const productionData = months.map((month) => {
      const seasonalFactor = this.getSeasonalFactor(month);
      return baseProduction * seasonalFactor;
    });

    this.charts.production = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Estimated Production (kWh)",
            data: productionData,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
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
          tooltip: {
            backgroundColor: "white",
            titleColor: "#1F2937",
            bodyColor: "#4B5563",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y.toLocaleString()} kWh`,
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
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    });
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

  startAnimations() {
    // Start all CountUp animations
    Object.values(this.countUps).forEach((countUp) => {
      if (countUp && !countUp.error) {
        countUp.start();
      }
    });

    // Animate progress bars
    if (this.progressBars.systemSize) {
      this.progressBars.systemSize.animate(0.75); // Example progress value
    }

    // Add entrance animations with GSAP
    const cards = document.querySelectorAll(".rounded-2xl");
    gsap.fromTo(
      cards,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }

  cleanup() {
    // Cleanup charts
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.charts = {};

    // Cleanup progress bars
    Object.values(this.progressBars).forEach((progressBar) => {
      if (progressBar) progressBar.destroy();
    });
    this.progressBars = {};

    // Reset CountUps
    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) countUp.reset();
    });
    this.countUps = {};
  }
}
