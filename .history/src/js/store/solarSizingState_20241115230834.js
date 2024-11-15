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

export function setAnimationShown() {
  localStorage.setItem("billReviewAnimationShown", "true");
}

export function hasAnimationBeenShown() {
  return localStorage.getItem("billReviewAnimationShown") === "true";
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
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data with valid values
    const unitsConsumed = Math.floor(Math.random() * 500) + 300;
    const ratePerUnit = (Math.random() * 5 + 15).toFixed(2);
    const amount = (unitsConsumed * ratePerUnit).toFixed(2);

    const mockData = {
      referenceNumber,
      unitsConsumed,
      ratePerUnit: parseFloat(ratePerUnit),
      amount: parseFloat(amount),
      recommendedSystemSize: parseFloat((unitsConsumed / 30 / 4).toFixed(2)),
      estimatedDailyProduction: parseFloat((unitsConsumed / 30).toFixed(2)),
      estimatedMonthlyProduction: unitsConsumed,
      estimatedAnnualProduction: unitsConsumed * 12,
      estimatedSystemCost: Math.round((unitsConsumed / 30 / 4) * 100000),
      estimatedAnnualSavings: Math.round(
        unitsConsumed * 12 * parseFloat(ratePerUnit)
      ),
      estimatedPaybackPeriod: parseFloat(
        (
          ((unitsConsumed / 30 / 4) * 100000) /
          (unitsConsumed * 12 * parseFloat(ratePerUnit))
        ).toFixed(1)
      ),
    };

    console.log("Generated mock data:", mockData); // Add this log
    saveBillData(mockData);
    return mockData;
  } catch (error) {
    console.error("Error in fetchBillData:", error);
    throw error;
  }
}
