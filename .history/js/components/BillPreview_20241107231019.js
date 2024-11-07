export class BillPreview {
  constructor(billData) {
    this.billData = billData;
  }

  render(container) {
    container.innerHTML = `
      <div class="flex h-full w-full items-center justify-center p-4">
        <div class="w-full max-w-[210mm] min-h-[100mm] bg-white rounded-lg shadow-md p-6  flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-gray-800">MEPCO</div>
            <div class="text-sm text-gray-600">Bill #${this.billData.referenceNumber}</div>
          </div>
          
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h3 class="text-sm font-semibold uppercase text-gray-700 mb-1">Bill To</h3>
                <p class="text-sm text-gray-600">${this.billData.customerName}</p>
                <p class="text-sm text-gray-600">${this.billData.address}</p>
                <p class="text-sm text-gray-600">${this.billData.phoneNumber}</p>
              </div>
              <div>
                <h3 class="text-sm font-semibold uppercase text-gray-700 mb-1">From</h3>
                <p class="text-sm text-gray-600">Multan Electric Power Company</p>
                <p class="text-sm text-gray-600">MEPCO Headquarters, Khanewal Road</p>
                <p class="text-sm text-gray-600">Multan, Pakistan</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <p class="text-gray-600"><span class="font-medium">Issue Date:</span> ${this.billData.issueDate}</p>
              <p class="text-gray-600"><span class="font-medium">Due Date:</span> ${this.billData.dueDate}</p>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th class="py-3 px-4">Description</th>
                    <th class="py-3 px-4">Units</th>
                    <th class="py-3 px-4">Rate</th>
                    <th class="py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr class="text-sm text-gray-600">
                    <td class="py-4 px-4">Electricity Consumption</td>
                    <td class="py-4 px-4">${this.billData.unitsConsumed}</td>
                    <td class="py-4 px-4">${this.billData.ratePerUnit}</td>
                    <td class="py-4 px-4">${this.billData.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="space-y-2 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="text-gray-800">${this.billData.amount}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax (${this.billData.taxRate}%)</span>
                <span class="text-gray-800">${this.billData.taxAmount}</span>
              </div>
              <div class="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span>Total Due</span>
                <span>${this.billData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}