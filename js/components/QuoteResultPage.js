// js/components/QuoteResultPage.js
import { gsap } from "gsap";
import { getBillData, getError } from "../store/solarSizingState.js";
import { BillPreview } from "./BillPreview.js";
import { SystemSizing } from "./SystemSizing.js";

export class QuoteResultPage {
  constructor() {
    try {
      this.billData = getBillData();
      this.error = getError();
    } catch (error) {
      console.error("Error in QuoteResultPage constructor:", error);
      this.error = "Failed to load bill data. Please try again.";
    }
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
            <div class="quote-result-page">
                <div class="animation-container">
                    <div class="bill-preview-container">
                        <div id="bill-preview" class="content-fade"></div>
                    </div>
                    <div class="loading-indicator">
                        <div class="spinner"></div>
                        <p>Analyzing your bill...</p>
                    </div>
                    <div class="system-sizing-container">
                        <div id="system-sizing" class="content-fade"></div>
                    </div>
                </div>
                <div class="error-message hidden">
                    <p>An error occurred. Please try again.</p>
                    <button id="retry-button">Retry</button>
                </div>
            </div>
        `;

    if (this.error) {
      this.showError();
    } else {
      this.renderBillPreview();
      this.renderSystemSizing();
      this.startAnimation();
    }

    this.attachStyles();
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
    const systemSizing = new SystemSizing(this.billData);
    systemSizing.render(systemSizingContainer);
  }

  startAnimation() {
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
    const billPreviewContent = document.querySelector("#bill-preview");
    const systemSizingContent = document.querySelector("#system-sizing");

    // Set initial states
    gsap.set(billPreviewContainer, {
      scale: 0.5,
      opacity: 0,
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(loadingIndicator, { opacity: 0, y: 20 });
    gsap.set(systemSizingContainer, { opacity: 0, x: "100%" });

    // Animation timeline
    const tl = gsap.timeline();

    // Pop up bill in the center
    tl.to(billPreviewContainer, {
      duration: 0.5,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
    });

    // Show loading indicator
    tl.to(
      loadingIndicator,
      {
        duration: 0.3,
        opacity: 1,
        y: 0,
      },
      "+=0.5"
    );

    // Simulate fetching (pause)
    tl.to({}, { duration: 2 });

    // Hide loading indicator
    tl.to(loadingIndicator, {
      duration: 0.3,
      opacity: 0,
      y: -20,
    });

    // Move bill to the left
    tl.to(billPreviewContainer, {
      duration: 0.8,
      left: "25%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      ease: "power2.inOut",
    });

    // Show system sizing on the right
    tl.to(
      systemSizingContainer,
      {
        duration: 0.8,
        opacity: 1,
        x: "0%",
        ease: "power2.inOut",
      },
      "-=0.6"
    );

    // Fade in system sizing content
    tl.to(systemSizingContent, {
      duration: 0.5,
      opacity: 1,
    });

    // Change background color
    tl.to(
      quoteResultPage,
      {
        duration: 1,
        backgroundColor: "var(--color-bg-secondary)",
        ease: "power2.inOut",
      },
      "-=1"
    );
  }
  showError() {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.classList.remove("hidden");

    const retryButton = document.querySelector("#retry-button");
    retryButton.addEventListener("click", () => {
      window.router.push("/");
    });
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .quote-result-page {
                height: 100vh;
                width: 100vw;
                overflow: hidden;
                background-color: var(--color-bg);
                transition: background-color 1s ease-in-out;
                position: relative;
            }

            .animation-container {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            .bill-preview-container,
            .system-sizing-container {
                position: absolute;
                width: 50%;
                height: 100%;
            }

            .bill-preview-container {
                z-index: 2;
            }

            .system-sizing-container {
                right: 0;
                z-index: 1;
            }

            .loading-indicator {
                position: absolute;
                left: 50%;
                top: 60%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 3;
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

            .hidden {
                display: none;
            }

            .error-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                background-color: var(--color-bg);
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 4;
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

            @media (max-width: 768px) {
                .bill-preview-container,
                .system-sizing-container {
                    width: 100%;
                    height: 50%;
                }

                .system-sizing-container {
                    top: 50%;
                    right: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
}
