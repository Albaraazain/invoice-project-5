import { gsap } from "gsap";
import { getBillData }  from "../store/solarSizingState";
import { BillPreview } from "./BillPreview";

export class BillReviewPage {
    constructor() {
      this.billData = getBillData();
    }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="h-screen w-screen bg-white transition-colors duration-1000 overflow-hidden">
        <!-- Main Content -->
        <div class="h-full w-full flex relative">
          <!-- Bill Preview Side -->
          <div class="w-1/2 h-full" id="bill-preview-container">
            <div id="bill-preview" class="h-full"></div>
          </div>

          <!-- Insights Side -->
          <div class="w-1/2 h-full bg-gray-50 p-8 flex flex-col">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-800 mb-6">Bill Analysis</h2>
              
              <!-- Key Metrics -->
              <div class="space-y-6">
                ${this.renderKeyMetric(
                  "Monthly Consumption",
                  `${this.billData.unitsConsumed} kWh`,
                  "This is how much electricity you used last month"
                )}
                
                ${this.renderKeyMetric(
                  "Current Bill Amount",
                  `Rs. ${this.billData.totalAmount}`,
                  "Your total electricity charges including taxes"
                )}
                
                ${this.renderKeyMetric(
                  "Rate per Unit",
                  `Rs. ${this.billData.ratePerUnit}/kWh`,
                  "Your current electricity rate"
                )}
              </div>

              <!-- Analysis Summary -->
              <div class="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800 mb-3">What This Means</h3>
                <p class="text-gray-600">
                  Based on your consumption pattern, you could benefit from a solar installation.
                  Let's see how much you could save!
                </p>
              </div>
            </div>

            <!-- Next Button -->
            <div class="mt-6">
              <button 
                id="proceed-to-quote" 
                class="w-full bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors duration-300"
              >
                Generate My Solar Quote →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.renderBillPreview();
    this.initializeAnimations();
    }

    renderKeyMetric(title, value, description) {
        return `
        <div class="metric-card opacity-0">
          <div class="flex justify-between items-start">
            <h3 class="text-gray-600 font-medium">${title}</h3>
            <span class="text-xl font-bold text-gray-900">${value}</span>
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

    attachEventListeners() {
        const proceedButton = document.getElementById("proceed-to-quote");
        proceedButton.addEventListener("click", () => {
          window.router.push("/quote");
        });
    }

    initializeAnimations() {
        // Fade in metrics one by one
        gsap.fromTo(
          ".metric-card",
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out"
          }
        );
    
        // Animate the bill preview
        const billPreviewContainer = document.getElementById("bill-preview-container");
        gsap.fromTo(
          billPreviewContainer,
          { opacity: 0, scale: 0.95 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.8,
            ease: "power2.out"
          }
        );
      }

      addBaseStyles() {
        const style = document.createElement("style");
        style.textContent = `
          :root {
            --color-primary: #00a651;
            --color-primary-dark: #008c44;
          }
          
          .bg-primary { background-color: var(--color-primary); }
          .hover\\:bg-primary-dark:hover { background-color: var(--color-primary-dark); }
        `;
        document.head.appendChild(style);
      }


    
}