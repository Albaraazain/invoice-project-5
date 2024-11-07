import { gsap } from "gsap";
import ProgressBar from "progressbar.js";
import Chart from "chart.js/auto";
import { CountUp } from "countup.js";

export class SystemSizing {
  constructor(billData) {
    this.billData = billData;
    this.charts = {};
    this.progressBar = null;
    this.countUps = {};
  }

  cleanup() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) chart.destroy();
    });
    this.charts = {};

    if (this.progressBar) {
      this.progressBar.destroy();
      this.progressBar = null;
    }

    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) countUp.reset();
    });
    this.countUps = {};
  }

  render(container) {
    this.cleanup();
  
    container.innerHTML = `
      <div id="system-sizing" class="w-full h-full overflow-y-auto px-4 py-6 space-y-4">
        <h2 class="text-2xl font-bold text-gray-800">Solar System Dashboard</h2>
        
        <!-- Top Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.renderSystemSizeCard()}
          ${this.renderEstimatedCostCard()}
          ${this.renderPaybackPeriodCard()}
        </div>

        <!-- Energy Production Section -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-800">Energy Production</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            ${this.renderEnergyProductionStat("Daily", "daily-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Monthly", "monthly-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Annual", "annual-production-value", "kWh")}
            ${this.renderEnergyProductionStat("Coverage", "coverage-percentage-value", "%")}
          </div>
          <div class="h-64 md:h-80">
            <canvas id="energy-production-chart"></canvas>
          </div>
        </div>

        <!-- System Details Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          ${this.renderSystemDetailsCards()}
        </div>
      </div>
    `;

    this.attachStyles();
    this.initializeComponents();
    this.startAnimations();
  }

  renderSystemSizeCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">System Size</h3>
        <div class="flex items-center justify-between">
          <div class="w-16 h-16" id="system-size-progress"></div>
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-900">
              <span id="system-size-value">0</span>
            </p>
            <p class="text-sm text-gray-500">kW</p>
          </div>
        </div>
      </div>
    `;
  }

  renderEstimatedCostCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Estimated Cost</h3>
        <div class="flex justify-between items-start mb-4">
          <p class="text-2xl font-bold text-gray-900">$<span id="estimated-cost-value">0</span></p>
          <div class="text-sm">
            <p class="text-gray-600">Before incentives</p>
            <p class="text-green-600 font-medium">-$${this.calculateIncentives()} in incentives</p>
          </div>
        </div>
        <div class="h-32">
          <canvas id="cost-breakdown-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderPaybackPeriodCard() {
    return `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-800">Payback Period</h3>
        <div class="flex justify-between items-start mb-4">
          <p class="text-2xl font-bold text-gray-900"><span id="payback-period-value">0</span> years</p>
          <div class="text-sm">
            <p class="text-gray-600">Annual Savings</p>
            <p class="text-green-600 font-medium">$<span id="annual-savings-value">0</span></p>
          </div>
        </div>
        <div class="h-32">
          <canvas id="payback-period-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderSystemDetailsCards() {
    const cards = [
      { title: "Number of Panels", id: "number-of-panels-value", unit: "", icon: "solar-panel" },
      { title: "Panel Wattage", id: "panel-wattage-value", unit: "W", icon: "lightning-bolt" },
      { title: "CO2 Offset", id: "co2-offset-value", unit: "tons/year", icon: "leaf" },
      { title: "Roof Area", id: "roof-area-value", unit: "sq ft", icon: "home" },
      { title: "Total Savings", id: "total-savings-value", unit: "$/25yr", icon: "piggy-bank" },
      { title: "Warranty", id: "warranty-period", unit: "years", icon: "shield-check", value: "25" }
    ];

    return cards.map(card => this.renderDetailCard(card)).join('');
  }

  renderDetailCard({ title, id, unit, icon, value }) {
    return `
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <div class="flex items-start gap-3">
          ${this.getIcon(icon)}
          <div>
            <p class="text-sm text-gray-600">${title}</p>
            <p class="text-lg font-semibold text-gray-900">
              <span id="${id}">${value || '0'}</span> ${unit}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderEnergyProductionStat(label, id, unit) {
    return `
      <div class="bg-gray-50 rounded p-3">
        <p class="text-sm text-gray-600">${label}</p>
        <p class="text-lg font-semibold text-gray-900">
          <span id="${id}">0</span> ${unit}
        </p>
      </div>
    `;
  }

  initializeComponents() {
    this.initSystemSizeProgress();
    this.initCharts();
    this.initCountUps();
  }

  initCharts() {
    const baseOptions = this.getBaseChartOptions();
    this.initEnergyProductionChart(baseOptions);
    this.initCostBreakdownChart(baseOptions);
    this.initPaybackPeriodChart(baseOptions);
  }

  initSystemSizeProgress() {
    const progressContainer = document.getElementById("system-size-progress");
    if (!progressContainer) return;

    this.progressBar = new ProgressBar.Circle(progressContainer, {
      color: '#3B82F6',
      trailColor: '#E5E7EB',
      trailWidth: 4,
      duration: 2000,
      easing: 'easeInOut',
      strokeWidth: 8,
      from: { color: '#93C5FD', width: 4 },
      to: { color: '#3B82F6', width: 8 },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
      }
    });
  }

  generateMonthlyData() {
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    
    return months.map(month => ({
      month,
      production: this.generateProductionValue(month),
      consumption: this.generateConsumptionValue(month)
    }));
  }

  generateProductionValue(month) {
    // Simulate seasonal variations
    const seasonalFactors = {
      "December": 0.6, "January": 0.6, "February": 0.7,
      "March": 0.8, "April": 0.9, "May": 1,
      "June": 1, "July": 1, "August": 0.9,
      "September": 0.8, "October": 0.7, "November": 0.6
    };
    
    const baseValue = 800;
    return Math.round(baseValue * seasonalFactors[month] * (0.9 + Math.random() * 0.2));
  }

  generateConsumptionValue(month) {
    // Simulate higher consumption in summer/winter
    const seasonalFactors = {
      "December": 1.2, "January": 1.2, "February": 1.1,
      "March": 0.9, "April": 0.8, "May": 1,
      "June": 1.2, "July": 1.3, "August": 1.2,
      "September": 1, "October": 0.9, "November": 1
    };
    
    const baseValue = 700;
    return Math.round(baseValue * seasonalFactors[month] * (0.9 + Math.random() * 0.2));
  }

  getBaseChartOptions() {
    const isMobile = window.innerWidth < 768;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#111827',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: isMobile ? 6 : 8,
          bodyFont: {
            size: isMobile ? 11 : 13
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      }
    };
  }

    initEnergyProductionChart(baseOptions) {
    const ctx = document.getElementById("energy-production-chart");
    if (!ctx) return;

    const monthlyData = this.generateMonthlyData();
    const isMobile = window.innerWidth < 768;

    // Define custom animation
    const energyProductionAnimation = {
      x: {
        type: 'number',
        easing: 'easeOutElastic',
        duration: (ctx) => {
          const delayBetween = ctx?.index || 0; // Safely access index
          return 1000 + delayBetween * 100;
        },
        from: (ctx) => {
          if (ctx.type === 'data') {
            return ctx.chart.scales.x.getPixelForValue(ctx.index - 1);
          }
          return ctx.chart.scales.x.getPixelForValue(ctx.index);
        },
        delay: (ctx) => (ctx?.index || 0) * 100 // Safely access index
      },
      
      y: {
        type: 'number',
        easing: 'easeOutBounce',
        duration: 1000,
        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0),
        delay: (ctx) => ctx.index * 100
      }
    };

    this.charts.energyProduction = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlyData.map(d => isMobile ? d.month.substring(0, 3) : d.month),
        datasets: [
          {
            label: "Production",
            data: monthlyData.map(d => d.production),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: isMobile ? 2 : 4,
            pointHoverRadius: isMobile ? 4 : 6,
            borderWidth: isMobile ? 1.5 : 2,
          },
          {
            label: "Consumption",
            data: monthlyData.map(d => d.consumption),
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: isMobile ? 2 : 4,
            pointHoverRadius: isMobile ? 4 : 6,
            borderWidth: isMobile ? 1.5 : 2,
          }
        ]
      },
      options: {
        ...baseOptions,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: energyProductionAnimation,
        transitions: {
          active: {
            animation: {
              duration: 400
            }
          }
        },
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y.toFixed(1);
                return `${label}: ${value} kWh`;
              }
            }
          }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            grid: {
              display: false
            }
          },
          y: {
            ...baseOptions.scales.y,
            ticks: {
              ...baseOptions.scales.y.ticks,
              callback: (value) => `${value} kWh`
            }
          }
        }
      }
    });
  }

  initCostBreakdownChart(baseOptions) {
    const ctx = document.getElementById("cost-breakdown-chart");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const data = this.prepareCostBreakdownData();

    // Define custom animation for doughnut chart
    const doughnutAnimation = {
      animate: true,
      animateRotate: true,
      animateScale: true,
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      animations: {
        numbers: {
          type: 'number',
          properties: ['circumference', 'endAngle', 'innerRadius', 'outerRadius', 'startAngle', 'x', 'y']
        }
      }
    };

    this.charts.costBreakdown = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)"
          ],
          borderWidth: 0,
          spacing: isMobile ? 2 : 4
        }]
      },
      options: {
        cutout: isMobile ? '65%' : '70%',
        ...doughnutAnimation,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  initPaybackPeriodChart(baseOptions) {
    const ctx = document.getElementById("payback-period-chart");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const data = this.preparePaybackData();

    // Define sequence animation for payback period
    const paybackAnimation = {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0,
        to: 0.4
      },
      delay: (ctx) => {
        const delay = ctx.dataIndex ? ctx.dataIndex : 0; // Safeguard against undefined
        return delay * 100;
      },
      x: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 1500, // Use a fixed number if dynamic calculation isn't needed
      },
      y: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 1500,
        from: (ctx) => {
          if (ctx.type !== 'data') return 0;
          return ctx.chart.scales.y.getPixelForValue(0);
        },
        delay: (ctx) => ctx.dataIndex * 100,
      }
    };

    initCountUps() {
    const options = {
      duration: 2,
      useEasing: true,
      useGrouping: true,
    };

    this.countUps = {
      systemSize: new CountUp(
        "system-size-value",
        this.billData.recommendedSystemSize,
        {
          ...options,
          decimalPlaces: 2,
        }
      ),
      estimatedCost: new CountUp(
        "estimated-cost-value",
        this.billData.estimatedSystemCost,
        {
          ...options,
          prefix: "$",
        }
      ),
      paybackPeriod: new CountUp(
        "payback-period-value",
        this.billData.estimatedPaybackPeriod,
        {
          ...options,
          decimalPlaces: 1,
        }
      ),
      annualSavings: new CountUp(
        "annual-savings-value",
        this.billData.estimatedAnnualSavings,
        {
          ...options,
          prefix: "$",
        }
      ),
      dailyProduction: new CountUp(
        "daily-production-value",
        this.billData.estimatedDailyProduction,
        {
          ...options,
          decimalPlaces: 1,
        }
      ),
      monthlyProduction: new CountUp(
        "monthly-production-value",
        this.billData.estimatedMonthlyProduction,
        {
          ...options,
          decimalPlaces: 0,
        }
      ),
      annualProduction: new CountUp(
        "annual-production-value",
        this.billData.estimatedAnnualProduction,
        {
          ...options,
          decimalPlaces: 0,
        }
      ),
      coveragePercentage: new CountUp(
        "coverage-percentage-value",
        this.billData.coveragePercentage,
        {
          ...options,
          decimalPlaces: 1,
          suffix: "%",
        }
      ),
      numberOfPanels: new CountUp(
        "number-of-panels-value",
        this.billData.numberOfPanels,
        {
          ...options,
          decimalPlaces: 0,
        }
      ),
      panelWattage: new CountUp(
        "panel-wattage-value",
        this.billData.panelWattage,
        {
          ...options,
          decimalPlaces: 0,
        }
      ),
      annualSavingsDetail: new CountUp(
        "annual-savings-detail-value",
        this.billData.estimatedAnnualSavings,
        {
          ...options,
          prefix: "$",
        }
      ),
      co2Offset: new CountUp("co2-offset-value", this.calculateCO2Offset(), {
        ...options,
        decimalPlaces: 2,
      }),
      roofArea: new CountUp("roof-area-value", this.calculateRoofArea(), {
        ...options,
        decimalPlaces: 0,
      }),
    };
  }

  startCountUps() {
    Object.values(this.countUps).forEach((countUp) => {
      if (countUp && !countUp.error) {
        countUp.start();
      }
    });
  }
    

    this.charts.paybackPeriod = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Savings",
            data: data.savings,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: isMobile ? 2 : 4,
            pointHoverRadius: isMobile ? 4 : 6,
          },
          {
            label: "System Cost",
            data: data.cost,
            borderColor: "rgb(239, 68, 68)",
            borderDash: [5, 5],
            pointRadius: 0,
          }
        ]
      },
      options: {
        ...baseOptions,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: paybackAnimation,
        transitions: {
          active: {
            animation: {
              duration: 300
            }
          }
        },
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                return `${label}: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            ticks: {
              ...baseOptions.scales.x.ticks,
              callback: (value, index) => isMobile && index % 2 !== 0 ? '' : `Year ${value}`
            }
          },
          y: {
            ...baseOptions.scales.y,
            ticks: {
              ...baseOptions.scales.y.ticks,
              callback: (value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: isMobile ? 'compact' : 'standard',
                  maximumFractionDigits: 0
                }).format(value);
              }
            }
          }
        }
      }
    });
  }

  getIcon(name) {
    // Icon SVGs implementation
    const icons = {
      'solar-panel': `<svg class="w-6 h-6 text-blue-500" ...></svg>`,
      'lightning-bolt': `<svg class="w-6 h-6 text-yellow-500" ...></svg>`,
      'leaf': `<svg class="w-6 h-6 text-green-500" ...></svg>`,
      'home': `<svg class="w-6 h-6 text-gray-500" ...></svg>`,
      'piggy-bank': `<svg class="w-6 h-6 text-green-500" ...></svg>`,
      'shield-check': `<svg class="w-6 h-6 text-blue-500" ...></svg>`
    };
    return icons[name] || '';
  }

  startAnimations() {
    // Initialize GSAP timeline for card animations
    const cards = document.querySelectorAll('#system-sizing > div');
    
    gsap.fromTo(cards, 
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "power2.out",
        onComplete: () => {
          // Start other animations after cards are visible
          this.startCountUps();
          if (this.progressBar) {
            this.progressBar.animate(0.75); // Example value
          }
        }
      }
    );
  }

  attachStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Add any custom styles we need */
      #system-sizing {
        scrollbar-width: thin;
        scrollbar-color: rgba(0,0,0,0.2) transparent;
      }

      #system-sizing::-webkit-scrollbar {
        width: 6px;
      }

      #system-sizing::-webkit-scrollbar-track {
        background: transparent;
      }

      #system-sizing::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.2);
        border-radius: 3px;
      }

      @media (max-width: 640px) {
        #system-sizing .text-2xl {
          font-size: 1.25rem;
        }
        #system-sizing .text-lg {
          font-size: 1rem;
        }
        #system-sizing .p-4 {
          padding: 0.75rem;
        }
        #system-sizing .gap-4 {
          gap: 0.75rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Utility methods
  calculateIncentives() {
    const federalTaxCredit = this.billData.estimatedSystemCost * 0.3;
    const stateTaxCredit = this.billData.estimatedSystemCost * 0.1;
    return (federalTaxCredit + stateTaxCredit).toFixed(0);
  }
   // Helper methods
   prepareCostBreakdownData() {
    const equipmentCost = this.billData.estimatedSystemCost * 0.6;
    const laborCost = this.billData.estimatedSystemCost * 0.3;
    const permitsCost = this.billData.estimatedSystemCost * 0.1;

    return {
      labels: ["Equipment", "Labor", "Permits & Misc"],
      values: [equipmentCost, laborCost, permitsCost]
    };
  }

  preparePaybackData() {
    const paybackYears = Math.ceil(this.billData.estimatedPaybackPeriod);
    const labels = Array.from({ length: paybackYears + 1 }, (_, i) => i);
    const savings = Array.from(
      { length: paybackYears + 1 },
      (_, i) => i * this.billData.estimatedAnnualSavings
    );
    const cost = Array(paybackYears + 1).fill(this.billData.estimatedSystemCost);

    return { labels, savings, cost };
  }

  

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}