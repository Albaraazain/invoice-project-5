// ReferenceInputPage.js

import {
  fetchBillData,
  getIsLoading,
  getError,
} from "../store/solarSizingState.js";
import { gsap } from "gsap";

export class ReferenceInputPage {
  constructor() {
    // Form data
    this.state = {
      provider: "",
      referenceNumber: "",
      phone: "",
      isLoading: false,
      error: null,
      validationErrors: {
        provider: "",
        referenceNumber: "",
        phone: "",
      },
    };

    // Constants for validation
    this.VALIDATION_RULES = {
      provider: {
        required: true,
        minLength: 2,
        message: "Please select a valid electricity provider",
      },
      referenceNumber: {
        required: true,
        pattern: /^[0-9]{10,14}$/,
        message: "Please enter a valid reference number (10-14 digits)",
      },
      phone: {
        required: true,
        pattern: /^\+?[0-9]{10,14}$/,
        message: "Please enter a valid phone number",
      },
    };

    // Available electricity providers
    this.PROVIDERS = [
      "MEPCO",
      "LESCO",
      "IESCO",
      "GEPCO",
      "FESCO",
      "PESCO",
      "QESCO",
      "SEPCO",
      "K-Electric",
    ];

    // Bind methods
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.showToast = this.showToast.bind(this);
  }

  /**
   * Initialize the page
   */
  async init() {
    await this.render();
    this.attachEventListeners();
    this.initializeAnimations();
  }

  /**
   * Shows a toast message
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info)
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container =
      document.querySelector(".toast-container") || this.createToastContainer();
    container.appendChild(toast);

    // Animate toast
    gsap.fromTo(
      toast,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    // Remove toast after delay
    setTimeout(() => {
      gsap.to(toast, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => toast.remove(),
      });
    }, 3000);
  }

  /**
   * Creates a container for toast messages
   * @returns {HTMLElement} Toast container element
   */
  createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
  }

  /**
   * Updates the loading state of the form
   * @param {boolean} isLoading - Whether the form is loading
   */
  setLoading(isLoading) {
    this.state.isLoading = isLoading;
    const submitButton = document.querySelector(".submit-button");
    const loadingSpinner = document.querySelector(".loading-spinner");

    if (submitButton && loadingSpinner) {
      if (isLoading) {
        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "Processing...";
        loadingSpinner.style.display = "inline-block";
      } else {
        submitButton.disabled = false;
        submitButton.querySelector("span").textContent = "Generate";
        loadingSpinner.style.display = "none";
      }
    }
  }

  /**
   * Creates a loading spinner element
   * @returns {HTMLElement} Spinner element
   */
  createLoadingSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    spinner.innerHTML = `
            <svg viewBox="0 0 50 50" class="spinner-svg">
                <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        `;
    return spinner;
  }

  /**
   * Renders the page content
   */
  async render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="sap_form">
          ${this.renderHeader()}
          ${this.renderMainContent()}
          ${this.renderWaveDecoration()}
      </div>
      ${this.renderStyles()}
  `;
  }
}
