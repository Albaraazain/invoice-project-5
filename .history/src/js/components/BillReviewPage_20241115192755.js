// BillReviewPage.js
import { gsap } from "gsap";
import { getBillData } from "../store/solarSizingState.js";
import { BillPreview } from "./BillPreview.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";

export class BillReviewPage {
  constructor() {
    this.billData = getBillData();
    this.charts = {};
  }

  addScrollStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
  }

  // Update the main container structure in render method
  render() {
    const app = document.getElementById("app");
    const trendData = this.generateTrendData();

    app.innerHTML = `
    <div class="h-screen w-full overflow-hidden bg-white transition-colors duration-1000 opacity-0" id="quote-result-page">
        <div class="h-full w-full flex flex-col md:flex-row relative" id="main-content">
            <!-- Bill Preview Side - Full width on mobile -->
            <div class="w-full md:w-1/2 h-[45vh] md:h-full overflow-hidden opacity-0" id="bill-preview-container">
                <div id="bill-preview" class="h-full"></div>
            </div>

            <!-- Loading Indicator -->
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10" 
                 id="loading-indicator">
                <div class="loading-spinner"></div>
                <p class="text-emerald-600 font-medium">Analyzing your bill...</p>
            </div>

            <!-- Insights Container -->
            <div class="fixed md:relative w-full md:w-1/2 h-[60vh] md:h-full bg-gray-50 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none" 
                id="insights-container"
                style="bottom: 0;">
                <!-- Drag Handle for mobile -->
                <div class="md:hidden w-full flex justify-center py-2 drag-handle">
                    <div class="w-12 h-1.5 rounded-full bg-gray-300"></div>
                </div>

                <div class="h-full flex flex-col p-4 sm:p-6 overflow-auto hide-scrollbar">
                    <!-- Top Section: Fixed Height -->
                    <div class="flex-none space-y-3 sm:space-y-4">
                        <!-- Header Section -->
                        <div class="opacity-0" id="insights-header">
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                        <div class="bg-white/70 backdrop-blur rounded-lg shadow-sm p-3 opacity-0" id="progress-tracker">
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
                    </div>

                    <!-- Main Content Area: Flexible Height -->
                    <div class="flex-1 min-h-0 mt-3">
                        <div class="h-full grid grid-rows-[auto_auto_1fr] gap-3">
                            <!-- Consumption Analysis Card -->
                            <div class="bg-white rounded-lg shadow-sm p-4 opacity-0" id="consumption-card">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-sm font-semibold text-gray-900">Consumption Analysis</h3>
                                    <div class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                                        ${this.formatChange(
                                          trendData
                                        )}% vs last month
                                    </div>
                                </div>
                                <div class="relative h-[200px] sm:h-[250px] w-full">
                                    <canvas id="consumption-trend-chart"></canvas>
                                </div>
                            </div>

                            <!-- Metrics Cards Container -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <!-- Current Bill Card -->
                                <div class="bg-white rounded-lg shadow-sm p-3 opacity-0 consumption-metric">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">Due in ${this.calculateDueDays()} days</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mb-1">Current Bill</p>
                                    <p class="text-lg font-bold text-gray-900" id="bill-amount">${this.formatCurrency(
                                      this.billData.amount
                                    )}</p>
                                    <div class="mt-2 h-1 bg-gray-100 rounded">
                                        <div class="h-full bg-emerald-500 rounded" style="width: ${this.calculateBillProgress()}%"></div>
                                    </div>
                                </div>

                                <!-- Units Consumed Card -->
                                <div class="bg-white rounded-lg shadow-sm p-3 opacity-0 consumption-metric">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                                            ${this.calculateEfficiency()} efficiency
                                        </span>
                                    </div>
                                    <p class="text-xs text-gray-500 mb-1">Units Consumed</p>
                                    <p class="text-lg font-bold text-gray-900" id="units-consumed">${
                                      this.billData.unitsConsumed
                                    } kWh</p>
                                    <p class="text-xs text-gray-500 mt-2">Rate: ${this.formatCurrency(
                                      this.billData.ratePerUnit
                                    )}/kWh</p>
                                </div>
                            </div>

                            <!-- Solar Quote Card -->
                            <div class="mt-3 mb-4 md:mb-6" id="next-steps-card-container">
                                <div class="bg-emerald-600 rounded-lg sm:rounded-xl shadow-sm opacity-0" id="next-steps-card">
                                    <!-- Main Content Container with Better Padding -->
                                    <div class="p-4 sm:p-5 md:p-6">
                                        <div class="relative z-10 flex flex-col gap-4 sm:gap-5">
                                            <!-- Header Section -->
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <h3 class="text-lg sm:text-xl font-semibold text-white">Ready For Your Solar Quote?</h3>
                                            </div>

                                            <!-- Description and Benefits -->
                                            <div class="space-y-4">
                                                <p class="text-sm sm:text-base text-white/90 leading-relaxed">
                                                    We've analyzed your consumption patterns and can now provide you with a personalized solar solution. Find out how much you could save!
                                                </p>
                                                
                                                <!-- Benefits Pills -->
                                                <div class="flex flex-wrap gap-2">
                                                    <div class="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                                                        <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span class="text-sm text-white">Personalized Solution</span>
                                                    </div>
                                                    <div class="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                                                        <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                                                        </svg>
                                                        <span class="text-sm text-white">Cost Savings</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- CTA Button -->
                                            <button 
                                                id="proceed-to-quote" 
                                                class="w-full sm:w-auto bg-white hover:bg-white/90 text-emerald-700 px-5 py-2.5 rounded-xl font-medium
                                                      transition-all duration-300 shadow-sm hover:shadow-md
                                                      flex items-center justify-center gap-2 group mt-2"
                                            >
                                                <span>Generate My Quote</span>
                                                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Decorative Background (Optimized) -->
                                    <div class="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl">
                                        <div class="absolute top-0 right-0 w-48 h-48 md:w-56 md:h-56 translate-x-1/4 -translate-y-1/4 opacity-10">
                                            <svg class="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
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
        // Make container visible
        const container = document.getElementById("quote-result-page");
        if (container) {
          container.classList.remove("opacity-0");
        }

        // Now render bill preview and start animation
        this.renderBillPreview();
        this.startAnimation().catch((error) => {
          console.error("Animation failed:", error);
          this.showError();
        });
      });
    });
  }

  isMobileDevice() {
    return window.innerWidth < 768; // You can adjust this breakpoint
  }

  getTrendChangeText() {
    const trendData = this.generateTrendData();
    return `${this.formatChange(trendData)}% vs last month`;
  }

  initializeMobileInteractions() {
    const insightsContainer = document.getElementById("insights-container");
    let startY = 0;
    let currentY = 0;
    let initialHeight = "60vh";
    let expandedHeight = "92vh";

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

    const handleTouchEnd = (e) => {
      const finalHeight = insightsContainer.getBoundingClientRect().height;
      const threshold = window.innerHeight * 0.6;

      gsap.to(insightsContainer, {
        height: finalHeight > threshold ? expandedHeight : initialHeight,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Add touch event listeners
    const dragHandle = insightsContainer.querySelector(".drag-handle");
    dragHandle.addEventListener("touchstart", handleTouchStart);
    dragHandle.addEventListener("touchmove", handleTouchMove);
    dragHandle.addEventListener("touchend", handleTouchEnd);
  }

  async startAnimation() {
    if (this.error) {
      this.showError();
      return;
    }

    // Initialize charts before animations
    const trendData = this.generateTrendData();
    await this.initializeCharts(trendData);

    const isMobile = this.isMobileDevice();
    const billPreviewContainer = document.getElementById(
      "bill-preview-container"
    );
    const insightsContainer = document.getElementById("insights-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    const quoteResultPage = document.getElementById("quote-result-page");

    // Initial states
    gsap.set([billPreviewContainer, loadingIndicator], {
      opacity: 0,
    });

    if (isMobile) {
      // Mobile animation sequence
      gsap.set(billPreviewContainer, {
        y: -20,
      });

      // Set initial state for mobile insights
      gsap.set(insightsContainer, {
        y: "100%",
        visibility: "visible",
        opacity: 1,
      });

      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power2.out" },
      });

      await tl
        .to(billPreviewContainer, {
          opacity: 1,
          y: 0,
          duration: 1,
        })
        .to(loadingIndicator, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
        })
        .to(loadingIndicator, {
          opacity: 0,
          scale: 0.5,
          delay: 0.5,
        })
        .to(insightsContainer, {
          y: "0%",
          duration: 0.8,
          ease: "power4.out",
          onComplete: () => {
            requestAnimationFrame(() => {
              this.startInsightAnimations();
            });
          },
        });
    } else {
      // Desktop animation sequence
      gsap.set(billPreviewContainer, {
        scale: 0.9,
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "47.5%",
      });

      // Set initial state for desktop insights
      gsap.set(insightsContainer, {
        opacity: 0,
        visibility: "hidden",
      });

      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power2.out" },
      });

      await tl
        .to(billPreviewContainer, {
          opacity: 1,
          scale: 1,
          duration: 1,
        })
        .to(loadingIndicator, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
        })
        .to(loadingIndicator, {
          opacity: 0,
          scale: 0.5,
          delay: 1,
        })
        .to(
          billPreviewContainer,
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
          insightsContainer.style.visibility = "visible";
        })
        .to(insightsContainer, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            requestAnimationFrame(() => {
              this.startInsightAnimations();
            });
          },
        });
    }
  }

  startInsightAnimations() {
    // First init the counters
    this.initCountUps();

    // Make sure elements exist before animating
    const elements = {
      header: document.getElementById("insights-header"),
      progress: document.getElementById("progress-tracker"),
      consumption: document.getElementById("consumption-card"),
      metrics: document.querySelectorAll(".consumption-metric"),
      nextSteps: document.getElementById("next-steps-card"),
    };

    // Check if elements exist before animating
    if (elements.header) {
      gsap.to(elements.header, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (elements.progress) {
      gsap.to(elements.progress, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });
    }

    if (elements.consumption) {
      gsap.to(elements.consumption, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out",
      });
    }

    if (elements.metrics.length > 0) {
      gsap.to(elements.metrics, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.6,
        ease: "power2.out",
        onComplete: () => {
          this.startCountUps();
        },
      });
    }

    if (elements.nextSteps) {
      gsap.to(elements.nextSteps, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 1,
        ease: "power2.out",
      });
    }
  }

  attachBaseStyles() {
    const style = document.createElement("style");
    style.textContent = this.getBaseStyles();
    document.head.appendChild(style);
  }

  getBaseStyles() {
    return `
        /* Base Theme Colors */
        :root {
            --color-primary: #10b981;
            --color-primary-dark: #059669;
            --color-bg-secondary: #f3f4f6;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            #insights-container {
                transition: transform 0.3s ease;
                will-change: transform;
                touch-action: none;
            }

            .drag-handle {
                cursor: grab;
                touch-action: none;
            }

            .drag-handle:active {
                cursor: grabbing;
            }
        }

        /* Hide scrollbar on mobile */
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Loading Spinner */
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

        /* Animated Gradient */
        .animated-gradient {
            background: linear-gradient(
                45deg,
                rgba(255,255,255,0.1),
                rgba(255,255,255,0.2),
                rgba(255,255,255,0.1)
            );
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
  }

  initCountUps() {
    console.log("Initializing CountUps with data:", this.billData); // Add debug log

    const countUpOptions = {
      duration: 2,
      useEasing: true,
      useGrouping: true,
    };

    // Initialize counters for the bill amounts and units
    this.countUps = {
      billAmount: new CountUp("bill-amount", this.billData.amount || 0, {
        ...countUpOptions,
        prefix: "PKR ",
        decimalPlaces: 0,
      }),
      unitsConsumed: new CountUp(
        "units-consumed",
        this.billData.unitsConsumed || 0,
        {
          ...countUpOptions,
          suffix: " kWh",
          decimalPlaces: 0,
        }
      ),
    };
  }

  startCountUps() {
    console.log("Starting CountUps"); // Add debug log
    Object.entries(this.countUps).forEach(([key, counter]) => {
      if (counter && !counter.error) {
        console.log(`Starting counter: ${key}`);
        counter.start();
      } else {
        console.error(`Error with counter ${key}:`, counter?.error);
      }
    });
  }
  renderBillPreview() {
    if (!this.billData) {
      console.error("Bill data is not available");
      this.renderError(document.getElementById("app"));
      return;
    }

    console.log("Rendering with bill data:", this.billData); // Add debug log

    const billPreviewContainer = document.querySelector("#bill-preview");
    if (!billPreviewContainer) {
      console.error("Bill preview container not found");
      return;
    }

    const billPreview = new BillPreview({
      ...this.billData,
      totalAmount: this.billData.amount, // Ensure totalAmount is set
      unitsConsumed: this.billData.unitsConsumed,
      ratePerUnit: this.billData.ratePerUnit,
    });
    billPreview.render(billPreviewContainer);
  }

  renderError(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center h-screen">
            <div class="text-center">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                <p class="text-gray-600">Bill data is not available. Please try again.</p>
                <button onclick="window.router.push('/')" 
                        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Go Back
                </button>
            </div>
        </div>
    `;
  }

  renderInsights() {
    const insightsContainer = document.querySelector("#insights-container");
    if (!insightsContainer) return;

    // Generate trend data for the last 6 months
    const trendData = this.generateTrendData();

    insightsContainer.innerHTML = `
      <div class="h-full flex flex-col p-2 sm:p-4 lg:p-6 overflow-auto">
        <!-- Header Section -->
        <div class="flex-none mb-3 sm:mb-4 lg:mb-6 opacity-0" id="insights-header">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Bill Analysis</h2>
              <p class="text-xs sm:text-sm lg:text-base text-gray-500">Understanding your consumption</p>
            </div>
          </div>
        </div>

        <!-- Progress Tracker -->
        <div class="bg-white/70 backdrop-blur rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 opacity-0" id="progress-tracker">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">1</div>
              <div>
                <p class="font-semibold text-gray-900 text-sm sm:text-base">Bill Review</p>
                <p class="text-xs sm:text-sm text-gray-500">Analyzing patterns</p>
              </div>
            </div>
            <div class="h-0.5 w-16 sm:w-24 bg-gray-200"></div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-sm sm:text-base">2</div>
              <div>
                <p class="font-semibold text-gray-400 text-sm sm:text-base">Solar Quote</p>
                <p class="text-xs sm:text-sm text-gray-400">Up next</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 flex-1">
          <!-- Consumption Analysis Card -->
          <div class="sm:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 opacity-0" id="consumption-card">
            <div class="flex justify-between items-center mb-3 sm:mb-4">
              <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Consumption Analysis</h3>
              <div class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs sm:text-sm font-medium">
                ${this.formatChange(trendData)}% vs last month
              </div>
            </div>
            <div class="h-[200px] sm:h-[250px]">
              <canvas id="consumption-trend-chart"></canvas>
            </div>
          </div>

          <!-- Current Bill Card -->
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 opacity-0 consumption-metric">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs sm:text-sm rounded-full">Due in ${this.calculateDueDays()} days</span>
            </div>
            <p class="text-xs sm:text-sm text-gray-500 mb-1">Current Bill</p>
            <p class="text-lg font-bold text-gray-900" id="bill-amount">${this.formatCurrency(
              this.billData.amount
            )}</p>
            <div class="mt-4 h-1 bg-gray-100 rounded">
              <div class="h-full bg-emerald-500 rounded" style="width: ${this.calculateBillProgress()}%"></div>
            </div>
          </div>

          <!-- Units Consumed Card -->
          <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 opacity-0 consumption-metric">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span class="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs sm:text-sm rounded-full">
                ${this.calculateEfficiency()} efficiency
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-500 mb-1">Units Consumed</p>
            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${
              this.billData.unitsConsumed
            } kWh</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-2">Rate: ${this.formatCurrency(
              this.billData.ratePerUnit
            )}/kWh</p>
          </div>

          <!-- Next Steps Card -->
          <div class="sm:col-span-2 mt-auto">
            <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 relative opacity-0" id="next-steps-card">
                <div class="!w-full !max-w-none !important border-2 !border-red-500">
                <h3 class="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Ready For Your Solar Quote?</h3>
                <p class="text-sm sm:text-base text-white/90 mb-4">
                  We've analyzed your consumption patterns. Let's see how much you could save with solar energy!
                </p> 
                <button 
                  id="proceed-to-quote" 
                  class="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium
                       transition-all duration-300 shadow-sm hover:shadow-lg
                       flex items-center justify-center gap-2 group"
                >
                  Generate My Solar Quote
                  <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Update the chart colors in initializeCharts
    this.initializeCharts(trendData);
    this.startInsightAnimations();
    this.attachEventListeners();
  }

  generateTrendData() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      consumption: Math.floor(
        this.billData.unitsConsumed * (0.8 + Math.random() * 0.4)
      ),
    }));
  }

  initializeCharts(trendData) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = document.getElementById("consumption-trend-chart");
        if (!ctx) {
          console.error("Chart canvas not found");
          resolve();
          return;
        }

        // Ensure the canvas is visible
        ctx.style.display = "block";

        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth < 1024;

        // Destroy existing chart if it exists
        if (this.charts.consumption) {
          this.charts.consumption.destroy();
        }

        // Generate proper monthly data
        const monthlyData = this.generateMonthlyData();

        // Create new chart
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

        // Resolve promise after chart is initialized
        this.charts.consumption.options.animation = {
          onComplete: () => {
            resolve();
          },
        };
      });
    });
  }

  // Add this helper method to generate better monthly data
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

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.charts.consumption) {
        this.charts.consumption.resize();
      }
    }, 250);
  }

  // Utility methods
  formatCurrency(value) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  calculateDueDays() {
    const dueDate = new Date(this.billData.dueDate);
    const today = new Date();
    const diffTime = Math.abs(dueDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateBillProgress() {
    const daysInMonth = 30;
    const today = new Date();
    const billDate = new Date(this.billData.issueDate);
    const daysPassed = Math.ceil((today - billDate) / (1000 * 60 * 60 * 24));
    return Math.min((daysPassed / daysInMonth) * 100, 100);
  }

  calculateEfficiency() {
    const avgConsumption = 500; // Example average consumption
    const efficiency = (this.billData.unitsConsumed / avgConsumption) * 100;
    return efficiency <= 100 ? "High" : "Low";
  }

  formatChange(data) {
    const lastTwo = data.slice(-2);
    const change =
      ((lastTwo[1].consumption - lastTwo[0].consumption) /
        lastTwo[0].consumption) *
      100;
    return change.toFixed(1);
  }

  attachEventListeners() {
    const quoteButton = document.getElementById("proceed-to-quote");
    const mobileQuoteButton = document.getElementById(
      "proceed-to-quote-mobile"
    );

    if (quoteButton) {
      quoteButton.addEventListener("click", () => {
        window.router.push("/quote");
      });
    }

    if (mobileQuoteButton) {
      mobileQuoteButton.addEventListener("click", () => {
        window.router.push("/quote");
      });
    }

    // Add touch event handlers for mobile
    if (this.isMobileDevice()) {
      const insightsContainer = document.getElementById("insights-container");
      let startY = 0;
      let scrolling = false;

      insightsContainer.addEventListener(
        "touchstart",
        (e) => {
          startY = e.touches[0].pageY;
        },
        { passive: true }
      );

      insightsContainer.addEventListener(
        "touchmove",
        (e) => {
          if (!scrolling) {
            const currentY = e.touches[0].pageY;
            const diff = startY - currentY;

            if (diff > 0) {
              // Scrolling up
              scrolling = true;
              gsap.to(insightsContainer, {
                height: "85vh",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }
        },
        { passive: true }
      );
    }
  }
}
