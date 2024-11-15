// src/js/components/BillReview/BillReviewPage.js
import { html, render } from "lit-html";
import { getBillData } from "../../store/solarSizingState.js";
import { CountUp } from "countup.js"; // Add this import
import Chart from "chart.js/auto"; // Add this if not already imported
import { gsap } from "gsap"; // Add this if not already imported
import { initializeMobileInteractions } from "./utils/MobileInteractions";
import { initializeConsumptionChart } from "./utils/chartconfig";
import {
  formatCurrency,
  formatChange,
  calculateDueDays,
} from "./utils/formatters";
import { Header } from "./components/Header";
import { ConsumptionChart } from "./components/ConsumptionChart";
import { MetricsCard } from "./components/MetricsCard";
import { SolarQuoteCard } from "./components/SolarQuoteCard";
import "./styles/base.css";

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

  isMobileDevice() {
    return window.innerWidth < 768;
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
    return this.billData.unitsConsumed <= avgConsumption ? "High" : "Low";
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
    const values = [];
    const labels = [];

    for (let i = 5; i >= 0; i--) {
      let monthIndex = (currentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
      let variation = this.billData.unitsConsumed * (0.8 + Math.random() * 0.4);
      values.push(Math.round(variation));
    }

    return {
      labels,
      values,
      change: this.calculateTrendChange(values),
    };
  }

  calculateTrendChange(values) {
    if (values.length < 2) return 0;
    const lastTwo = values.slice(-2);
    const change = ((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100;
    return formatChange(change);
  }

  render() {
    const app = document.getElementById("app");
    const trendData = this.generateTrendData();

    const template = html`
      <div
        class="h-screen w-full overflow-hidden bg-white transition-colors duration-1000 opacity-0"
        id="quote-result-page"
      >
        <div
          class="h-full w-full flex flex-col md:flex-row relative"
          id="main-content"
        >
          <!-- Bill Preview Side -->
          <div
            class="w-full md:w-1/2 h-[45vh] md:h-full overflow-hidden opacity-0"
            id="bill-preview-container"
          >
            <div id="bill-preview" class="h-full"></div>
          </div>

          <!-- Loading Indicator -->
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10"
            id="loading-indicator"
          >
            <div class="loading-spinner"></div>
            <p class="text-emerald-600 font-medium">Analyzing your bill...</p>
          </div>

          <!-- Insights Container -->
          <div
            class="fixed md:relative w-full md:w-1/2 h-[60vh] md:h-full bg-gray-50 rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none"
            id="insights-container"
            style="bottom: 0;"
          >
            <!-- Drag Handle for mobile -->
            <div class="md:hidden w-full flex justify-center py-2 drag-handle">
              <div class="w-12 h-1.5 rounded-full bg-gray-300"></div>
            </div>

            <div
              class="h-full flex flex-col p-4 sm:p-6 overflow-auto hide-scrollbar"
            >
              ${Header()}

              <!-- Main Content -->
              <div class="flex-1 flex flex-col min-h-0 mt-3">
                ${ConsumptionChart(trendData)}

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  ${MetricsCard({
                    type: "bill",
                    title: "Current Bill",
                    value: formatCurrency(this.billData.amount),
                    badge: `Due in ${calculateDueDays(
                      this.billData.dueDate
                    )} days`,
                    progress: this.calculateBillProgress(),
                  })}
                  ${MetricsCard({
                    type: "consumption",
                    title: "Units Consumed",
                    value: `${this.billData.unitsConsumed} kWh`,
                    badge: `${this.calculateEfficiency()} efficiency`,
                    subtitle: `Rate: ${formatCurrency(
                      this.billData.ratePerUnit
                    )}/kWh`,
                  })}
                </div>

                ${SolarQuoteCard()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    render(template, app);
    this.afterRender();
  }

  attachEventListeners() {
    // Add logging to verify the button exists
    const quoteButton = document.getElementById("proceed-to-quote");
    console.log("Quote button found:", quoteButton);

    if (quoteButton) {
      console.log("Adding click event listener to quote button");
      quoteButton.addEventListener("click", () => {
        console.log("Quote button clicked");
        window.router.push("/quote");
      });
    } else {
      console.error("Quote button not found in DOM");
    }
  }

  afterRender() {
    requestAnimationFrame(() => {
      if (this.isMobileDevice()) {
        initializeMobileInteractions(
          document.getElementById("insights-container")
        );
      }
      this.initializeCharts();
      this.initializeCountUps();
      this.startAnimation();

      // Add logging to verify afterRender is called
      console.log("afterRender called, attaching event listeners");
      this.attachEventListeners();
    });
  }

  initializeCharts() {
    const chartCanvas = document.getElementById("consumption-trend-chart");
    if (!chartCanvas) {
      console.error("Chart canvas not found");
      return;
    }

    const ctx = chartCanvas.getContext("2d");
    const isMobile = this.isMobileDevice();

    if (this.charts.consumption) {
      this.charts.consumption.destroy();
    }

    this.charts.consumption = initializeConsumptionChart(
      ctx,
      this.generateTrendData(),
      isMobile
    );
  }

  initializeCountUps() {
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

  async startAnimation() {
    const elements = {
      container: document.getElementById("quote-result-page"),
      billPreview: document.getElementById("bill-preview-container"),
      loadingIndicator: document.getElementById("loading-indicator"),
      header: document.getElementById("insights-header"),
      progress: document.getElementById("progress-tracker"),
      consumption: document.getElementById("consumption-card"),
      metrics: document.querySelectorAll(".consumption-metric"),
      nextSteps: document.getElementById("next-steps-card"),
    };

    // Initial setup
    elements.container.classList.remove("opacity-0");

    const timeline = gsap.timeline({
      defaults: { duration: 0.6, ease: "power2.out" },
    });

    // Animate bill preview
    timeline.to(elements.billPreview, {
      opacity: 1,
      y: 0,
    });

    // Show and hide loading indicator
    timeline
      .to(elements.loadingIndicator, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
      })
      .to(elements.loadingIndicator, {
        opacity: 0,
        scale: 0.5,
        delay: 0.5,
      });

    // Animate insights elements
    timeline
      .to([elements.header, elements.progress], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
      })
      .to(elements.consumption, {
        opacity: 1,
        y: 0,
      })
      .to(elements.metrics, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        onComplete: () => this.startCountUps(),
      })
      .to(elements.nextSteps, {
        opacity: 1,
        y: 0,
      });
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.charts.consumption) {
        this.charts.consumption.resize();
      }
    }, 250);
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.charts.consumption) {
      this.charts.consumption.destroy();
    }
  }
}
