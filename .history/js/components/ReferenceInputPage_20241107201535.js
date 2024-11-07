import {
  fetchBillData,
  getIsLoading,
  getError,
} from "../store/solarSizingState.js";

export class ReferenceInputPage {
  constructor() {
    this.name = "";
    this.phone = "";
    this.email = "";
    this.referenceNumber = "";
    this.isLoading = false;
    this.error = null;
  }

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="sap_form">
          <div class="container mx-auto px-6 md:px-10">
            <!-- Mobile Contact Icons -->
            <div class="flex md:hidden pt-5 space-x-1 animate-fadeIn">
              <p>
                <a href="tel:+14155551234" class="contact-icon phn_mb animate-bounce" aria-label="Solar System Sizing Phone"></a>
              </p>
              <p>
                <a href="mailto:info@solarsizing.com" class="contact-icon eml_mb animate-bounce" aria-label="Solar System Sizing Email"></a>
              </p>
              <p>
                <a href="https://t.me/solarsizing" class="contact-icon tg_mb animate-bounce" aria-label="Solar System Sizing Telegram"></a>
              </p>
            </div>
  
            <!-- Desktop Contact Label -->
            <div class="hidden md:flex pt-4 animate-fadeIn">
              <div class="w-full">
                <p class="text-black opacity-20 text-xl tracking-tight">Contact us</p>
              </div>
            </div>
  
            <!-- Desktop Contact Details -->
            <div class="mt-6 hidden md:flex justify-between animate-fadeIn">
              <div class="flex items-center">
                <p class="text-black opacity-20 text-xl tracking-tight">
                  <a href="https://t.me/solarsizing" class="hover:text-gray-400 transition-colors duration-300" aria-label="Solar System Sizing Telegram">
                    Telegram
                  </a>
                </p>
              </div>
              <div class="flex items-center">
                <p class="text-black opacity-20 text-xl tracking-tight">
                  <a href="mailto:info@solarsizing.com" class="hover:text-gray-400 transition-colors duration-300" aria-label="Solar System Sizing Email">
                    info@solarsizing.com
                  </a>
                </p>
              </div>
            </div>
  
            <!-- Form Title -->
            <div class="mt-20 animate-slideInLeft">
              <h2 class="hidden md:block text-5xl font-normal tracking-tight">
                Solar System Sizing Tool -
                <span class="block">Enter Your Details</span>
              </h2>
              <h2 class="block md:hidden text-3xl font-normal tracking-tight">
                Solar System Sizing Tool -
                <span class="block">Enter Your Details</span>
              </h2>
            </div>
  
            <!-- Form -->
            <div class="mt-24 animate-fadeIn">
              <form id="solar-sizing-form" class="space-y-6" novalidate>
                <!-- Name Field -->
                <div class="relative">
                  <input type="text" id="name" name="NAME" placeholder=" " required aria-label="NAME" class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300">
                  <label for="name" class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Your name
                  </label>
                </div>
  
                <!-- Phone and Email Fields -->
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="relative">
                    <input type="tel" id="phone" name="PHONE" placeholder=" " required aria-label="PHONE" class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300">
                    <label for="phone" class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Phone
                    </label>
                  </div>
                  <div class="relative">
                    <input type="email" id="email" name="EMAIL" placeholder=" " required aria-label="EMAIL" class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300">
                    <label for="email" class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      E-mail
                    </label>
                  </div>
                </div>
  
                <!-- Reference Number -->
                <div class="relative">
                  <input type="text" id="referenceNumber" name="REFERENCE" placeholder=" " required aria-label="REFERENCE" class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300">
                  <label for="referenceNumber" class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    MEPCO Bill Reference Number
                  </label>
                </div>
  
                <!-- File Upload -->
                <div class="mt-8 animate-slideInRight">
                  <div class="flex flex-wrap items-start max-w-full">
                    <ul class="list_dwn flex flex-wrap mt-4 w-full"></ul>
                    <div class="relative">
                      <div class="dwn text-lg text-black cursor-pointer px-4 py-2 hover:text-gray-400 transition-colors duration-300">
                        Add attachment
                      </div>
                      <input type="file" name="files[]" data-url="/user_files/" class="hidden">
                      <div class="progress bg-gray-400 mt-2 relative h-0.5 w-full max-w-full" role="progressbar" aria-label="File Upload Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                        <div class="progress-bar-success bg-green-500 absolute top-0 left-0 h-full" style="width: 0%"></div>
                      </div>
                      <div class="progress_txt mt-4 text-sm text-black">
                        <div>Supported formats: jpg, png, pdf, doc(x), xls(x), ppt(x)</div>
                        <div>Maximum file size 20 MB</div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Error message -->
                <div id="error-message" class="text-red-500 mt-4 hidden"></div>
  
                <!-- Submit button -->
                <button type="submit" class="get_go w-full bg-black text-white font-medium text-lg rounded-full px-8 py-3 hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default">
                  <span>Get Quote</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;

    this.attachEventListeners();
    this.attachStyles();
  }

  attachEventListeners() {
    const form = document.getElementById("solar-sizing-form");
    form.addEventListener("submit", this.handleSubmit.bind(this));

    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleInput.bind(this));
      input.addEventListener("focus", this.handleFocus.bind(this));
      input.addEventListener("blur", this.handleBlur.bind(this));
    });
  }

  handleInput(event) {
    this[event.target.id] = event.target.value;
  }

  handleFocus(event) {
    event.target.parentElement.classList.add("focused");
  }

  handleBlur(event) {
    if (!event.target.value) {
      event.target.parentElement.classList.remove("focused");
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.isFormValid()) {
      this.isLoading = true;
      this.renderLoadingState();

      try {
        await fetchBillData(this.referenceNumber);
        console.log("Navigating to /quote");
        window.router.push("/quote");
      } catch (err) {
        console.error("Error generating quote:", err);
        this.error = "Error generating quote. Please try again.";
        this.renderError();
      } finally {
        this.isLoading = false;
        this.renderLoadingState();
      }
    } else {
      this.error = "Please fill in all required fields.";
      this.renderError();
    }
  }

  isFormValid() {
    return this.name && this.phone && this.email && this.referenceNumber;
  }

  renderLoadingState() {
    const button = document.querySelector(".get_go");
    if (this.isLoading) {
      button.innerHTML = '<span class="animate-pulse">Loading...</span>';
      button.disabled = true;
    } else {
      button.innerHTML = "<span>Get Quote</span>";
      button.disabled = false;
    }
  }

  renderError() {
    const errorMessage = document.getElementById("error-message");
    if (this.error) {
      errorMessage.textContent = this.error;
      errorMessage.classList.remove("hidden");
      errorMessage.classList.add("animate-shake");
      setTimeout(() => {
        errorMessage.classList.remove("animate-shake");
      }, 500);
    } else {
      errorMessage.classList.add("hidden");
    }
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
        /* Base styles */
:root {
  --color-primary: #00a651;
  --color-primary-light: rgba(0, 166, 81, 0.1);
  --color-yellow: #ffde17;
  --color-text: #2c3e50;
  --color-text-light: #7f8c8d;
}

.sap_form {
  min-height: 100vh;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  position: relative;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.logo-icon {
  width: 60px;
  height: 60px;
}

.logo-text h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text);
}

.logo-text p {
  font-size: 0.875rem;
  color: var(--color-text-light);
  font-style: italic;
}

/* Form Section */
.form-container {
  padding: 2rem;
  max-width: 600px;
}

.form-title {
  color: var(--color-primary);
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Right Side Content */
.right-content {
  background-color: var(--color-primary);
  padding: 4rem 2rem;
  color: white;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 33.333%;
}

.right-content h3 {
  font-size: 1.5rem;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.powered-by {
  position: absolute;
  bottom: 4rem;
  font-weight: bold;
  font-size: 1.5rem;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: scale(1.02);
  background-color: #008c44;
}

/* Decorative Waves */
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

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .right-content {
    position: relative;
    width: 100%;
    padding: 2rem 1rem;
  }

  .form-title {
    font-size: 1.875rem;
  }

  .powered-by {
    position: relative;
    bottom: auto;
    margin-top: 2rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
      `;
    document.head.appendChild(style);
  }
}
