// ReferenceInputPage.js
import { fetchBillData } from "../store/solarSizingState.js";

export class ReferenceInputPage {
  constructor() {
    this.state = {
      provider: "",
      referenceNumber: "",
      whatsapp: "",
      isLoading: false,
      error: null,
    };

    // Inject base styles when class is instantiated
    this.injectBaseStyles();
    this.injectUtilityStyles();
    this.injectAnimationStyles();
  }

  injectBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
          /* Reset and Base Styles */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          :root {
              --color-primary: #00a651;
              --color-primary-dark: #008c44;
              --color-primary-light: rgba(0, 166, 81, 0.1);
              --color-yellow: #ffde17;
              --color-gray-800: #2d3748;
              --color-gray-600: #4a5568;
              --color-gray-400: #cbd5e0;
              --color-gray-200: #edf2f7;
              --color-white: #ffffff;
          }

          body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                         "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
              color: var(--color-gray-800);
          }

          /* Main Container Styles */
          .main-content {
              position: relative;
              width: 100%;
              min-height: 100vh;
              background-color: var(--color-white);
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
              color: var(--color-gray-800);
          }

          .logo-text p {
              font-size: 0.875rem;
              font-style: italic;
              color: var(--color-gray-600);
          }

          /* Layout Grid */
          .layout-grid {
              display: flex;
              height: 100vh;
          }

          /* Form Section */
          .form-section {
              width: 66.666667%;
              padding: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .form-container {
              max-width: 28rem;
              width: 100%;
          }

          .form-title {
              font-size: 2.25rem;
              font-weight: 700;
              color: var(--color-primary);
              margin-bottom: 2rem;
          }

          /* Form Elements */
          .form-group {
              margin-bottom: 1.5rem;
          }

          .form-label {
              display: block;
              font-size: 0.875rem;
              color: var(--color-gray-600);
              margin-bottom: 0.5rem;
          }

          .form-input {
              width: 100%;
              height: 2.5rem;
              padding: 0 1rem;
              border: 1px solid var(--color-gray-400);
              border-radius: 0.375rem;
              transition: all 0.2s ease;
          }

          .form-input:focus {
              outline: none;
              border-color: var(--color-primary);
              box-shadow: 0 0 0 3px var(--color-primary-light);
          }

          .form-button {
              width: 100%;
              height: 3rem;
              background-color: var(--color-primary);
              color: var(--color-white);
              border: none;
              border-radius: 9999px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              cursor: pointer;
              transition: all 0.2s ease;
          }

          .form-button:hover:not(:disabled) {
              background-color: var(--color-primary-dark);
          }

          .form-button:disabled {
              opacity: 0.7;
              cursor: not-allowed;
          }

          /* Right Section */
          .right-section {
              width: 33.333333%;
              background-color: var(--color-primary);
              padding: 2rem;
              display: flex;
              flex-direction: column;
              position: relative;
          }

          .right-content {
              margin-top: 4rem;
              color: var(--color-white);
          }

          .right-content p {
              font-size: 1.5rem;
              line-height: 1.4;
          }

          .powered-by {
              position: absolute;
              bottom: 6rem;
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--color-white);
          }
      `;
    document.head.appendChild(style);
  }

  injectUtilityStyles() {
    const style = document.createElement("style");
    style.textContent = `
          /* Utility Classes */
          .relative { position: relative; }
          .absolute { position: absolute; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-2 { gap: 0.5rem; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .text-white { color: white; }
          .bg-white { background-color: white; }
          .overflow-hidden { overflow: hidden; }
          .z-10 { z-index: 10; }
          .space-y-2 > * + * { margin-top: 0.5rem; }
          .space-y-6 > * + * { margin-top: 1.5rem; }
      `;
    document.head.appendChild(style);
  }

  injectAnimationStyles() {
    const style = document.createElement("style");
    style.textContent = `
          /* Grain Animation */
          .main-content:before {
              animation: grain 4s steps(10) infinite;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEVMaXH///////////////////////////////////////////9/ePoGAAAACHRSTlMAGBonNDtASlb65KYAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAFD0lEQVQ4yx2TTWhcVRTH/+fe++67783LvDZJx1hLKlQFFcFuXMWdC7Ql2I0ILkUXbXEhrSBd2BbE0IWQgKBddBNcFCpSEAyiQrt2IW4UNwoukhRsTKck6WQyH+/jvnfvPefcjwv3/s9v8b+/QwDQg19VDIkiUCBAhQAibsACkH0E5O3tzdreeMrdvff+9vb2ixuAu1UHsSAtrdyrA9QIAC/cu9F7OIwOe/3+cXt4fPwkAM3ojI4t5YBmE5BmetDpxo92dzqdjyfj0+kz0zQPTvY+kX08tGQqpWEqIGknrbb1TqvX+5REz/XNRXv97jL0z6ZprEYqoAPA0Eqr1Ta/7XbNVzzPfnZ9Z2ey7Z+fTc+GUQxrCssCQFpJK8z7rZb7/uZmr900vVa/89vZ2Dsd+T1iqEQQKNJgXlZ23lmzbK0P/XC71tDq9fU7+5fj8fnIG85VCFwzQ5KSdrPZvOK5rqvVSLkn6vcPL0fToS+YADDDG1Qx2mGz0TDfXXGcTsuyPvJOj5+eDvv9+FgJ0AAoyAHCBq+/67muuzJrGLVyo1a5NhyfBfE0QhGgITBDggR/08SH7ebqrF4v+xeB/30cngzm8WipRcRiAVBBOkr9F6/UdN3GDQz+aMd8URvOw+FcqwxCAdJCYkRZJ4rjpQa31suN50Uci7KSaWwVgtkaMXB+fhlHUZQsFYZcJgmAK/9FWGgR6RwAipwkqaRfbheypWAYRUk6S1d9zxdIlqYXhJ4qYiRG7uGMEi09z1PsiwQ6LWxEo5lXC5hoZSYV0iRWrFCInTwAFgLQQhZKQokhHTyYS2EsBSI0xEIgEsCRwVEkEksYgZGAUQW5wP8NOYwx8UFZA0qlFEgGmEIAiQJSFyB0oQIpC0CKpUI0EYAkgJUnJQoDWCAa1EABEAEAYpICQEFE/wLQ4FIJKBAGmAFBCYNZAUEAQIYxBBE4UhSHsWRYAFQRUCQgmKSCRzl+ZEAyiJgw3ghJ4hlAiKRMADAJKEiK7NJHpGqsAQhDEL+mF6AQChFkwBggcEVNh4o9JT0CuADoAIGGtCAGyzgPBsWj4a8vv7q5mKvlhEgKDFBENHUl6SnZ8ACgBQV4MZPEXMwFZuzY+fzrh2u12qyxtl7+2iBuWQiDGYyRxN2QS/0KgMQ1WqcYzZL4vFc1n/R+uO27lc21h2Udy9uA1hljK2kMgxY0gAAIS2gpsSCKGPq4WvGcr75/uVR0rXLrthiclO2i72mMFAF1IgYBYCWRW/UU1v0PW4bhrlSM8nfnl74ppdSU5XAeaakQsQSCWAEpxKK/1ry9bZn2m0YZhWKlqNOyxGiMOJ5HGlEiIJJA5KIkPsE8HRiF4r2y7fzKXF6aDKBgX/pz6KtckRhKQKiFeZauv9tynbJhmAQQU9Cp5Eo+8WweRqqGWEgKWKTxSavytuUUS7ZjMKaYtTxhLSVnQjBBqgygApBWPOGl/9TpteaUAWAqmAh1E4dpspQwSGlFjPFd/4Xu7rOvvc7mZsUqlXN6QbX0z2kS+3FWzkABlBaUBs3gS7sdJq1eZ2U8j31KUhb746FcSrATQjRfJhBTCmlrVdpJ2r3e/s9B6KfzJFGm+DcdBDG0KYq6jMrCkSJClClCZPXg++E4OP0WsKxxPhlN07wqPuJqPa23XGG8/uG1VbOk12yX5fV9LzyfLnWRp3cBBv8AL4A74Q+hss4AAAAASUVORK5CYII=);
              content: "";
              height: 350%;
              left: -50%;
              opacity: 0.02;
              position: fixed;
              top: -150%;
              width: 300%;
              z-index: 999 !important;
              pointer-events: none;
          }

          @keyframes grain {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-5%, -10%); }
              20% { transform: translate(-15%, 5%); }
              30% { transform: translate(7%, -25%); }
              40% { transform: translate(-5%, 25%); }
              50% { transform: translate(-15%, 10%); }
              60% { transform: translate(15%, 0%); }
              70% { transform: translate(0%, 15%); }
              80% { transform: translate(3%, 35%); }
              90% { transform: translate(-10%, 10%); }
          }

          /* Decorative Wave Animation */
          .wave-animation {
              animation: wave 10s ease-in-out infinite;
              transform-origin: center bottom;
          }

          @keyframes wave {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
          }

          /* Loading Spinner Animation */
          .spinner {
              animation: spin 1s linear infinite;
          }

          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }

          /* Character Animation */
          .char {
              transform: translateY(115px);
              transition: transform 0.5s;
          }

          /* Selection Style */
          ::selection {
              background-color: var(--color-primary-light);
              color: var(--color-primary);
          }
      `;
    document.head.appendChild(style);
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = this.getTemplate();
    this.attachEventListeners();
    this.initializeAnimations();
  }

  getTemplate() {
    return `
        <div class="main-content">
            <!-- Logo Section -->
            <div class="logo-section">
                ${this.getLogoTemplate()}
            </div>

            <!-- Main Layout -->
            <div class="layout-grid">
                <!-- Left Form Section -->
                <div class="form-section">
                    <div class="form-container">
                        <h2 class="form-title">Get your quote</h2>
                        ${this.getFormTemplate()}
                    </div>
                </div>

                <!-- Right Content Section -->
                <div class="right-section">
                    ${this.getRightContentTemplate()}
                </div>

                <!-- Decorative Waves -->
                ${this.getWaveTemplate()}
            </div>
        </div>
    `;
  }

  getLogoTemplate() {
    return `
        <img src="/src/assets/logo.svg" alt="Logo" class="logo-icon -ml-8 -mt-8" style="width: 13rem; height: 13rem;" />
        
    `;
  }

  getFormTemplate() {
    return `
        <form id="quote-form" class="space-y-6">
            <!-- Provider Field -->
            <div class="form-group">
                <label class="form-label" for="provider">
                    Choose your electricity Provider
                </label>
                <input 
                    type="text" 
                    id="provider"
                    class="form-input"
                    placeholder="e.g., MEPCO"
                    value="${this.state.provider}"
                    ${this.state.isLoading ? "disabled" : ""}
                >
            </div>

            <!-- Reference Number Field -->
            <div class="form-group">
                <label class="form-label" for="referenceNumber">
                    Enter your bill reference number
                </label>
                <input 
                    type="text" 
                    id="referenceNumber"
                    class="form-input"
                    placeholder="Enter reference number"
                    value="${this.state.referenceNumber}"
                    ${this.state.isLoading ? "disabled" : ""}
                >
            </div>

            <!-- WhatsApp Field -->
            <div class="form-group">
                <label class="form-label" for="whatsapp">
                    Enter your WhatsApp phone Number
                </label>
                <input 
                    type="tel" 
                    id="whatsapp"
                    class="form-input"
                    placeholder="+92 XXX XXXXXXX"
                    value="${this.state.whatsapp}"
                    ${this.state.isLoading ? "disabled" : ""}
                >
            </div>

            <!-- Submit Button -->
            <button 
                type="submit" 
                class="form-button"
                ${this.state.isLoading ? "disabled" : ""}
            >
                ${this.getButtonContent()}
            </button>

            ${this.state.error ? this.getErrorTemplate() : ""}
        </form>
    `;
  }

  getButtonContent() {
    if (this.state.isLoading) {
      return `
            <span>Processing</span>
            ${this.getSpinnerTemplate()}
        `;
    }
    return "<span>Generate</span>";
  }

  getSpinnerTemplate() {
    return `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" 
                stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
    `;
  }

  getRightContentTemplate() {
    return `
        <div class="right-content">
            <p>
                Our AI tool quickly provides
                <br />the ideal system size and
                <br />savings estimate—no
                <br />in-person consultation
                <br />needed. Get the fastest
                <br />solar quote in Pakistan!
            </p>
        </div>
        <div class="powered-by">
            POWERED BY AI
        </div>
    `;
  }

  getWaveTemplate() {
    return `
        
    `;
  }

  getErrorTemplate() {
    return `
        <div class="error-message">
            ${this.state.error}
        </div>
    `;
  }

  initializeAnimations() {
    // Add any initial animations here
    const poweredBy = document.querySelector(".powered-by");
    if (poweredBy) {
      poweredBy.style.opacity = "0";
      setTimeout(() => {
        poweredBy.style.transition = "opacity 0.5s ease-in-out";
        poweredBy.style.opacity = "1";
      }, 500);
    }
  }
  attachEventListeners() {
    // Form submission
    const form = document.getElementById("quote-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    // Input change handlers
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleInput.bind(this));
      input.addEventListener("focus", this.handleFocus.bind(this));
      input.addEventListener("blur", this.handleBlur.bind(this));
    });

    // Add phone number formatting
    const whatsappInput = document.getElementById("whatsapp");
    if (whatsappInput) {
      whatsappInput.addEventListener(
        "input",
        this.formatPhoneNumber.bind(this)
      );
    }
  }

  handleInput(event) {
    const { id, value } = event.target;
    this.state[id] = value;

    // Clear error when user starts typing
    if (this.state.error) {
      this.state.error = null;
      this.updateErrorDisplay();
    }

    // Add input validation class
    this.validateField(event.target);
  }

  handleFocus(event) {
    const field = event.target;
    field.parentElement.classList.add("focused");

    // Add subtle highlight animation
    field.style.transition = "all 0.2s ease";
    field.style.transform = "scale(1.01)";
  }

  handleBlur(event) {
    const field = event.target;
    field.parentElement.classList.remove("focused");

    // Remove highlight animation
    field.style.transform = "scale(1)";

    // Validate field on blur
    this.validateField(field);
  }

  validateField(field) {
    const { id, value } = field;
    let isValid = true;
    let errorMessage = "";

    switch (id) {
      case "provider":
        isValid = value.trim().length >= 2;
        errorMessage = "Provider name must be at least 2 characters";
        break;

      case "referenceNumber":
        isValid = /^[A-Za-z0-9-]{4,}$/.test(value.trim());
        errorMessage = "Please enter a valid reference number";
        break;

      case "whatsapp":
        isValid = /^\+92\s?3\d{2}[-\s]?\d{7}$/.test(value.trim());
        errorMessage =
          "Please enter a valid Pakistani phone number (e.g., +92 3XX XXXXXXX)";
        break;
    }

    // Update field styling
    if (value) {
      field.classList.toggle("invalid", !isValid);
      field.classList.toggle("valid", isValid);

      // Show/hide error message
      const errorElement = field.parentElement.querySelector(".field-error");
      if (!isValid) {
        if (!errorElement) {
          const error = document.createElement("div");
          error.className = "field-error";
          error.textContent = errorMessage;
          field.parentElement.appendChild(error);
        }
      } else if (errorElement) {
        errorElement.remove();
      }
    }

    return isValid;
  }

  formatPhoneNumber(event) {
    let input = event.target;
    let value = input.value.replace(/[^\d+]/g, ""); // Keep digits and the plus sign only

    // Format as +92 3XX XXXXXXX
    if (value.startsWith("+92")) {
      if (value.length > 3) {
        value =
          value.slice(0, 3) +
          " " +
          value.slice(3, 6) +
          " " +
          value.slice(6, 13);
      }
    }

    input.value = value;
    this.state.whatsapp = value;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.isLoading) return;

    // Validate all fields
    const form = event.target;
    const fields = form.querySelectorAll(".form-input");
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showError("Please correct the errors in the form");
      return;
    }

    // Start loading state
    this.setState({ isLoading: true, error: null });
    this.updateFormState();

    try {
      // Show processing animation
      this.showProcessingAnimation();

      // Call the imported fetchBillData function
      await fetchBillData(this.state.referenceNumber);

      // Navigate to quote page on success
      window.router.push("/quote");
    } catch (error) {
      console.error("Error generating quote:", error);
      this.showError("Failed to generate quote. Please try again.");
    } finally {
      this.setState({ isLoading: false });
      this.updateFormState();
    }
  }


  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  updateFormState() {
    // Update button state
    const button = document.querySelector(".form-button");
    if (button) {
      button.innerHTML = this.getButtonContent();
      button.disabled = this.state.isLoading;
    }

    // Update input fields
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.disabled = this.state.isLoading;
    });

    // Update error display
    this.updateErrorDisplay();
  }

  updateErrorDisplay() {
    const errorContainer = document.querySelector(".error-message");
    if (errorContainer) {
      errorContainer.textContent = this.state.error || "";
      errorContainer.style.display = this.state.error ? "block" : "none";
    }
  }

  showError(message) {
    this.setState({ error: message });
    this.updateErrorDisplay();

    // Add shake animation to form
    const form = document.getElementById("quote-form");
    form.classList.add("shake");
    setTimeout(() => form.classList.remove("shake"), 820); // Match shake animation duration
  }

  showProcessingAnimation() {
    const button = document.querySelector(".form-button");
    if (button) {
      button.classList.add("processing");

      // Add loading dots animation
      const span = button.querySelector("span");
      if (span) {
        const dots = document.createElement("span");
        dots.className = "loading-dots";
        span.appendChild(dots);
      }
    }
  }
  injectUtilityStyles() {
    const style = document.createElement("style");
    style.textContent = `
        ${this.getBaseUtilityStyles()}
        ${this.getFormAnimationStyles()}
        ${this.getValidationStyles()}
        ${this.getLoadingStyles()}
        ${this.getErrorStyles()}
        ${this.getResponsiveStyles()}
    `;
    document.head.appendChild(style);
  }

  getBaseUtilityStyles() {
    return `
        .form-input.valid {
            border-color: var(--color-primary);
            background-color: var(--color-primary-light);
        }

        .form-input.invalid {
            border-color: #ef4444;
            background-color: rgba(239, 68, 68, 0.1);
        }

        .focused .form-label {
            color: var(--color-primary);
            transform: translateY(-1.5rem) scale(0.85);
        }

        .field-wrapper {
            position: relative;
            padding-bottom: 1.5rem;
        }
    `;
  }

  getFormAnimationStyles() {
    return `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .shake {
            animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }

        .form-button.processing {
            position: relative;
            overflow: hidden;
        }

        .form-button.processing::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255,255,255,0.2) 50%,
                transparent 100%
            );
            animation: loading-shine 1.5s infinite;
        }

        @keyframes loading-shine {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
        }

        .loading-dots::after {
            content: '';
            animation: loading-dots 1.5s infinite;
        }

        @keyframes loading-dots {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
        }
    `;
  }

  getValidationStyles() {
    return `
        .field-error {
            position: absolute;
            bottom: 0;
            left: 0;
            font-size: 0.75rem;
            color: #ef4444;
            transition: all 0.2s ease;
        }

        .form-input.valid + .field-error {
            opacity: 0;
            transform: translateY(-10px);
        }

        .form-input.invalid + .field-error {
            opacity: 1;
            transform: translateY(0);
        }
    `;
  }

  getLoadingStyles() {
    return `
        .spinner {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .form-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }

        .form-button:disabled:hover {
            transform: none;
            background-color: var(--color-primary);
        }
    `;
  }

  getErrorStyles() {
    return `
        .error-message {
            background-color: rgba(239, 68, 68, 0.1);
            border-radius: 0.375rem;
            padding: 0.75rem;
            color: #ef4444;
            margin-top: 1rem;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .error-message::before {
            content: '⚠️';
        }
    `;
  }

  getResponsiveStyles() {
    return `
        @media (max-width: 768px) {
            .layout-grid {
                flex-direction: column;
            }

            .form-section,
            .right-section {
                width: 100%;
            }

            .right-section {
                padding: 2rem 1rem;
            }

            .form-container {
                padding: 1rem;
            }

            .logo-section {
                position: relative;
                top: 0;
                left: 0;
                padding: 1rem;
            }

            .form-title {
                font-size: 1.875rem;
            }

            .right-content p {
                font-size: 1.25rem;
            }

            .powered-by {
                position: relative;
                bottom: auto;
                margin-top: 2rem;
            }
        }

        @media (max-width: 480px) {
            .form-title {
                font-size: 1.5rem;
            }

            .right-content p {
                font-size: 1rem;
            }
        }
    `;
  }
}
