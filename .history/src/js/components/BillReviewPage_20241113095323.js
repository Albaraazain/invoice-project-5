// Enhanced insights section in BillReviewPage class

renderInsights() {
    const insightsContainer = document.querySelector("#insights-container");
    if (!insightsContainer) return;
  
    // Generate trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = months.map(month => ({
      month,
      consumption: Math.floor(this.billData.unitsConsumed * (0.8 + Math.random() * 0.4))
    }));
  
    insightsContainer.innerHTML = `
      <div class="flex-1">
        <!-- Header -->
        <div class="flex items-center space-x-3 mb-8 opacity-0" id="page-header">
          <div class="w-1 h-8 bg-blue-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-800">Bill Analysis</h2>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-8 flex items-center justify-between text-sm opacity-0 bg-white rounded-xl p-6 shadow-sm" id="progress-container">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</div>
            <div class="ml-3">
              <p class="font-medium text-gray-800">Bill Review</p>
              <p class="text-gray-500">Analyzing your consumption</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">2</div>
            <div class="ml-3">
              <p class="font-medium text-gray-400">Solar Quote</p>
              <p class="text-gray-400">Up next</p>
            </div>
          </div>
        </div>
  
        <!-- Consumption Trend Chart -->
        <div class="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 opacity-0" id="trend-chart-container">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Consumption Trend</h3>
                <p class="text-sm text-gray-500">Last 6 months analysis</p>
              </div>
            </div>
          </div>
          <div class="h-48">
            <canvas id="consumption-trend-chart"></canvas>
          </div>
        </div>
  
        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <!-- Current Bill Card -->
          <div class="metric-card opacity-0 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Current Bill</p>
                <p class="text-2xl font-bold text-gray-900">${this.formatCurrency(this.billData.totalAmount)}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                Due in ${this.calculateDueDays()} days
              </div>
            </div>
          </div>
  
          <!-- Units Consumed Card -->
          <div class="metric-card opacity-0 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Units Consumed</p>
                <p class="text-2xl font-bold text-gray-900">${this.billData.unitsConsumed} kWh</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-600">Rate:</span>
              <span class="font-medium text-gray-900">${this.formatCurrency(this.billData.ratePerUnit)}/kWh</span>
            </div>
          </div>
        </div>
  
        <!-- Next Step Card -->
        <div class="relative mt-auto p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm opacity-0 border border-blue-100" id="next-step-card">
          <div class="absolute -top-3 -right-3 w-16 h-16 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Ready For Your Solar Quote?</h3>
          <p class="text-gray-600 mb-4">
            We've analyzed your bill. Now let's see how much you could save with solar!
          </p>
          <button 
            id="proceed-to-quote" 
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl font-medium 
                   hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md
                   flex items-center justify-center gap-2"
          >
            Generate My Solar Quote
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  
    // Initialize consumption trend chart
    this.initConsumptionTrendChart(trendData);
    
    // Start animations
    this.startInsightAnimations();
  }
  
  initConsumptionTrendChart(trendData) {
    const ctx = document.getElementById('consumption-trend-chart');
    if (!ctx) return;
  
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.map(d => d.month),
        datasets: [{
          label: 'Consumption (kWh)',
          data: trendData.map(d => d.consumption),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'white',
            titleColor: '#111827',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 8,
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: (context) => `${context.parsed.y} kWh`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => `${value} kWh`
            }
          }
        }
      }
    });
  }
  
  startInsightAnimations() {
    // Animate header and progress
    gsap.to("#page-header", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  
    gsap.to("#progress-container", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 0.2
    });
  
    // Animate trend chart
    gsap.to("#trend-chart-container", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 0.4
    });
  
    // Animate metric cards
    gsap.to(".metric-card", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.15,
      delay: 0.6
    });
  
    // Animate next step card
    gsap.to("#next-step-card", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 0.8
    });
  }
  
  formatCurrency(value) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  calculateDueDays() {
    const dueDate = new Date(this.billData.dueDate);
    const today = new Date();
    const diffTime = Math.abs(dueDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }