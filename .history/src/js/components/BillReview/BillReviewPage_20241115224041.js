// BillReviewPage.js - Part 1
import { gsap } from "gsap";
import { getBillData } from "../../store/solarSizingState.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";
import { BillPreview } from "../BillPreview.js";

export class BillReviewPage {
  constructor() {
    this.billData = getBillData();
    this.charts = {};
    this.countUps = {};
    this.resizeTimeout = null;

    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="h-screen w-full overflow-hidden bg-white transition-colors duration-1000 opacity-0" id="quote-result-page">
                <div class="h-full w-full flex flex-col md:flex-row relative" id="main-content">
                    <!-- Bill Preview Side -->
                    <div class="w-full md:w-1/2 h-[45vh] md:h-full overflow-hidden opacity-0" id="bill-preview-container">
                        <div id="bill-preview" class="h-full"></div>
                    </div>

                    <!-- Loading Indicator -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10" id="loading-indicator">
                        <div class="loading-spinner"></div>
                        <p class="text-emerald-600 font-medium">Analyzing your bill...</p>
                    </div>

                    <!-- Insights Container -->
                    <div class="fixed md:relative w-full md:w-1/2 h-[60vh] md:h-full bg-gray-50 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none" 
                         id="insights-container" style="bottom: 0;">
                        <!-- Drag Handle for mobile -->
                        <div class="md:hidden w-full flex justify-center py-2 drag-handle">
                            <div class="w-12 h-1.5 rounded-full bg-gray-300"></div>
                        </div>

                        <div class="h-full flex flex-col p-4 sm:p-6 overflow-auto hide-scrollbar">
                            <!-- Content will be added by renderInsights() -->
                        </div>
                    </div>
                </div>
            </div>
        `;

    const isMobile = this.isMobileDevice();

    if (isMobile) {
      this.initializeMobileInteractions();
    }

    this.attachBaseStyles();

    // Use requestAnimationFrame to ensure styles are applied before starting
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = document.getElementById("quote-result-page");
        if (container) {
          container.classList.remove("opacity-0");
        }

        this.renderBillPreview();
        this.renderInsights();
        this.startAnimation().catch((error) => {
          console.error("Animation failed:", error);
        });
      });
    });
  }

  generateTrendData() {
    const currentMonth = new Date().getMonth();
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

    // Get last 6 months including current month
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = months[monthIndex];

      // Generate consumption that varies around the current consumption
      // Add randomness but keep it realistic
      const baseConsumption = this.billData.unitsConsumed;
      const variation = baseConsumption * (0.8 + Math.random() * 0.4);

      monthlyData.push({
        month,
        consumption: Math.round(variation),
      });
    }

    return monthlyData;
  }

  renderBillPreview() {
    if (!this.billData) {
      console.error("Bill data is not available");
      return;
    }

    const billPreviewContainer = document.querySelector("#bill-preview");
    if (!billPreviewContainer) {
      console.error("Bill preview container not found");
      return;
    }

    // Use existing BillPreview class with the state data
    const billPreview = new BillPreview(this.billData);
    billPreview.render(billPreviewContainer);
  }

  renderInsights() {
    const insightsContainer = document.querySelector(
      "#insights-container .hide-scrollbar"
    );
    if (!insightsContainer) return;

    const trendData = this.generateTrendData();

    insightsContainer.innerHTML = `
          <!-- Header Section -->
          <div class="opacity-0" id="insights-header">
              <div class="flex items-center gap-3">
                  <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                      </div>
                  </div>
                  <div>
                      <h2 class="text-base sm:text-lg font-bold text-gray-900">Bill Analysis</h2>
                      <p class="text-xs sm:text-sm text-gray-500">Understanding your consumption</p>
                  </div>
              </div>
          </div>

          <!-- Progress Tracker -->
          <div class="bg-white/70 backdrop-blur rounded-lg shadow-sm p-3 mt-4 opacity-0" id="progress-tracker">
              <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm">1</div>
                      <div>
                          <p class="font-semibold text-gray-900 text-sm">Bill Review</p>
                          <p class="text-xs text-gray-500">Analyzing patterns</p>
                      </div>
                  </div>
                  <div class="h-0.5 w-12 bg-gray-200"></div>
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-sm">2</div>
                      <div>
                          <p class="font-semibold text-gray-400 text-sm">Solar Quote</p>
                          <p class="text-xs text-gray-400">Up next</p>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Consumption Chart Card -->
          <div class="bg-white rounded-lg shadow-sm p-4 mt-3 opacity-0" id="consumption-card">
              <div class="flex justify-between items-center mb-4">
                  <h3 class="text-sm font-semibold text-gray-900">Consumption Analysis</h3>
                  <div class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                      ${this.formatChange(trendData)}% vs last month
                  </div>
              </div>
              <div class="relative h-[200px] sm:h-[250px] w-full">
                  <canvas id="consumption-trend-chart"></canvas>
              </div>
          </div>

          <!-- Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <!-- Current Bill Card -->
              <div class="bg-white rounded-lg shadow-sm p-3 opacity-0 consumption-metric">
                  <div class="flex justify-between items-center mb-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                      </div>
                      <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                          Due in ${this.calculateDueDays()} days
                      </span>
                  </div>
                  <p class="text-xs text-gray-500 mb-1">Current Bill</p>
                  <p class="text-lg font-bold text-gray-900" id="bill-amount">0</p>
                  <div class="mt-2 h-1 bg-gray-100 rounded">
                      <div class="h-full bg-emerald-500 rounded" style="width: ${this.calculateBillProgress()}%"></div>
                  </div>
              </div>

              <!-- Units Consumed Card -->
              <div class="bg-white rounded-lg shadow-sm p-3 opacity-0 consumption-metric">
                  <div class="flex justify-between items-center mb-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                      </div>
                      <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                          ${this.calculateEfficiency()} efficiency
                      </span>
                  </div>
                  <p class="text-xs text-gray-500 mb-1">Units Consumed</p>
                  <p class="text-lg font-bold text-gray-900" id="units-consumed">0</p>
                  <p class="text-xs text-gray-500 mt-2">
                      Rate: ${this.formatCurrency(
                        this.billData.ratePerUnit
                      )}/kWh
                  </p>
              </div>
          </div>

          <!-- Solar Quote Card -->
          <div class="mt-3 mb-4 md:mb-6" id="next-steps-card-container">
              <div class="bg-emerald-600 rounded-lg shadow-sm p-4 opacity-0" id="next-steps-card">
                  <div class="relative z-10">
                      <div class="flex items-center gap-3 mb-4">
                          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                          </div>
                          <h3 class="text-lg font-semibold text-white">Ready For Your Solar Quote?</h3>
                      </div>
                      
                      <p class="text-sm text-white/90 mb-4">
                          We've analyzed your consumption patterns and can now provide you with a personalized solar solution. 
                          Find out how much you could save!
                      </p>

                      <button id="proceed-to-quote" 
                              class="w-full bg-white hover:bg-white/90 text-emerald-700 px-5 py-2.5 rounded-xl font-medium
                                     transition-all duration-300 shadow-sm hover:shadow-md
                                     flex items-center justify-center gap-2 group">
                          <span>Generate My Quote</span>
                          <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
      `;

    this.initializeCharts(trendData);
    this.initCountUps();
    this.attachEventListeners();
  }

  // BillReviewPage.js - Part 3 (Animations)

  async startAnimation() {
    if (this.error) {
      this.showError();
      return;
    }

    const elements = {
      billPreviewContainer: document.getElementById("bill-preview-container"),
      insightsContainer: document.getElementById("insights-container"),
      loadingIndicator: document.getElementById("loading-indicator"),
      header: document.getElementById("insights-header"),
      progress: document.getElementById("progress-tracker"),
      consumption: document.getElementById("consumption-card"),
      metrics: document.querySelectorAll(".consumption-metric"),
      nextSteps: document.getElementById("next-steps-card"),
    };

    // Initial setup
    const isMobile = this.isMobileDevice();

    // Reset initial states
    gsap.set([elements.billPreviewContainer, elements.loadingIndicator], {
      opacity: 0,
    });

    if (isMobile) {
      // Mobile-specific animation sequence
      gsap.set(elements.billPreviewContainer, {
        y: -20,
      });

      gsap.set(elements.insightsContainer, {
        y: "100%",
        visibility: "visible",
        opacity: 1,
      });

      const timeline = gsap.timeline({
        defaults: { duration: 0.8, ease: "power2.out" },
      });

      await timeline
        .to(elements.billPreviewContainer, {
          opacity: 1,
          y: 0,
          duration: 1,
        })
        .to(elements.loadingIndicator, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
        })
        .to(elements.loadingIndicator, {
          opacity: 0,
          scale: 0.5,
          delay: 0.5,
        })
        .to(elements.insightsContainer, {
          y: "0%",
          duration: 0.8,
          ease: "power4.out",
          onComplete: () => {
            requestAnimationFrame(() => {
              this.startInsightAnimations(elements);
            });
          },
        });
    } else {
      // Desktop animation sequence
      gsap.set(elements.billPreviewContainer, {
        scale: 0.9,
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "47.5%",
      });

      gsap.set(elements.insightsContainer, {
        opacity: 0,
        visibility: "hidden",
      });

      const timeline = gsap.timeline({
        defaults: { duration: 0.8, ease: "power2.out" },
      });

      await timeline
        .to(elements.billPreviewContainer, {
          opacity: 1,
          scale: 1,
          duration: 1,
        })
        .to(elements.loadingIndicator, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
        })
        .to(elements.loadingIndicator, {
          opacity: 0,
          scale: 0.5,
          delay: 1,
        })
        .to(
          elements.billPreviewContainer,
          {
            left: "0%",
            top: "0%",
            xPercent: 0,
            yPercent: 0,
            width: "50%",
            position: "relative",
          },
          "-=0.3"
        )
        .add(() => {
          elements.insightsContainer.style.visibility = "visible";
        })
        .to(elements.insightsContainer, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            requestAnimationFrame(() => {
              this.startInsightAnimations(elements);
            });
          },
        });
    }
  }

  startInsightAnimations(elements) {
    // Initialize counters first
    this.initCountUps();

    const timeline = gsap.timeline({
      defaults: { duration: 0.6, ease: "power2.out" },
    });

    timeline
      .to(elements.header, {
        opacity: 1,
        y: 0,
      })
      .to(
        elements.progress,
        {
          opacity: 1,
          y: 0,
        },
        "-=0.4"
      )
      .to(
        elements.consumption,
        {
          opacity: 1,
          y: 0,
        },
        "-=0.3"
      )
      .to(
        elements.metrics,
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          onComplete: () => {
            this.startCountUps();
          },
        },
        "-=0.2"
      )
      .to(
        elements.nextSteps,
        {
          opacity: 1,
          y: 0,
        },
        "-=0.2"
      );
  }
  // BillReviewPage.js - Part 4 (Chart Configuration)

  initializeCharts(trendData) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = document.getElementById("consumption-trend-chart");
        if (!ctx) {
          console.error("Chart canvas not found");
          resolve();
          return;
        }

        // Ensure canvas is visible
        ctx.style.display = "block";

        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth < 1024;

        // Destroy existing chart if it exists
        if (this.charts.consumption) {
          this.charts.consumption.destroy();
        }

        // Generate monthly data
        const monthlyData = this.generateMonthlyData();

        // Create new chart with updated styling
        this.charts.consumption = new Chart(ctx, {
          type: "line",
          data: {
            labels: monthlyData.months,
            datasets: [
              {
                label: "Consumption (kWh)",
                data: monthlyData.values,
                borderColor: "#059669",
                backgroundColor: "rgba(5, 150, 105, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: isMobile ? 2 : isTablet ? 3 : 4,
                pointHoverRadius: isMobile ? 4 : isTablet ? 5 : 6,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#059669",
                pointBorderWidth: isMobile ? 1 : 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "nearest",
              intersect: false,
              axis: "x",
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                backgroundColor: "white",
                titleColor: "#1f2937",
                bodyColor: "#4b5563",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                padding: isMobile ? 8 : 12,
                titleFont: {
                  size: isMobile ? 12 : 14,
                  weight: "bold",
                },
                bodyFont: {
                  size: isMobile ? 11 : 13,
                },
                displayColors: false,
                callbacks: {
                  label: function (context) {
                    return `${context.parsed.y.toLocaleString()} kWh`;
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
                    size: isMobile ? 10 : isTablet ? 11 : 12,
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
                    size: isMobile ? 10 : isTablet ? 11 : 12,
                  },
                  callback: function (value) {
                    return `${value} kWh`;
                  },
                },
              },
            },
          },
        });

        // Add animation completion handler
        this.charts.consumption.options.animation = {
          onComplete: () => {
            resolve();
          },
        };
      });
    });
  }

  generateMonthlyData() {
    const currentMonth = new Date().getMonth();
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
    const baseConsumption = this.billData.unitsConsumed;

    // Get last 6 months including current month
    const monthLabels = [];
    const consumptionValues = [];

    for (let i = 5; i >= 0; i--) {
      let monthIndex = (currentMonth - i + 12) % 12;
      monthLabels.push(months[monthIndex]);

      // Generate realistic variations (±20% of base consumption)
      let variation = baseConsumption * (0.8 + Math.random() * 0.4);
      consumptionValues.push(Math.round(variation));
    }

    return {
      months: monthLabels,
      values: consumptionValues,
    };
  }

  initCountUps() {
    const countUpOptions = {
      duration: 2,
      useEasing: true,
      useGrouping: true,
    };

    this.countUps = {
      billAmount: new CountUp("bill-amount", this.billData.amount, {
        ...countUpOptions,
        prefix: "PKR ",
        decimalPlaces: 0,
      }),
      unitsConsumed: new CountUp(
        "units-consumed",
        this.billData.unitsConsumed,
        {
          ...countUpOptions,
          suffix: " kWh",
          decimalPlaces: 0,
        }
      ),
    };
  }

  startCountUps() {
    Object.values(this.countUps).forEach((counter) => {
      if (counter && !counter.error) {
        counter.start();
      }
    });
  }
  // BillReviewPage.js - Part 5 (Mobile Interactions & Utilities)

  initializeMobileInteractions() {
    const insightsContainer = document.getElementById("insights-container");
    if (!insightsContainer) return;

    let startY = 0;
    let currentY = 0;
    const initialHeight = "60vh";
    const expandedHeight = "92vh";

    // Handle drag to expand/collapse
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      currentY = insightsContainer.getBoundingClientRect().height;
    };

    const handleTouchMove = (e) => {
      const deltaY = startY - e.touches[0].clientY;
      const newHeight = Math.max(
        Math.min(currentY + deltaY, window.innerHeight * 0.92),
        window.innerHeight * 0.3
      );

      gsap.to(insightsContainer, {
        height: newHeight,
        duration: 0.1,
        ease: "none",
      });
    };

    const handleTouchEnd = () => {
      const finalHeight = insightsContainer.getBoundingClientRect().height;
      const threshold = window.innerHeight * 0.6;

      gsap.to(insightsContainer, {
        height: finalHeight > threshold ? expandedHeight : initialHeight,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Add touch event listeners to drag handle
    const dragHandle = insightsContainer.querySelector(".drag-handle");
    if (dragHandle) {
      dragHandle.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      dragHandle.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      dragHandle.addEventListener("touchend", handleTouchEnd);
    }
  }

  // Utility Methods
  isMobileDevice() {
    return window.innerWidth < 768;
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  calculateDueDays() {
    if (!this.billData.dueDate) return 0;
    const dueDate = new Date(this.billData.dueDate);
    const today = new Date();
    const diffTime = Math.abs(dueDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateBillProgress() {
    const daysInMonth = 30;
    const today = new Date();
    const billDate = new Date(this.billData.issueDate || today);
    const daysPassed = Math.ceil((today - billDate) / (1000 * 60 * 60 * 24));
    return Math.min((daysPassed / daysInMonth) * 100, 100);
  }

  calculateEfficiency() {
    const avgConsumption = 500; // Example average consumption
    return this.billData.unitsConsumed <= avgConsumption ? "High" : "Low";
  }

  formatChange(trendData) {
    if (!Array.isArray(trendData)) return "0.0";
    const lastTwo = trendData.slice(-2);
    const change =
      ((lastTwo[1].consumption - lastTwo[0].consumption) /
        lastTwo[0].consumption) *
      100;
    return change.toFixed(1);
  }

  handleResize = () => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.charts.consumption) {
        this.charts.consumption.resize();
      }
    }, 250);
  };

  attachEventListeners() {
    // Quote button click handler
    const quoteButton = document.getElementById("proceed-to-quote");
    if (quoteButton) {
      quoteButton.addEventListener("click", () => {
        window.router.push("/quote");
      });
    }

    // Window resize handler
    window.addEventListener("resize", this.handleResize);
  }

  attachBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Base styles */
      .hide-scrollbar::-webkit-scrollbar {
          display: none;
      }
      
      .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }

      .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          border-top-color: #10b981;
          animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
          to { transform: rotate(360deg); }
      }

      /* Mobile drag handle styles */
      .drag-handle {
          cursor: grab;
          touch-action: none;
      }

      .drag-handle:active {
          cursor: grabbing;
      }

      /* Animations */
      .fade-in {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
      }
  `;
    document.head.appendChild(style);
  }

  cleanup() {
    // Clean up event listeners and resources
    window.removeEventListener("resize", this.handleResize);

    // Destroy charts
    if (this.charts.consumption) {
      this.charts.consumption.destroy();
    }

    // Reset countups
    Object.values(this.countUps).forEach((counter) => {
      if (counter) counter.reset();
    });

    // Kill any ongoing GSAP animations
    gsap.killTweensOf("*");
  }
}

// Export the class
export default BillReviewPage;
