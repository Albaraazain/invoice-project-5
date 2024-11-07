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
          <div class="quote-result-page">
              <!-- Logo Section -->
              <div class="logo-section">
                  <svg class="logo-icon" viewBox="0 0 60 50">
                      <path d="M30,20 C25,10 35,0 45,10 L55,20 C65,30 55,40 45,30 Z" 
                          fill="#00a651"/>
                  </svg>
                  <div class="logo-text">
                      <h1>ENERGY COVE</h1>
                      <p>Energy for Life</p>
                  </div>
              </div>

              <div class="animation-container">
                  <!-- Bill Preview Section -->
                  <div class="bill-preview-container">
                      <div id="bill-preview"></div>
                  </div>

                  <!-- Loading Animation -->
                  <div class="loading-indicator">
                      <div class="processing-spinner"></div>
                      <p class="processing-text">Analyzing your bill...</p>
                  </div>

                  <!-- System Sizing Section -->
                  <div class="system-sizing-container">
                      <div id="system-sizing"></div>
                  </div>
              </div>

              <!-- Error Message -->
              <div class="error-message hidden">
                  <div class="error-content">
                      <svg class="error-icon" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                              fill="currentColor"/>
                      </svg>
                      <p>An error occurred. Please try again.</p>
                      <button id="retry-button">Try Again</button>
                  </div>
              </div>

              <!-- Decorative Waves -->
              <div class="wave-decoration">
                  <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                      <path d="M0,20 C200,0 400,40 600,20 S800,0 1200,20 L1200,120 L0,120 Z"
                          class="wave wave-1"/>
                      <path d="M0,40 C200,20 400,60 600,40 S800,20 1200,40 L1200,120 L0,120 Z"
                          class="wave wave-2"/>
                  </svg>
              </div>
          </div>
      `;

      this.attachStyles();

      if (this.error) {
          this.showError();
      } else {
          this.renderBillPreview();
          await this.startAnimation();
      }
  }

  async startAnimation() {
      if (this.error) {
          this.showError();
          return;
      }

      const quoteResultPage = document.querySelector(".quote-result-page");
      const billPreviewContainer = document.querySelector(".bill-preview-container");
      const systemSizingContainer = document.querySelector(".system-sizing-container");
      const loadingIndicator = document.querySelector(".loading-indicator");

      // Initial states
      gsap.set(billPreviewContainer, {
          opacity: 0,
          scale: 0.95,
          left: "50%",
          xPercent: -50,
          width: "47.5%"
      });
      gsap.set(systemSizingContainer, { 
          opacity: 0, 
          xPercent: 100,
          scale: 0.95
      });
      gsap.set(loadingIndicator, { 
          opacity: 0, 
          scale: 0.8,
          yPercent: -50
      });

      // Animation timeline
      const tl = gsap.timeline({
          defaults: { 
              duration: 0.8, 
              ease: "power3.out"
          }
      });

      await tl
          .to(billPreviewContainer, { 
              opacity: 1, 
              scale: 1, 
              duration: 1,
              ease: "power2.out"
          })
          .to(loadingIndicator, { 
              opacity: 1, 
              scale: 1, 
              duration: 0.5
          })
          .to(loadingIndicator, { 
              opacity: 0, 
              scale: 0.8, 
              delay: 1
          })
          .to(billPreviewContainer, {
              left: "0%",
              xPercent: 0,
              width: "50%",
              ease: "power3.inOut"
          }, "-=0.3")
          .to(systemSizingContainer, { 
              opacity: 1, 
              xPercent: 0,
              scale: 1,
              ease: "power3.out"
          }, "-=0.5")
          .to(quoteResultPage, { 
              backgroundColor: "var(--color-primary-light)", 
              duration: 1
          }, "-=0.5");

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

      // Enhanced error animation
      gsap.fromTo(
          ".error-content",
          { 
              scale: 0.8,
              opacity: 0,
              y: 20
          },
          { 
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "back.out(1.7)"
          }
      );
  }

  attachStyles() {
      const style = document.createElement("style");
      style.textContent = this.getStyles();
      document.head.appendChild(style);
  }

  getStyles() {
      return `
          :root {
              --color-primary: #00a651;
              --color-primary-dark: #008c44;
              --color-primary-light: rgba(0, 166, 81, 0.05);
              --color-yellow: #ffde17;
              --color-error: #ef4444;
          }

          .quote-result-page {
              min-height: 100vh;
              width: 100%;
              background-color: #ffffff;
              position: relative;
              overflow: hidden;
          }

          /* Logo Section */
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

          /* Container Styles */
          .animation-container {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100vh;
              position: relative;
              padding-top: 4rem;
          }

          .bill-preview-container,
          .system-sizing-container {
              position: absolute;
              height: calc(100% - 4rem);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 2rem;
          }

          #bill-preview,
          #system-sizing {
              width: 100%;
              height: 100%;
              background: white;
              border-radius: 1rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);
              overflow: auto;
              padding: 1.5rem;
          }

          /* Loading Animation */
          .loading-indicator {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              z-index: 10;
          }

          .processing-spinner {
              width: 60px;
              height: 60px;
              border: 4px solid var(--color-primary-light);
              border-left-color: var(--color-primary);
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 1rem;
          }

          .processing-text {
              color: var(--color-primary);
              font-size: 1.125rem;
              font-weight: 500;
          }

          /* Error Styles */
          .error-message {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 50;
          }

          .error-content {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              text-align: center;
              max-width: 400px;
              width: 90%;
          }

          .error-icon {
              width: 48px;
              height: 48px;
              margin-bottom: 1rem;
              color: var(--color-error);
          }

          .error-content p {
              margin-bottom: 1.5rem;
              color: #374151;
              font-size: 1.125rem;
          }

          #retry-button {
              background-color: var(--color-primary);
              color: white;
              border: none;
              padding: 0.75rem 2rem;
              border-radius: 9999px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
          }

          #retry-button:hover {
              background-color: var(--color-primary-dark);
              transform: translateY(-1px);
          }

          /* Wave Decoration */
          .wave-decoration {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 120px;
              overflow: hidden;
              z-index: 1;
          }

          .wave {
              fill: var(--color-primary);
          }

          .wave-1 {
              opacity: 0.3;
          }

          .wave-2 {
              opacity: 0.5;
              fill: var(--color-yellow);
          }

          /* Animations */
          @keyframes spin {
              to { transform: rotate(360deg); }
          }

          /* Responsive Design */
          @media (max-width: 768px) {
              .animation-container {
                  flex-direction: column;
                  padding-top: 6rem;
              }

              .bill-preview-container,
              .system-sizing-container {
                  position: relative;
                  width: 100%;
                  height: auto;
                  padding: 1rem;
              }

              .logo-section {
                  top: 1rem;
                  left: 1rem;
              }

              #bill-preview,
              #system-sizing {
                  max-height: 50vh;
              }
          }
      `;
  }
}