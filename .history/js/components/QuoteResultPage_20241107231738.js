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
      <div class="h-screen w-screen bg-white transition-colors duration-1000 overflow-hidden">
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
        <div class="h-full flex relative">
          <!-- Bill Preview Side -->
          <div class="w-1/2 h-full transition-all duration-800 ease-out transform" 
               id="bill-preview-wrapper">
            <div id="bill-preview" class="h-full"></div>
          </div>

          <!-- Loading Indicator -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 scale-50 transition-all duration-500"
               id="loading-indicator">
            <div class="w-10 h-10 border-4 border-primary border-l-transparent rounded-full animate-spin mb-2"></div>
            <p class="text-primary font-medium">Analyzing your bill...</p>
          </div>

          <!-- System Sizing Side -->
          <div class="w-1/2 h-full transition-all duration-800 ease-out transform translate-x-full"
               id="system-sizing-wrapper">
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

    // Add Tailwind colors and other essential styles
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
      }
      
      .text-primary { color: var(--color-primary); }
      .bg-primary { background-color: var(--color-primary); }
      .hover\\:bg-primary-dark:hover { background-color: var(--color-primary-dark); }
      .border-primary { border-color: var(--color-primary); }
      .text-error { color: var(--color-error); }

      @media (max-width: 768px) {
        .h-screen {
          height: 100dvh; /* Use dynamic viewport height for mobile */
        }
        
        /* Stack the preview and sizing sections vertically on mobile */
        #bill-preview-wrapper,
        #system-sizing-wrapper {
          width: 100% !important;
          height: 50% !important;
        }
        
        /* Adjust the layout container */
        .flex.relative {
          flex-direction: column;
        }
        
        /* Adjust logo position */
        .absolute.top-8.left-12 {
          top: 1rem;
          left: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async startAnimation() {
    const billPreviewWrapper = document.getElementById("bill-preview-wrapper");
    const systemSizingWrapper = document.getElementById(
      "system-sizing-wrapper"
    );
    const loadingIndicator = document.getElementById("loading-indicator");

    // Show bill preview
    billPreviewWrapper.style.opacity = "1";
    await this.delay(800);

    // Show loading
    loadingIndicator.style.opacity = "1";
    loadingIndicator.style.transform = "translate(-50%, -50%) scale(1)";
    await this.delay(1500);

    // Hide loading
    loadingIndicator.style.opacity = "0";
    loadingIndicator.style.transform = "translate(-50%, -50%) scale(0.5)";
    await this.delay(300);

    // Move bill preview and show system sizing
    document.body.style.backgroundColor = "#f8fafc";
    systemSizingWrapper.style.transform = "translateX(0)";

    // Render system sizing content
    this.renderSystemSizing();

    if (this.systemSizing) {
      await this.systemSizing.animateAll();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    // Keep the exact same animation logic
    if (this.error) {
      this.showError();
      return;
    }

    const quoteResultPage = document.querySelector(".quote-result-page");
    const billPreviewContainer = document.querySelector(
      ".bill-preview-container"
    );
    const systemSizingContainer = document.querySelector(
      ".system-sizing-container"
    );
    const loadingIndicator = document.querySelector(".loading-indicator");

    gsap.set(billPreviewContainer, {
      opacity: 0,
      scale: 0.9,
      left: "50%",
      xPercent: -50,
      width: "47.5%",
    });
    gsap.set(systemSizingContainer, { opacity: 0, xPercent: 100 });
    gsap.set(loadingIndicator, { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power2.out" },
    });

    await tl
      .to(billPreviewContainer, { opacity: 1, scale: 1, duration: 1 })
      .to(loadingIndicator, { opacity: 1, scale: 1, duration: 0.5 })
      .to(loadingIndicator, { opacity: 0, scale: 0.5, delay: 1 })
      .to(
        billPreviewContainer,
        {
          left: "0%",
          xPercent: 0,
          width: "50%",
        },
        "-=0.3"
      )
      .to(systemSizingContainer, { opacity: 1, xPercent: 0 }, "-=0.5")
      .to(
        quoteResultPage,
        { backgroundColor: "var(--color-bg-secondary)", duration: 1 },
        "-=0.5"
      );

    this.renderSystemSizing();

    if (this.systemSizing) {
      await this.systemSizing.animateAll();
    }
  }

  showError() {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.classList.remove("hidden");

    const retryButton = document.querySelector("#retry-button");
    retryButton.addEventListener("click", () => {
      window.router.push("/");
    });

    gsap.fromTo(
      errorMessage,
      { x: -10 },
      { x: 10, duration: 0.1, repeat: 5, yoyo: true }
    );
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
          :root {
              --color-primary: #00a651;
              --color-primary-dark: #008c44;
              --color-bg: #ffffff;
              --color-bg-secondary: #f8fafc;
              --color-error: #ef4444;
              --color-tint: #00a651;
          }

          .quote-result-page {
              height: 100vh;
              width: 100vw;
              background-color: var(--color-bg);
              transition: background-color 1s ease;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
          }

          /* Added Logo Styles */
          .logo-section {
              position: absolute;
              top: 2rem;
              left: 3rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              z-index: 10;
          }

          .logo-icon {
              width: 3rem;
              height: 3rem;
          }

          .logo-text h1 {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--color-primary);
          }

          .logo-text p {
              font-size: 0.875rem;
              font-style: italic;
              color: #666;
          }

          /* Keep existing container styles */
          .animation-container {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              position: relative;
          }

          .bill-preview-container,
          .system-sizing-container {
              position: absolute;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
          }

          .bill-preview-container {
              left: 0;
              width: 50%;
          }

          .system-sizing-container {
              right: 0;
              width: 50%;
          }

          #bill-preview,
          #system-sizing {
              width: 100%;
              height: 100%;
              overflow: auto;
              padding: 1rem;
              box-sizing: border-box;
              background: white;
              border-radius: 0.5rem;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .loading-indicator {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              z-index: 10;
          }

          .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid rgba(0, 0, 0, 0.1);
              border-left-color: var(--color-primary);
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 10px;
          }

          .loading-indicator p {
              color: var(--color-primary);
              font-weight: 500;
          }

          @keyframes spin {
              to { transform: rotate(360deg); }
          }

          .error-message {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 20;
              text-align: center;
          }

          .error-message p {
              margin-bottom: 15px;
              color: var(--color-error);
          }

          #retry-button {
              background-color: var(--color-primary);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 9999px;
              cursor: pointer;
              transition: all 0.2s ease;
          }

          #retry-button:hover {
              background-color: var(--color-primary-dark);
          }

          .hidden {
              display: none;
          }

          @media (max-width: 768px) {
              .animation-container {
                  flex-direction: column;
              }

              .bill-preview-container,
              .system-sizing-container {
                  width: 100%;
                  height: 50%;
              }

              .bill-preview-container {
                  top: 0;
              }

              .system-sizing-container {
                  bottom: 0;
              }

              .logo-section {
                  top: 1rem;
                  left: 1rem;
              }
          }
      `;
    document.head.appendChild(style);
  }
}
