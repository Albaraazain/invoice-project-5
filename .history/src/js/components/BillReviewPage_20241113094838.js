// src/js/components/BillReviewPage.js
import { gsap } from "gsap";
import { getBillData } from "../store/solarSizingState.js";
import { BillPreview } from "./BillPreview.js";

export class BillReviewPage {
  constructor() {
    this.billData = getBillData();
  }

  render() {
    const app = document.getElementById("app");

    if (!this.billData) {
      this.renderError(app);
      return;
    }

    app.innerHTML = `
      <div class="h-screen w-screen bg-white transition-colors duration-1000 overflow-hidden">
        <!-- Main Content -->
        <div class="h-full w-full flex relative" id="main-content">
          <!-- Bill Preview Side -->
          <div class="w-1/2 h-full" id="bill-preview-container">
            <div id="bill-preview" class="h-full"></div>
          </div>

          <!-- Loading Indicator -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10" 
               id="loading-indicator">
            <div class="w-10 h-10 border-4 border-primary border-l-transparent rounded-full animate-spin mb-2"></div>
            <p class="text-primary font-medium">Analyzing your bill...</p>
          </div>

          <!-- Insights Side -->
          <div class="w-1/2 h-full bg-gradient-to-br from-gray-50 to-white p-8 flex flex-col" id="insights-container">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-8 opacity-0" id="page-header">
                <div class="w-1 h-8 bg-primary rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-800">Bill Analysis</h2>
              </div>
              
              <!-- Progress Bar -->
              <div class="mb-8 flex items-center justify-between text-sm opacity-0" id="progress-bar">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">1</div>
                  <div class="ml-3">
                    <p class="font-medium text-gray-800">Bill Review</p>
                    <p class="text-gray-500">Analyzing your consumption</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">2</div>
                  <div class="ml-3">
                    <p class="font-medium text-gray-400">Solar Quote</p>
                    <p class="text-gray-400">Up next</p>
                  </div>
                </div>
              </div>

              <!-- Key Metrics Grid -->
              <div class="grid grid-cols-2 gap-4 mb-8">
                ${this.renderKeyMetric(
                  "Monthly Consumption",
                  `${this.billData.unitsConsumed}`,
                  "kWh",
                  "This is how much electricity you used last month",
                  "lightning-bolt"
                )}
                
                ${this.renderKeyMetric(
                  "Current Bill",
                  `${this.billData.totalAmount}`,
                  "Rs.",
                  "Your total electricity charges including taxes",
                  "cash"
                )}
                
                ${this.renderKeyMetric(
                  "Rate per Unit",
                  `${this.billData.ratePerUnit}`,
                  "Rs/kWh",
                  "Your current electricity rate",
                  "chart-bar"
                )}
                
                ${this.renderKeyMetric(
                  "Bill Due Date",
                  `${this.billData.dueDate}`,
                  "",
                  "Make sure to pay before this date",
                  "calendar"
                )}
              </div>

              <!-- Next Step Card -->
              <div class="relative mt-auto p-6 bg-white rounded-2xl shadow-sm opacity-0 border border-gray-100" id="next-step-card">
                <div class="absolute -top-3 -right-3 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Ready For Your Solar Quote?</h3>
                <p class="text-gray-600 mb-4">
                  We've analyzed your bill. Now let's see how much you could save with solar!
                </p>
                <button 
                  id="proceed-to-quote" 
                  class="w-full bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3.5 rounded-xl font-medium hover:from-primary-dark hover:to-primary-dark transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Generate My Solar Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.renderBillPreview();
    this.startAnimation();
  }

  renderKeyMetric(title, value, unit, description, icon) {
    const icons = {
      "lightning-bolt": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
      cash: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
      "chart-bar": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
      calendar: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />`,
    };

    return `
      <div class="metric-card opacity-0 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icons[icon]}
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-600">${title}</h3>
          </div>
        </div>
        <div class="flex items-baseline space-x-1">
          <span class="text-2xl font-bold text-gray-900">${value}</span>
          <span class="text-sm font-medium text-gray-500">${unit}</span>
        </div>
        <p class="text-sm text-gray-500 mt-1">${description}</p>
      </div>
    `;
  }

  renderBillPreview() {
    const billPreviewContainer = document.querySelector("#bill-preview");
    const billPreview = new BillPreview(this.billData);
    billPreview.render(billPreviewContainer);
  }

  async startAnimation() {
    const billPreviewContainer = document.getElementById(
      "bill-preview-container"
    );
    const loadingIndicator = document.getElementById("loading-indicator");
    const insightsContainer = document.getElementById("insights-container");
    const metrics = document.querySelectorAll(".metric-card");
    const nextStepCard = document.getElementById("next-step-card");
    const pageTitle = document.querySelector("h2");

    // Initial states
    gsap.set(
      [
        billPreviewContainer,
        loadingIndicator,
        metrics,
        nextStepCard,
        pageTitle,
      ],
      {
        opacity: 0,
      }
    );
    gsap.set(billPreviewContainer, {
      scale: 0.9,
      position: "absolute",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      width: "47.5%",
    });

    // Animation sequence
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
      // Fade in insights section
      .to(pageTitle, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      })
      .to(metrics, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.5,
      })
      .to(nextStepCard, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      });
  }

  attachEventListeners() {
    const proceedButton = document.getElementById("proceed-to-quote");
    proceedButton.addEventListener("click", () => {
      window.router.push("/quote");
    });
  }
}
