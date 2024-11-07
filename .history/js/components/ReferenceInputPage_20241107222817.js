class ReferenceInputPage {
  constructor() {
      this.state = {
          provider: '',
          referenceNumber: '',
          whatsapp: '',
          isLoading: false
      };
  }

  render() {
      const app = document.getElementById("app");
      app.innerHTML = `
          <div class="relative w-full h-screen bg-white overflow-hidden mian-content">
              <!-- Logo Section -->
              <div class="absolute top-8 left-12 flex items-center gap-2 z-10">
                  <svg class="w-12 h-12" viewBox="0 0 60 50">
                      <path d="M30,20 C25,10 35,0 45,10 L55,20 C65,30 55,40 45,30 Z" 
                          class="fill-emerald-500"/>
                  </svg>
                  <div>
                      <h1 class="text-2xl font-bold text-gray-800">ENERGY COVE</h1>
                      <p class="text-sm italic text-gray-600">Energy for Life</p>
                  </div>
              </div>

              <!-- Main Content Grid -->
              <div class="flex h-full">
                  <!-- Left Section (2/3) -->
                  <div class="w-2/3 p-8 flex items-center justify-center">
                      <div class="max-w-md w-full">
                          <!-- Form Section -->
                          <h2 class="text-4xl font-bold text-emerald-500 mb-8">Get your quote</h2>
                          <form id="quote-form" class="space-y-6">
                              <!-- Provider Field -->
                              <div class="space-y-2">
                                  <label class="block text-sm text-gray-600">
                                      Choose your electricity Provider
                                  </label>
                                  <input type="text" 
                                      id="provider"
                                      class="w-full h-10 px-4 rounded border border-gray-300 focus:outline-none focus:border-emerald-500 transition-colors"
                                      placeholder="e.g., MEPCO">
                              </div>

                              <!-- Reference Number Field -->
                              <div class="space-y-2">
                                  <label class="block text-sm text-gray-600">
                                      Enter your bill reference number
                                  </label>
                                  <input type="text" 
                                      id="referenceNumber"
                                      class="w-full h-10 px-4 rounded border border-gray-300 focus:outline-none focus:border-emerald-500 transition-colors"
                                      placeholder="Enter reference number">
                              </div>

                              <!-- WhatsApp Field -->
                              <div class="space-y-2">
                                  <label class="block text-sm text-gray-600">
                                      Enter your WhatsApp phone Number
                                  </label>
                                  <input type="tel" 
                                      id="whatsapp"
                                      class="w-full h-10 px-4 rounded border border-gray-300 focus:outline-none focus:border-emerald-500 transition-colors"
                                      placeholder="+92 XXX XXXXXXX">
                              </div>

                              <!-- Submit Button -->
                              <button type="submit" 
                                  class="w-full h-12 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                                  <span>Generate</span>
                                  ${this.state.isLoading ? this.renderSpinner() : ''}
                              </button>
                          </form>
                      </div>
                  </div>

                  <!-- Right Section (1/3) -->
                  <div class="w-1/3 bg-emerald-500 p-8 flex flex-col relative">
                      <div class="text-white mt-16 space-y-2">
                          <p class="text-2xl leading-relaxed">
                              Our AI tool quickly provides
                              <br />the ideal system size and
                              <br />savings estimate—no
                              <br />in-person consultation
                              <br />needed. Get the fastest
                              <br />solar quote in Pakistan!
                          </p>
                      </div>
                      <div class="absolute bottom-24 text-white">
                          <p class="text-2xl font-bold">POWERED BY AI</p>
                      </div>
                  </div>
              </div>

              <!-- Decorative Waves -->
              <div class="absolute bottom-0 w-full">
                  <svg class="w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
                      <path d="M0,20 C200,0 400,40 600,20 S800,0 1200,20 L1200,100 L0,100 Z"
                          class="fill-emerald-500 opacity-30"/>
                      <path d="M0,40 C200,20 400,60 600,40 S800,20 1200,40 L1200,100 L0,100 Z"
                          class="fill-yellow-400 opacity-50"/>
                  </svg>
              </div>
          </div>
      `;

      this.attachEventListeners();
  }

  renderSpinner() {
      return `
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      `;
  }

  attachEventListeners() {
      const form = document.getElementById('quote-form');
      const inputs = form.querySelectorAll('input');

      form.addEventListener('submit', this.handleSubmit.bind(this));
      inputs.forEach(input => {
          input.addEventListener('input', this.handleInput.bind(this));
      });
  }

  handleInput(event) {
      const { id, value } = event.target;
      this.state[id] = value;
  }

  async handleSubmit(event) {
      event.preventDefault();
      
      if (this.state.isLoading) return;

      if (!this.validateForm()) {
          alert('Please fill in all fields');
          return;
      }

      try {
          this.state.isLoading = true;
          this.updateSubmitButton(true);

          await fetchBillData(this.state.referenceNumber);
          window.router.push('/quote');
      } catch (error) {
          console.error('Error:', error);
          alert('Failed to generate quote. Please try again.');
      } finally {
          this.state.isLoading = false;
          this.updateSubmitButton(false);
      }
  }

  validateForm() {
      return this.state.provider && 
             this.state.referenceNumber && 
             this.state.whatsapp;
  }

  updateSubmitButton(isLoading) {
      const button = document.querySelector('button[type="submit"]');
      if (button) {
          button.innerHTML = isLoading 
              ? `<span>Processing...</span>${this.renderSpinner()}`
              : '<span>Generate</span>';
          button.disabled = isLoading;
      }
  }
}

export { ReferenceInputPage };