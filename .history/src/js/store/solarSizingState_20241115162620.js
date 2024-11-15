// js/store/solarSizingState.js

let state = {
  billData: null,
  isLoading: false,
  error: null,
};

export function initializeSolarSizingState() {
  const savedData = localStorage.getItem("billData");
  if (savedData) {
    state.billData = JSON.parse(savedData);
  }
}

export function getBillData() {
  const savedData = localStorage.getItem("billData");
  console.log("Retrieved saved data:", savedData); // Add this log
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error("Error parsing saved bill data:", error);
      return null;
    }
  }
  return null;
}

export function saveBillData(billData) {
  console.log("Saving bill data:", billData); // Add this log
  try {
    localStorage.setItem("billData", JSON.stringify(billData));
  } catch (error) {
    console.error("Error saving bill data:", error);
  }
}

export function getIsLoading() {
  return state.isLoading;
}

export function getError() {
  return state.error;
}

export async function fetchBillData(referenceNumber) {
  state.isLoading = true;
  state.error = null;

  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data (similar to the Vue version)
    const unitsConsumed = Math.floor(Math.random() * 500) + 300;
    const ratePerUnit = (Math.random() * 5 + 15).toFixed(2);
    const amount = (unitsConsumed * ratePerUnit).toFixed(2);
    const taxRate = 10;
    const taxAmount = (amount * (taxRate / 100)).toFixed(2);
    const totalAmount = (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2);

    // Solar system calculation (simplified)
    const systemSize = (unitsConsumed / 30 / 4).toFixed(2);
    const numberOfPanels = Math.ceil((systemSize * 1000) / 400);
    const estimatedDailyProduction = (systemSize * 4).toFixed(2);
    const estimatedMonthlyProduction = (estimatedDailyProduction * 30).toFixed(
      2
    );
    const estimatedAnnualProduction = (estimatedDailyProduction * 365).toFixed(
      2
    );
    const coveragePercentage = (
      (estimatedMonthlyProduction / unitsConsumed) *
      100
    ).toFixed(2);

    state.billData = {
      referenceNumber,
      customerName: "John Doe",
      address: "123 Solar Street, Sunny City, Pakistan",
      phoneNumber: "+92 300 1234567",
      issueDate: new Date().toLocaleDateString(),
      dueDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      unitsConsumed,
      ratePerUnit,
      amount,
      taxRate,
      taxAmount,
      totalAmount,
      averageMonthlyConsumption: unitsConsumed,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      recommendedSystemSize: parseFloat(systemSize),
      numberOfPanels,
      panelWattage: 400,
      estimatedDailyProduction: parseFloat(estimatedDailyProduction),
      estimatedMonthlyProduction: parseFloat(estimatedMonthlyProduction),
      estimatedAnnualProduction: parseFloat(estimatedAnnualProduction),
      coveragePercentage: parseFloat(coveragePercentage),
      estimatedSystemCost: Math.round(systemSize * 100000),
      estimatedAnnualSavings: Math.round(
        estimatedAnnualProduction * ratePerUnit
      ),
      estimatedPaybackPeriod: (
        (systemSize * 100000) /
        (estimatedAnnualProduction * ratePerUnit)
      ).toFixed(1),
    };
    saveBillData(state.billData);
  } catch (err) {
    state.error = "Failed to fetch bill data. Please try again.";
    console.error("Error fetching bill data:", err);
  } finally {
    state.isLoading = false;
  }
}
