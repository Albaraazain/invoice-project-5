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

  /**
   * Renders the header section with logo
   */
  renderHeader() {
    return `
      <header class="header">
          <div class="container">
              <div class="logo-section">
                  ${this.renderLogo()}
                  <div class="logo-text">
                      <h1>ENERGY COVE</h1>
                      <p>Energy for Life</p>
                  </div>
              </div>
              ${this.renderHeaderContacts()}
          </div>
      </header>
  `;
  }

  /**
   * Renders the logo SVG
   */
  renderLogo() {
    return `
      <svg class="logo-icon" viewBox="0 0 60 50" width="60" height="50">
          <path 
              d="M30,20 C25,10 35,0 45,10 L55,20 C65,30 55,40 45,30 Z" 
              fill="#00a651"
          />
      </svg>
  `;
  }

  /**
   * Renders the header contact information
   */
  renderHeaderContacts() {
    return `
      <div class="header-contacts">
          <!-- Mobile Contacts -->
          <div class="mobile-contacts md:hidden">
              <a href="tel:+923001234567" class="contact-icon" aria-label="Call us">
                  ${this.renderPhoneIcon()}
              </a>
              <a href="mailto:info@energycove.pk" class="contact-icon" aria-label="Email us">
                  ${this.renderEmailIcon()}
              </a>
              <a href="https://wa.me/923001234567" class="contact-icon" aria-label="WhatsApp">
                  ${this.renderWhatsAppIcon()}
              </a>
          </div>
          
          <!-- Desktop Contacts -->
          <div class="desktop-contacts hidden md:block">
              <div class="contact-label">Contact us</div>
              <div class="contact-info">
                  <a href="https://wa.me/923001234567">WhatsApp</a>
                  <a href="mailto:info@energycove.pk">info@energycove.pk</a>
              </div>
          </div>
      </div>
  `;
  }

  /**
   * Renders the main content section
   */
  renderMainContent() {
    return `
      <main class="main-content">
          <div class="container">
              <div class="content-grid">
                  <!-- Left Section: Form -->
                  <div class="form-section">
                      <h2 class="form-title animate-slide-up">
                          Get your solar quote
                      </h2>
                      ${this.renderForm()}
                  </div>

                  <!-- Right Section: Info -->
                  <div class="info-section">
                      <div class="info-content animate-fade-in">
                          <h3>
                              Our AI tool quickly provides
                              the ideal system size and
                              savings estimate—no
                              in-person consultation
                              needed. Get the fastest
                              solar quote in Pakistan!
                          </h3>
                          <div class="powered-by">POWERED BY AI</div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
  `;
  }

  /**
   * Renders the form element
   */
  renderForm() {
    return `
      <form id="quote-form" class="quote-form animate-fade-in" novalidate>
          ${this.renderProviderField()}
          ${this.renderReferenceNumberField()}
          ${this.renderPhoneField()}
          ${this.renderSubmitButton()}
      </form>
  `;
  }

  /**
   * Renders the provider selection field
   */
  renderProviderField() {
    const { provider } = this.state;
    const error = this.state.validationErrors.provider;

    return `
      <div class="form-group ${error ? "has-error" : ""}">
          <label for="provider" class="form-label">
              Choose your electricity Provider
          </label>
          <select 
              id="provider" 
              name="provider"
              class="form-select"
              required
              value="${provider}"
          >
              <option value="">Select Provider</option>
              ${this.PROVIDERS.map(
                (p) => `
                  <option value="${p}" ${provider === p ? "selected" : ""}>
                      ${p}
                  </option>
              `
              ).join("")}
          </select>
          ${error ? `<div class="error-message">${error}</div>` : ""}
      </div>
  `;
  }

  /**
   * Renders the reference number input field
   */
  renderReferenceNumberField() {
    const { referenceNumber } = this.state;
    const error = this.state.validationErrors.referenceNumber;

    return `
      <div class="form-group ${error ? "has-error" : ""}">
          <label for="referenceNumber" class="form-label">
              Enter your bill reference number
          </label>
          <input 
              type="text" 
              id="referenceNumber"
              name="referenceNumber"
              class="form-input"
              required
              pattern="[0-9]{10,14}"
              value="${referenceNumber}"
              placeholder="e.g., 1234567890"
          />
          ${error ? `<div class="error-message">${error}</div>` : ""}
      </div>
  `;
  }

  /**
   * Renders the phone number input field
   */
  renderPhoneField() {
    const { phone } = this.state;
    const error = this.state.validationErrors.phone;

    return `
      <div class="form-group ${error ? "has-error" : ""}">
          <label for="phone" class="form-label">
              Enter your WhatsApp phone number
          </label>
          <input 
              type="tel" 
              id="phone"
              name="phone"
              class="form-input"
              required
              pattern="[+]?[0-9]{10,14}"
              value="${phone}"
              placeholder="+92 300 1234567"
          />
          ${error ? `<div class="error-message">${error}</div>` : ""}
      </div>
  `;
  }

  /**
   * Renders the submit button
   */
  renderSubmitButton() {
    return `
      <div class="form-group">
          <button type="submit" class="submit-button" ${
            this.state.isLoading ? "disabled" : ""
          }>
              <span>${
                this.state.isLoading ? "Processing..." : "Generate"
              }</span>
              ${
                this.state.isLoading
                  ? this.createLoadingSpinner().outerHTML
                  : ""
              }
          </button>
      </div>
  `;
  }

  /**
   * Renders the wave decoration at the bottom
   */
  renderWaveDecoration() {
    return `
      <div class="wave-decoration">
          <div class="wave wave-1"></div>
          <div class="wave wave-2"></div>
      </div>
  `;
  }

  /**
   * Renders the SVG icons
   */
  renderPhoneIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
  `;
  }

  renderEmailIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
      </svg>
  `;
  }

  renderWhatsAppIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
  `;
  }

  /**
   * Attaches event listeners to form elements
   */
  attachEventListeners() {
    const form = document.getElementById("quote-form");
    const inputs = form.querySelectorAll("input, select");

    // Form submission
    form.addEventListener("submit", this.handleSubmit);

    // Input events
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleInput);
      input.addEventListener("blur", this.handleBlur.bind(this));
      input.addEventListener("focus", this.handleFocus.bind(this));
    });

    // Add resize listener for responsive adjustments
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  /**
   * Handles form input changes
   * @param {Event} event - Input event
   */
  handleInput(event) {
    const { name, value } = event.target;
    this.state[name] = value;

    // Clear validation error when user starts typing
    this.state.validationErrors[name] = "";

    // Remove error styling
    event.target.closest(".form-group").classList.remove("has-error");
  }

  /**
   * Handles input blur events
   * @param {Event} event - Blur event
   */
  handleBlur(event) {
    const { name, value } = event.target;

    // Validate field on blur
    const error = this.validateField(name, value);
    if (error) {
      this.state.validationErrors[name] = error;
      event.target.closest(".form-group").classList.add("has-error");
    }
  }

  /**
   * Handles input focus events
   * @param {Event} event - Focus event
   */
  handleFocus(event) {
    const formGroup = event.target.closest(".form-group");
    formGroup.classList.add("is-focused");

    // Add floating label animation
    const label = formGroup.querySelector(".form-label");
    if (label) {
      gsap.to(label, {
        y: -20,
        scale: 0.85,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }

  /**
   * Validates a single form field
   * @param {string} fieldName - Name of the field to validate
   * @param {string} value - Value to validate
   * @returns {string|null} Error message or null if valid
   */
  validateField(fieldName, value) {
    const rules = this.VALIDATION_RULES[fieldName];
    if (!rules) return null;

    if (rules.required && !value) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least ${rules.minLength} characters`;
    }

    return null;
  }

  /**
   * Validates the entire form
   * @returns {boolean} Whether the form is valid
   */
  validateForm() {
    let isValid = true;
    const formData = {
      provider: this.state.provider,
      referenceNumber: this.state.referenceNumber,
      phone: this.state.phone,
    };

    // Validate each field
    Object.keys(formData).forEach((fieldName) => {
      const error = this.validateField(fieldName, formData[fieldName]);
      if (error) {
        this.state.validationErrors[fieldName] = error;
        isValid = false;

        // Add error styling
        const formGroup = document
          .querySelector(`[name="${fieldName}"]`)
          .closest(".form-group");
        formGroup.classList.add("has-error");
      }
    });

    return isValid;
  }

  /**
   * Handles form submission
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.isLoading) return;

    if (!this.validateForm()) {
      this.showToast("Please fix the errors in the form", "error");
      return;
    }

    try {
      this.setLoading(true);
      this.showToast("Generating your quote...", "info");

      // Submit the form data
      await fetchBillData(this.state.referenceNumber);

      // Show success message
      this.showToast("Quote generated successfully!", "success");

      // Navigate to quote page
      window.router.push("/quote");
    } catch (error) {
      console.error("Error submitting form:", error);
      this.showToast("Failed to generate quote. Please try again.", "error");
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handles window resize events
   */
  handleResize() {
    // Update layout classes based on window size
    const container = document.querySelector(".container");
    if (window.innerWidth < 768) {
      container.classList.remove("desktop-layout");
      container.classList.add("mobile-layout");
    } else {
      container.classList.remove("mobile-layout");
      container.classList.add("desktop-layout");
    }
  }

  /**
   * Initializes page animations
   */
  initializeAnimations() {
    // Animate form elements
    gsap.from(".form-title", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(".form-group", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });

    // Animate info section
    gsap.from(".info-section", {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate wave decoration
    gsap.from(".wave", {
      scaleY: 0,
      transformOrigin: "bottom",
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    });
  }

  /**
   * Cleans up event listeners and animations
   */
  cleanup() {
    // Remove event listeners
    window.removeEventListener("resize", this.handleResize);

    // Kill all GSAP animations
    gsap.killTweensOf(".form-title");
    gsap.killTweensOf(".form-group");
    gsap.killTweensOf(".info-section");
    gsap.killTweensOf(".wave");
  }

  /**
   * Renders the core styles for the page
   */
  renderStyles() {
    return `
      <style>
          /* CSS Reset and Variables */
          :root {
              --color-primary: #00a651;
              --color-primary-dark: #008c44;
              --color-primary-light: rgba(0, 166, 81, 0.1);
              --color-yellow: #ffde17;
              --color-error: #ef4444;
              --color-success: #10b981;
              --color-text: #2c3e50;
              --color-text-light: #7f8c8d;
              --color-background: #ffffff;
              --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              --border-radius: 0.5rem;
              --transition: all 0.3s ease;
          }

          /* Base Styles */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              color: var(--color-text);
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
          }

          /* Layout */
          .sap_form {
              min-height: 100vh;
              background-color: var(--color-background);
              position: relative;
              overflow: hidden;
          }

          .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
          }

          .content-grid {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 2rem;
              position: relative;
              padding: 2rem 0;
          }

          /* Header Styles */
          .header {
              padding: 1.5rem 0;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }

          .logo-section {
              display: flex;
              align-items: center;
              gap: 1rem;
          }

          .logo-icon {
              width: 60px;
              height: 50px;
              flex-shrink: 0;
          }

          .logo-text h1 {
              font-size: 1.5rem;
              font-weight: bold;
              color: var(--color-text);
              line-height: 1.2;
          }

          .logo-text p {
              font-size: 0.875rem;
              color: var(--color-text-light);
              font-style: italic;
          }

          /* Contact Section Styles */
          .header-contacts {
              margin-top: 1rem;
          }

          .contact-label {
              font-size: 1.125rem;
              color: var(--color-text-light);
              margin-bottom: 0.5rem;
          }

          .contact-info {
              display: flex;
              justify-content: space-between;
              gap: 2rem;
          }

          .contact-info a {
              color: var(--color-text-light);
              text-decoration: none;
              transition: var(--transition);
          }

          .contact-info a:hover {
              color: var(--color-primary);
          }

          .mobile-contacts {
              display: flex;
              gap: 1rem;
              justify-content: flex-end;
          }

          .contact-icon {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--color-primary-light);
              border-radius: 50%;
              color: var(--color-primary);
              transition: var(--transition);
          }

          .contact-icon:hover {
              background-color: var(--color-primary);
              color: white;
              transform: translateY(-2px);
          }

          .contact-icon svg {
              width: 20px;
              height: 20px;
          }

          /* Form Section Styles */
          .form-section {
              padding: 2rem;
              background-color: var(--color-background);
              border-radius: var(--border-radius);
              box-shadow: var(--shadow-md);
          }

          .form-title {
              font-size: 2.25rem;
              font-weight: bold;
              color: var(--color-primary);
              margin-bottom: 2rem;
              line-height: 1.2;
          }

          .quote-form {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
          }

          /* Right Info Section */
          .info-section {
              background-color: var(--color-primary);
              color: white;
              padding: 2rem;
              border-radius: var(--border-radius);
              position: relative;
          }

          .info-content h3 {
              font-size: 1.5rem;
              line-height: 1.4;
              font-weight: normal;
              margin-bottom: 2rem;
          }

          .powered-by {
              position: absolute;
              bottom: 2rem;
              font-size: 1.5rem;
              font-weight: bold;
          }

          /* Wave Decoration */
          .wave-decoration {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 120px;
              overflow: hidden;
          }

          .wave {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 100%;
          }

          .wave-1 {
              background: var(--color-primary);
              opacity: 0.3;
              clip-path: path('M0,64 C200,44 400,84 600,64 S800,44 1200,64 L1200,100 L0,100 Z');
          }

          .wave-2 {
              background: var(--color-yellow);
              opacity: 0.5;
              clip-path: path('M0,74 C200,54 400,94 600,74 S800,54 1200,74 L1200,100 L0,100 Z');
          }
      </style>
  `;
  }
}
