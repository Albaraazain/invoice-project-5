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
        <div class="animation-container">
          <div class="bill-preview-container">
            <div id="bill-preview"></div>
          </div>
          <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Analyzing your bill...</p>
          </div>
          <div class="system-sizing-container">
            <div id="system-sizing"></div>
          </div>
        </div>
        <div class="error-message hidden">
          <p>An error occurred. Please try again.</p>
          <button id="retry-button">Retry</button>
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
                border-left-color: var(--color-tint);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .error-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: var(--color-bg);
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
                background-color: var(--color-tint);
                color: var(--color-bg);
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            #retry-button:hover {
                background-color: var(--color-brand-lavender);
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
            }
        `;
    document.head.appendChild(style);
  }
}
