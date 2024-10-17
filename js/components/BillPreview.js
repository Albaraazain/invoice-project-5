export class BillPreview {
  constructor(billData) {
    this.billData = billData;
  }

  render(container) {
    container.innerHTML = `
      <div class="bill-preview">
        <div class="invoice">
          <div class="header">
            <div class="logo">MEPCO</div>
            <div class="bill-number">Bill #${this.billData.referenceNumber}</div>
          </div>
          <div class="content">
            <div class="info-section">
              <div class="customer-info">
                <h3>Bill To</h3>
                <p>${this.billData.customerName}</p>
                <p>${this.billData.address}</p>
                <p>${this.billData.phoneNumber}</p>
              </div>
              <div class="company-info">
                <h3>From</h3>
                <p>Multan Electric Power Company</p>
                <p>MEPCO Headquarters, Khanewal Road</p>
                <p>Multan, Pakistan</p>
              </div>
            </div>
            <div class="dates-info">
              <p><span>Issue Date:</span> ${this.billData.issueDate}</p>
              <p><span>Due Date:</span> ${this.billData.dueDate}</p>
            </div>
            <div class="bill-details">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Units</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Electricity Consumption</td>
                    <td>${this.billData.unitsConsumed}</td>
                    <td>${this.billData.ratePerUnit}</td>
                    <td>${this.billData.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bill-summary">
              <div class="summary-item">
                <span>Subtotal</span>
                <span>${this.billData.amount}</span>
              </div>
              <div class="summary-item">
                <span>Tax (${this.billData.taxRate}%)</span>
                <span>${this.billData.taxAmount}</span>
              </div>
              <div class="summary-item total">
                <span>Total Due</span>
                <span>${this.billData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.attachStyles();
  }

  attachStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .bill-preview {
        font-family: Arial, sans-serif;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        box-sizing: border-box;
      }
      .invoice {
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 8px;
        padding: 1.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
      }
      .bill-number {
        font-size: 0.9rem;
        color: #7f8c8d;
      }
      .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      .info-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .customer-info, .company-info {
        flex: 1;
      }
      h3 {
        color: #2c3e50;
        margin-bottom: 0.3rem;
        font-size: 1rem;
        text-transform: uppercase;
      }
      p {
        margin: 0;
        line-height: 1.3;
        color: #34495e;
        font-size: 0.9rem;
      }
      .dates-info {
        margin-bottom: 1rem;
      }
      .dates-info p {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;
        font-size: 0.9rem;
      }
      .bill-details {
        margin-bottom: 1rem;
        flex-grow: 1;
        overflow-y: auto;
      }
      .bill-details table {
        width: 100%;
        border-collapse: collapse;
      }
      .bill-details th, .bill-details td {
        padding: 0.5rem;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
        font-size: 0.9rem;
      }
      .bill-details th {
        font-weight: bold;
        color: #2c3e50;
        text-transform: uppercase;
      }
      .bill-summary {
        margin-top: auto;
        border-top: 1px solid #e0e0e0;
        padding-top: 0.5rem;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
      }
      .summary-item.total {
        font-weight: bold;
        font-size: 1.1rem;
        color: #2c3e50;
        margin-top: 0.5rem;
      }
      @media (max-height: 600px) {
        .invoice {
          font-size: 0.8rem;
        }
        .logo {
          font-size: 1.2rem;
        }
        h3 {
          font-size: 0.9rem;
        }
        .bill-details th, .bill-details td {
          padding: 0.3rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}