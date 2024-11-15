// BillReviewPage.js
import { gsap } from "gsap";
import { getBillData } from "../store/solarSizingState.js";
import { BillPreview } from "./BillPreview.js";
import Chart from "chart.js/auto";

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

    app.innerHTML = `
    <div class="h-screen w-full overflow-hidden bg-white transition-colors duration-1000" id="quote-result-page">
        <div class="h-full w-full flex relative" id="main-content">
            <!-- Bill Preview Side -->
            <div class="w-1/2 h-full overflow-hidden" id="bill-preview-container">
                <div id="bill-preview" class="h-full"></div>
            </div>

            <!-- Loading Indicator -->
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10" 
                 id="loading-indicator">
                <div class="loading-spinner"></div>
                <p class="text-primary font-medium">Analyzing your bill...</p>
            </div>

            <!-- Insights Side -->
            <div class="w-1/2 h-full invisible overflow-hidden" id="insights-container">
                <div class="h-full w-full flex flex-col p-2 sm:p-4 lg:p-6 overflow-auto">
                    <!-- Header Section -->
                    <div class="flex items-center space-x-4 mb-3 sm:mb-4 lg:mb-6 opacity-0" id="insights-header">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Bill Analysis</h2>
                            <p class="text-xs sm:text-sm lg:text-base text-gray-500">Understanding your energy consumption</p>
                        </div>
                    </div>

                    <!-- Progress Tracker -->
                    <div class="bg-white/70 backdrop-blur rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 opacity-0" id="progress-tracker">
                        <div class="flex justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">1</div>
                                <div class="ml-3">
                                    <p class="font-semibold text-gray-900 text-sm sm:text-base">Bill Review</p>
                                    <p class="text-xs sm:text-sm text-gray-500">Analyzing consumption patterns</p>
                                </div>
                            </div>
                            <div class="w-24 sm:w-32 h-0.5 self-center bg-gray-200"></div>
                            <div class="flex items-center">
                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-sm sm:text-base">2</div>
                                <div class="ml-3">
                                    <p class="font-semibold text-gray-400 text-sm sm:text-base">Solar Quote</p>
                                    <p class="text-xs sm:text-sm text-gray-400">Up next</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Consumption Analysis Card -->
                    <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 opacity-0" id="consumption-card">
                        <div class="flex justify-between items-center mb-3 sm:mb-4">
                            <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Consumption Analysis</h3>
                            <div class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-medium">
                                ${this.formatChange(
                                  this.generateTrendData()
                                )}% vs last month
                            </div>
                        </div>
                        <div class="h-[200px] sm:h-[250px]">
                            <canvas id="consumption-trend-chart"></canvas>
                        </div>
                    </div>

                    <!-- Key Metrics Grid -->
                    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4 lg:mb-6">
                        <!-- Current Bill Card -->
                        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 opacity-0 consumption-metric">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="px-2 py-1 bg-green-50 text-green-600 text-xs sm:text-sm rounded-full">Due in ${this.calculateDueDays()} days</span>
                            </div>
                            <p class="text-xs sm:text-sm text-gray-500 mb-1">Current Bill</p>
                            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${this.formatCurrency(
                              this.billData.amount
                            )}</p>
                            <div class="mt-4 h-1 bg-gray-100 rounded">
                                <div class="h-full bg-green-500 rounded" style="width: ${this.calculateBillProgress()}%"></div>
                            </div>
                        </div>

                        <!-- Units Consumed Card -->
                        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 opacity-0 consumption-metric">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs sm:text-sm rounded-full">
                                    ${this.calculateEfficiency()} efficiency
                                </span>
                            </div>
                            <p class="text-xs sm:text-sm text-gray-500 mb-1">Units Consumed</p>
                            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">${
                              this.billData.unitsConsumed
                            } kWh</p>
                        </div>
                    </div>

                    <!-- Next Steps Card -->
                    <div class="mt-auto">
                        <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 relative opacity-0" id="next-steps-card">
                            <div class="absolute -top-2 -right-2">
                                <div class="w-10 h-10 sm:w-12 sm:h-12 animated-gradient rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="max-w-lg">
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
        </div>
    </div>
`;

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

  async startAnimation() {
    if (this.error) {
      this.showError();
      return;
    }

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
    gsap.set(billPreviewContainer, {
      scale: 0.9,
      position: "absolute",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      width: "47.5%",
    });
    gsap.set(loadingIndicator, {
      scale: 0.5,
    });

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power2.out" },
    });

    // Animation sequence
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
      .call(() => {
        insightsContainer.style.visibility = "visible";
      })
      .to(insightsContainer, {
        opacity: 1,
        duration: 0.5,
      })
      .to(
        quoteResultPage,
        {
          backgroundColor: "var(--color-bg-secondary)",
          duration: 1,
        },
        "-=0.5"
      );

    // Render insights after animations
    this.renderInsights();
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
        --color-primary: #3b82f6;
        --color-primary-dark: #2563eb;
        --color-primary-light: #93c5fd;
        --color-success: #10b981;
        --color-warning: #f59e0b;
        --color-error: #ef4444;
        --color-gray-50: #f8fafc;
        --color-gray-100: #f1f5f9;
        --color-gray-200: #e2e8f0;
        --color-gray-300: #cbd5e1;
        --color-gray-400: #94a3b8;
        --color-gray-500: #64748b;
        --color-gray-600: #475569;
        --color-gray-700: #334155;
        --color-gray-800: #1e293b;
        --color-gray-900: #0f172a;
      }

      /* Loading Spinner */
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--color-gray-200);
        border-left-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Card Styles */
      .insight-card {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border: 1px solid var(--color-gray-100);
      }

      .insight-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      }

      /* Glass Effect */
      .glass-effect {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Custom Scrollbar */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: var(--color-gray-300) transparent;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: var(--color-gray-300);
        border-radius: 3px;
      }

      /* Progress Bar */
      .progress-step {
        position: relative;
        z-index: 1;
      }

      .progress-step::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        width: 100%;
        height: 2px;
        background: var(--color-gray-200);
        transform: translateY(-50%);
      }

      .progress-step.active::after {
        background: var(--color-primary);
      }

      /* Animated Gradients */
      .animated-gradient {
        background: linear-gradient(
          45deg,
          var(--color-primary),
          var(--color-primary-dark),
          var(--color-primary)
        );
        background-size: 200% 200%;
        animation: gradient 15s ease infinite;
      }

      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .insight-card {
          padding: 1rem;
        }
      }

      @media (max-width: 768px) {
        #main-content {
          flex-direction: column;
        }

        #bill-preview-container,
        #insights-container {
          width: 100%;
          height: 50%;
        }
      }

      /* Chart Tooltips */
      .chart-tooltip {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(4px);
        border: 1px solid var(--color-gray-200) !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem !important;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
      }
    `;
  }

  renderBillPreview() {
    if (!this.billData) {
      console.error("Bill data is not available");
      this.renderError(document.getElementById("app"));
      return;
    }

    const billPreviewContainer = document.querySelector("#bill-preview");
    if (!billPreviewContainer) {
      console.error("Bill preview container not found");
      return;
    }

    const billPreview = new BillPreview(this.billData);
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
      <div class="h-full flex flex-col p-6">  <!-- Reduced padding from p-8 to p-6 -->
        <!-- Header Section - reduced margin -->
        <div class="flex items-center space-x-4 mb-4 opacity-0" id="insights-header">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"> <!-- Reduced from w-12 h-12 -->
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Bill Analysis</h2> <!-- Reduced from text-2xl -->
            <p class="text-sm text-gray-500">Understanding your energy consumption</p>
          </div>
        </div>
  
        <!-- Progress Tracker - reduced padding and margin -->
        <div class="glass-effect rounded-xl p-4 mb-4 opacity-0" id="progress-tracker"> <!-- Reduced padding and margin -->
          <div class="flex justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">1</div> <!-- Reduced from w-10 h-10 -->
              <div class="ml-3"> <!-- Reduced margin -->
                <p class="font-semibold text-gray-900">Bill Review</p>
                <p class="text-xs text-gray-500">Analyzing consumption patterns</p> <!-- Reduced from text-sm -->
              </div>
            </div>
            <div class="w-32 h-0.5 self-center bg-gray-200"></div>
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold">2</div>
              <div class="ml-3">
                <p class="font-semibold text-gray-400">Solar Quote</p>
                <p class="text-xs text-gray-400">Up next</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Consumption Analysis Card - reduced height -->
        <div class="insight-card p-4 mb-4 opacity-0" id="consumption-card"> <!-- Reduced padding and margin -->
          <div class="flex justify-between items-center mb-3"> <!-- Reduced margin -->
            <div>
              <h3 class="text-base font-semibold text-gray-900">Consumption Analysis</h3> <!-- Reduced from text-lg -->
              <p class="text-xs text-gray-500">Last 6 months trend</p>
            </div>
            <div class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              ${this.formatChange(trendData)}% vs last month
            </div>
          </div>
          <div class="h-48"> <!-- Reduced from h-64 -->
            <canvas id="consumption-trend-chart"></canvas>
          </div>
        </div>
  
        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 gap-4 mb-4"> <!-- Reduced gap and margin -->
          <!-- Current Bill Card -->
          <div class="insight-card p-4 opacity-0 consumption-metric"> <!-- Reduced padding -->
            <div class="flex items-center justify-between mb-2"> <!-- Reduced margin -->
              <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"> <!-- Reduced size -->
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="px-2 py-1 bg-green-50 text-green-600 text-sm rounded-full">Due in ${this.calculateDueDays()} days</span>
            </div>
            <p class="text-sm text-gray-500 mb-1">Current Bill</p>
            <p class="text-2xl font-bold text-gray-900">${this.formatCurrency(
              this.billData.totalAmount
            )}</p>
            <div class="mt-4 h-1 bg-gray-100 rounded">
              <div class="h-full bg-green-500 rounded" style="width: ${this.calculateBillProgress()}%"></div>
            </div>
          </div>
  
          <!-- Units Consumed Card -->
          <div class="insight-card p-6 opacity-0 consumption-metric">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span class="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                ${this.calculateEfficiency()} efficiency
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-1">Units Consumed</p>
            <p class="text-2xl font-bold text-gray-900">${
              this.billData.unitsConsumed
            } kWh</p>
            <p class="text-sm text-gray-500 mt-2">
              Rate: ${this.formatCurrency(this.billData.ratePerUnit)}/kWh
            </p>
          </div>
        </div>
  
        <!-- Next Steps Card -->
        <div class="mt-auto">
          <div class="insight-card p-4 opacity-0 relative" id="next-steps-card"> <!-- Reduced padding -->
            <div class="absolute -top-2 -right-2"> <!-- Adjusted position -->
              <div class="w-12 h-12 animated-gradient rounded-full flex items-center justify-center"> <!-- Reduced from w-16 h-16 -->
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="max-w-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Ready For Your Solar Quote?</h3> <!-- Reduced from text-xl -->
              <p class="text-sm text-gray-600 mb-4">
                We've analyzed your consumption patterns. Let's see how much you could save with solar energy!
              </p>
              <button 
                id="proceed-to-quote" 
                class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-medium
                       hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-lg
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
    `;

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
    const ctx = document.getElementById("consumption-trend-chart");
    if (!ctx) return;

    this.charts.consumption = new Chart(ctx, {
      type: "line",
      data: {
        labels: trendData.map((d) => d.month),
        datasets: [
          {
            label: "Consumption (kWh)",
            data: trendData.map((d) => d.consumption),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#3b82f6",
            pointBorderWidth: 2,
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
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
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
              callback: (value) => `${value} kWh`,
            },
          },
        },
      },
    });
  }

  startInsightAnimations() {
    gsap.to("#insights-header", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to("#progress-tracker", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.to("#consumption-card", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
    });

    gsap.to(".consumption-metric", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      delay: 0.6,
      ease: "power2.out",
    });

    gsap.to("#next-steps-card", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 1,
      ease: "power2.out",
    });
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
    if (quoteButton) {
      quoteButton.addEventListener("click", () => {
        window.router.push("/quote");
      });
    }
  }
}
