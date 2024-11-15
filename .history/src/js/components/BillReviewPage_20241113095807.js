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

  render() {
    const app = document.getElementById("app");

    if (!this.billData) {
      this.renderError(app);
      return;
    }

    app.innerHTML = `
      <div class="h-screen w-screen bg-slate-50 transition-colors duration-1000 overflow-hidden">
        <!-- Main Content -->
        <div class="h-full w-full flex relative" id="main-content">
          <!-- Bill Preview Side -->
          <div class="w-1/2 h-full" id="bill-preview-container">
            <div id="bill-preview" class="h-full"></div>
          </div>

          <!-- Loading Indicator -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10" 
               id="loading-indicator">
            <div class="loading-spinner"></div>
            <p class="text-primary font-medium mt-4">Analyzing your bill...</p>
          </div>

          <!-- Insights Side -->
          <div class="w-1/2 h-full" id="insights-container">
          </div>
        </div>
      </div>
    `;

    this.attachBaseStyles();
    this.renderBillPreview();
    this.renderInsights();
    this.startAnimation();
  }

  attachBaseStyles() {
    const style = document.createElement('style');
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