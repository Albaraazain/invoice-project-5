import { gsap } from "gsap";
import { getBillData, getError } from "../store/solarSizingState.js";
import { BillPreview } from "./BillPreview.js";
import { SystemSizing } from "./SystemSizing.js";
import { CountUp } from "countup.js";

export class QuoteResultPage {
  constructor() {
    try {
      this.billData = getBillData();
      this.error = getError();
    } catch (error) {
      console.error("Error in QuoteResultPage constructor:", error);
      this.error = "Failed to load bill data. Please try again.";
    }
    this.systemSizing = null;
  }

  async render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="h-screen w-screen bg-white transition-colors duration-1000 overflow-hidden" id="quote-result-page">
        <!-- Logo Section -->
        <div class="absolute top-8 left-12 flex items-center gap-2 z-10">
          <svg class="w-12 h-12" viewBox="0 0 60 50">
            <path d="M30,20 C25,10 35,0 45,10 L55,20 C65,30 55,40 45,30 Z" 
                fill="#00a651"/>
          </svg>
          <div>
            <h1 class="text-2xl font-bold text-primary">ENERGY COVE</h1>
            <p class="text-sm italic text-gray-600">Energy for Life</p>
          </div>
        </div>

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

          <!-- System Sizing Side -->
          <div class="w-1/2 h-full" id="system-sizing-container">
            <div id="system-sizing" class="h-full"></div>
          </div>
        </div>

        <!-- Error Message -->
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-20 text-center hidden"
             id="error-message">
          <p class="text-error mb-4">An error occurred. Please try again.</p>
          <button class="bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-dark transition-colors"
                  id="retry-button">
            Retry
          </button>
        </div>
      </div>
    `;

    this.addBaseStyles();

    if (this.error) {
      this.showError();
    } else {
      this.renderBillPreview();
      await this.startAnimation();
    }
  }

  addBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --color-primary: #00a651;
        --color-primary-dark: #008c44;
        --color-error: #ef4444;
        --color-bg-secondary: #f8fafc;
      }
      
      .text-primary { color: var(--color-primary); }
      .bg-primary { background-color: var(--color-primary); }
      .hover\\:bg-primary-dark:hover { background-color: var(--color-primary-dark); }
      .border-primary { border-color: var(--color-primary); }
      .text-error { color: var(--color-error); }

      @media (max-width: 768px) {
        .h-screen {
          height: 100dvh;
        }
        
        #main-content {
          flex-direction: column;
        }
        
        #bill-preview-container,
        #system-sizing-container {
          width: 100% !important;
          height: 50% !important;
        }
        
        .absolute.top-8.left-12 {
          top: 1rem;
          left: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  renderBillPreview() {
    if (!this.billData) {
      console.error("Bill data is not available");
      this.showError();
      return;
    }
    const billPreviewContainer = document.querySelector("#bill-preview");
    const billPreview = new BillPreview(this.billData);
    billPreview.render(billPreviewContainer);
  }

  renderSystemSizing() {
    if (!this.billData) {
      console.error("Bill data is not available");
      this.showError();
      return;
    }
    const systemSizingContainer = document.querySelector("#system-sizing");
    if (this.systemSizing) {
      this.systemSizing.cleanup();
    }
    this.systemSizing = new SystemSizing(this.billData);
    this.systemSizing.render(systemSizingContainer);
  }

  async startAnimation() {
    if (this.error) {
      this.showError();
      return;
    }

    const billPreviewContainer = document.getElementById("bill-preview-container");
    const systemSizingContainer = document.getElementById("system-sizing-container");
    const loadingIndicator = document.getElementById("loading-indicator");
    const quoteResultPage = document.getElementById("quote-result-page");

    // Initial states
    gsap.set([billPreviewContainer, systemSizingContainer, loadingIndicator], {
      opacity: 0
    });
    gsap.set(billPreviewContainer, {
      scale: 0.9,
      left: "50%",
      xPercent: -50,
      width: "47.5%"
    });
    gsap.set(systemSizingContainer, {
      xPercent: 100
    });
    gsap.set(loadingIndicator, {
      scale: 0.5
    });

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power2.out" }
    });

    // Animation sequence
    await tl
      .to(billPreviewContainer, {
        opacity: 1,
        scale: 1,
        duration: 1
      })
      .to(loadingIndicator, {
        opacity: 1,
        scale: 1,
        duration: 0.5
      })
      .to(loadingIndicator, {
        opacity: 0,
        scale: 0.5,
        delay: 1
      })
      .to(billPreviewContainer, {
        left: "0%",
        xPercent: 0,
        width: "50%"
      }, "-=0.3")
      .to(systemSizingContainer, {
        opacity: 1,
        xPercent: 0
      }, "-=0.5")
      .to(quoteResultPage, {
        backgroundColor: "var(--color-bg-secondary)",
        duration: 1
      }, "-=0.5");

    // Render system sizing after animations
    this.renderSystemSizing();

    if (this.systemSizing) {
      await this.systemSizing.animateAll();
    }
  }

  showError() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.classList.remove("hidden");

    const retryButton = document.getElementById("retry-button");
    retryButton.addEventListener("click", () => {
      window.router.push("/");
    });

    gsap.fromTo(
      errorMessage,
      { x: -10 },
      { x: 10, duration: 0.1, repeat: 5, yoyo: true }
    );
  }
}