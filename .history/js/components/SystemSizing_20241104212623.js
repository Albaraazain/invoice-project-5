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
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = {};

    if (this.progressBar) {
      this.progressBar.destroy();
      this.progressBar = null;
    }

    Object.values(this.countUps).forEach((countUp) => {
      if (countUp) {
        countUp.reset();
      }
    });
    this.countUps = {};
  }

  render(container) {
    this.cleanup();
  
    container.innerHTML = `
      <div id="system-sizing" class="w-full h-full px-4 py-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Solar System Dashboard</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${this.renderSystemSizeCard()}
          ${this.renderEstimatedCostCard()}
          ${this.renderPaybackPeriodCard()}
          ${this.renderEnergyProductionSection()}
          ${this.renderSystemDetailsSection()}
        </div>
      </div>
    `;
  
    this.attachStyles();
    
    // Initialize components immediately
    this.initSystemSizeProgress();
    this.initEnergyProductionChart();
    this.initCostBreakdownChart();
    this.initPaybackPeriodChart();
    this.initCountUps();
  
    // Prepare elements for animation
    const systemSizing = document.getElementById("system-sizing");
    const cards = systemSizing.querySelectorAll(".grid > div");
    gsap.set(systemSizing, { opacity: 0 });
    gsap.set(cards, { opacity: 0, y: 50 });
  }

  renderSystemSizeCard() {
    return `
      <div id="system-size-card" class="bg-white rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">System Size</h3>
        <div class="flex items-center justify-between">
          <div class="w-20 h-20" id="system-size-progress"></div>
          <div class="text-right">
            <p class="text-3xl font-bold text-gray-900">
              <span id="system-size-value">0</span>
            </p>
            <p class="text-sm text-gray-500">kW</p>
          </div>
        </div>
        <p class="mt-4 text-sm text-gray-600">Recommended size based on your energy consumption</p>
      </div>
    `;
  }

  renderEstimatedCostCard() {
    return `
      <div id="estimated-cost-card" class="bg-white rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Estimated Cost</h3>
        <div class="flex items-center justify-between mb-2">
          <p class="text-2xl font-bold text-gray-800">$<span id="estimated-cost-value">0</span></p>
          <div class="text-xs text-gray-600">
            <p>Before incentives</p>
            <p class="font-semibold text-green-600">-$${this.calculateIncentives()} in incentives</p>
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
      <div id="payback-period-card" class="bg-white rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Payback Period</h3>
        <div class="flex items-center justify-between mb-2">
          <p class="text-2xl font-bold text-gray-800"><span id="payback-period-value">0</span> years</p>
          <div class="text-xs text-gray-600">
            <p>Estimated savings</p>
            <p class="font-semibold text-green-600">$<span id="annual-savings-value">0</span>/year</p>
          </div>
        </div>
        <div class="h-32">
          <canvas id="payback-period-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderEnergyProductionSection() {
    return `
      <div id="energy-production-card" class="col-span-full bg-white rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Energy Production</h3>
        <div class="grid grid-cols-2 gap-2 mb-4">
          ${this.renderEnergyProductionStat(
            "Daily",
            "daily-production-value",
            "kWh"
          )}
          ${this.renderEnergyProductionStat(
            "Monthly",
            "monthly-production-value",
            "kWh"
          )}
          ${this.renderEnergyProductionStat(
            "Annual",
            "annual-production-value",
            "kWh"
          )}
          ${this.renderEnergyProductionStat(
            "Coverage",
            "coverage-percentage-value",
            "%"
          )}
        </div>
        <div class="h-48">
          <canvas id="energy-production-chart"></canvas>
        </div>
      </div>
    `;
  }

  renderEnergyProductionStat(label, id, unit) {
    return `
      <div class="bg-gray-100 rounded p-2">
        <p class="text-xs font-medium text-gray-600">${label}</p>
        <p class="text-sm font-semibold text-gray-800 mt-1">
          <span id="${id}">0</span> ${unit}
        </p>
      </div>
    `;
  }

  renderSystemDetailsSection() {
    return `
      <div id="system-details-card" class="col-span-full bg-white rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">System Details</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          ${this.renderDetailCard(
            "Number of Panels",
            "number-of-panels-value",
            "solar-panel"
          )}
          ${this.renderDetailCard(
            "Panel Wattage",
            "panel-wattage-value",
            "W",
            "lightning-bolt"
          )}
          ${this.renderDetailCard(
            "Annual Savings",
            "annual-savings-detail-value",
            "$",
            "piggy-bank"
          )}
          ${this.renderDetailCard(
            "CO2 Offset",
            "co2-offset-value",
            "tons",
            "leaf"
          )}
          ${this.renderDetailCard(
            "Roof Area",
            "roof-area-value",
            "sq ft",
            "home"
          )}
          ${this.renderDetailCard("Warranty", "25", "years", "shield-check")}
        </div>
      </div>
    `;
  }

  renderDetailCard(label, id, unit, iconName) {
    return `
      <div class="bg-gray-50 rounded p-2 flex items-center space-x-2">
        <div class="flex-shrink-0">
          ${this.getIcon(iconName)}
        </div>
        <div>
          <p class="text-xs font-medium text-gray-600">${label}</p>
          <p class="text-sm font-semibold text-gray-800"><span id="${id}">0</span> ${unit}</p>
        </div>
      </div>
    `;
  }

  getIcon(name) {
    const icons = {
      "solar-panel":
        '<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      "lightning-bolt":
        '<svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      "piggy-bank":
        '<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      leaf: '<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>',
      home: '<svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
      "shield-check":
        '<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    };
    return icons[name] || "";
  }

  initSystemSizeProgress() {
    const progressContainer = document.getElementById("system-size-progress");
    if (!progressContainer) return;

    this.progressBar = new ProgressBar.Circle(progressContainer, {
      color: "#ffffff",
      trailColor: "rgba(255,255,255,0.3)",
      trailWidth: 4,
      duration: 1500,
      easing: "easeInOut",
      strokeWidth: 8,
      from: { color: "#84C1FF", width: 4 },
      to: { color: "#ffffff", width: 8 },
      step: (state, circle) => {
        circle.path.setAttribute("stroke", state.color);
        circle.path.setAttribute("stroke-width", state.width);

        const value = Math.round(circle.value() * 100);
        circle.setText(`${value}%`);
      },
    });

    this.progressBar.text.style.fontSize = "1rem";
    this.progressBar.text.style.fontWeight = "bold";

    // Animate to a value between 0.6 and 0.9 to show system size relative to max capacity
    const progressValue = 0.6 + Math.random() * 0.3;
    this.progressBar.animate(progressValue);
  }

  initEnergyProductionChart() {
    const ctx = document.getElementById("energy-production-chart");
    if (!ctx) return;

    const monthlyData = this.generateMonthlyData();

    this.charts.energyProduction = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlyData.map((d) => d.month),
        datasets: [
          {
            label: "Energy Production (kWh)",
            data: monthlyData.map((d) => d.production),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#111827',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
            },
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#6b7280',
            },
          },
        },
      }
    });
  }

  initCostBreakdownChart() {
    const ctx = document.getElementById("cost-breakdown-chart");
    if (!ctx) return;

    const equipmentCost = this.billData.estimatedSystemCost * 0.6;
    const laborCost = this.billData.estimatedSystemCost * 0.3;
    const permitsCost = this.billData.estimatedSystemCost * 0.1;

    this.charts.costBreakdown = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Equipment", "Labor", "Permits & Misc"],
        datasets: [
          {
            data: [equipmentCost, laborCost, permitsCost],
            backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const percentage = (
                  (value / this.billData.estimatedSystemCost) *
                  100
                ).toFixed(1);
                return `${label}: $${value.toFixed(0)} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "70%",
      },
    });
  }

  initPaybackPeriodChart() {
    const ctx = document.getElementById("payback-period-chart");
    if (!ctx) return;

    const paybackYears = Math.ceil(this.billData.estimatedPaybackPeriod);
    const labels = Array.from(
      { length: paybackYears + 1 },
      (_, i) => `Year ${i}`
    );
    const cumulativeSavings = Array.from(
      { length: paybackYears + 1 },
      (_, i) => i * this.billData.estimatedAnnualSavings
    );

    this.charts.paybackPeriod = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Cumulative Savings",
            data: cumulativeSavings,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "System Cost",
            data: Array(paybackYears + 1).fill(
              this.billData.estimatedSystemCost
            ),
            borderColor: "#EF4444",
            borderDash: [5, 5],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: function (value, index, values) {
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumSignificantDigits: 3,
                }).format(value);
              },
            },
          },
        },
      },
    });
  }

  generateMonthlyData() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({
      month,
      production: Math.floor(Math.random() * 1000) + 500, // Random value between 500 and 1500
    }));
  }

  calculateIncentives() {
    const federalTaxCredit = this.billData.estimatedSystemCost * 0.3; // 30% federal tax credit
    const stateTaxCredit = this.billData.estimatedSystemCost * 0.1; // Assume 10% state tax credit
    return (federalTaxCredit + stateTaxCredit).toFixed(0);
  }

  calculateCO2Offset() {
    const annualProduction = this.billData.estimatedAnnualProduction;
    const co2PerKWh = 0.0007; // tons of CO2 per kWh (average US grid)
    return (annualProduction * co2PerKWh).toFixed(2);
  }

  calculateRoofArea() {
    const panelArea = 17.5; // average area of a single solar panel in sq ft
    return (this.billData.numberOfPanels * panelArea).toFixed(0);
  }

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

  animateAll() {
    return new Promise((resolve) => {
      const systemSizing = document.getElementById("system-sizing");
      const cards = systemSizing.querySelectorAll(".grid > div");
  
      gsap.to(systemSizing, {
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => {
              this.startAnimations();
              resolve();
            }
          });
        }
      });
    });
  }
  
  startAnimations() {
    if (this.progressBar) {
      const progressValue = 0.6 + Math.random() * 0.3;
      this.progressBar.animate(progressValue);
    }
    this.startCountUps();
  }


  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
      ${this.getBaseStyles()}
      #system-sizing {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      #system-sizing .bg-white {
        background-color: #ffffff;
      }
      #system-sizing .text-gray-900 {
        color: #111827;
      }
      #system-sizing .text-gray-800 {
        color: #1f2937;
      }
      #system-sizing .text-gray-600 {
        color: #4b5563;
      }
      #system-sizing .text-gray-500 {
        color: #6b7280;
      }
      #system-sizing .shadow-sm {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      #system-sizing .rounded-lg {
        border-radius: 0.5rem;
      }
      #system-sizing .p-6 {
        padding: 1.5rem;
      }
      #system-sizing .grid {
        display: grid;
        gap: 1.5rem;
      }
      #system-sizing .font-semibold {
        font-weight: 600;
      }
      #system-sizing .font-bold {
        font-weight: 700;
      }
      #system-sizing .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      #system-sizing .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
      #system-sizing .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }
      #system-sizing .mb-4 {
        margin-bottom: 1rem;
      }
      #system-sizing .mt-4 {
        margin-top: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  getBaseStyles() {
    return `
          #system-sizing .bg-white {
            background-color: #ffffff;
          }
          #system-sizing .text-gray-800 {
            color: #1f2937;
          }
          #system-sizing .text-gray-600 {
            color: #4b5563;
          }
          #system-sizing .shadow-md {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          #system-sizing .rounded-lg {
            border-radius: 0.5rem;
          }
          #system-sizing .p-4 {
            padding: 1rem;
          }
          #system-sizing .grid {
            display: grid;
          }
          #system-sizing .gap-4 {
            gap: 1rem;
          }
          #system-sizing .font-semibold {
            font-weight: 600;
          }
          #system-sizing .font-bold {
            font-weight: 700;
          }
          #system-sizing .text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }
          #system-sizing .text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          #system-sizing .text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          #system-sizing .text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          #system-sizing .mb-2 {
            margin-bottom: 0.5rem;
          }
          #system-sizing .mt-1 {
            margin-top: 0.25rem;
          }
          #system-sizing .col-span-full {
            grid-column: 1 / -1;
          }
          @media (min-width: 640px) {
            #system-sizing .sm\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            #system-sizing .sm\\:grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }
        `;
  }
}
