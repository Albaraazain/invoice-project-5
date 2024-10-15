// js/components/BillPreview.js
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
      `;
      this.attachStyles();
    }
  
    attachStyles() {
      const style = document.createElement("style");
      style.textContent = `
        .bill-preview {
          font-family: Arial, sans-serif;
          width: 21cm;
          height: 29.7cm;
          margin: 1cm auto;
          background-color: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .invoice {
          padding: 2cm;
          height: calc(100% - 2cm);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2cm;
        }
        .logo {
          font-size: 2em;
          font-weight: bold;
          color: #2c3e50;
        }
        .bill-number {
          font-size: 1em;
          color: #7f8c8d;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2cm;
        }
        .customer-info, .company-info {
          flex: 1;
        }
        h3 {
          color: #2c3e50;
          margin-bottom: 0.5cm;
          font-size: 1em;
          text-transform: uppercase;
        }
        p {
          margin: 0;
          line-height: 1.5;
          color: #34495e;
        }
        .dates-info {
          margin-bottom: 2cm;
        }
        .dates-info p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.2cm;
        }
        .bill-details {
          flex-grow: 1;
        }
        .bill-details table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2cm;
        }
        .bill-details th, .bill-details td {
          padding: 0.5cm;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }
        .bill-details th {
          font-weight: bold;
          color: #2c3e50;
          text-transform: uppercase;
        }
        .bill-summary {
          margin-top: auto;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5cm;
        }
        .summary-item.total {
          font-weight: bold;
          font-size: 1.2em;
          color: #2c3e50;
          border-top: 1px solid #e0e0e0;
          padding-top: 0.5cm;
          margin-top: 0.5cm;
        }
      `;
      document.head.appendChild(style);
    }
  }