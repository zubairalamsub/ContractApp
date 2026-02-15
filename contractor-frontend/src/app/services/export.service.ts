import { Injectable } from '@angular/core';
import { Contract, ContractItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  // Export contracts list to CSV
  exportContractsToCSV(contracts: Contract[], filename: string = 'contracts-report'): void {
    const headers = ['Contract #', 'Title', 'Client', 'Status', 'Total Budget', 'Spent Amount', 'Progress %', 'Start Date', 'End Date'];

    const rows = contracts.map(c => [
      c.contractNumber,
      `"${c.title}"`,
      `"${c.client}"`,
      c.status,
      c.totalBudget,
      c.spentAmount,
      c.totalBudget > 0 ? Math.round((c.spentAmount / c.totalBudget) * 100) : 0,
      this.formatDate(c.startDate),
      this.formatDate(c.endDate)
    ]);

    this.downloadCSV(headers, rows, filename);
  }

  // Export single contract detail to CSV
  exportContractDetailToCSV(contract: Contract, items: ContractItem[], filename?: string): void {
    const contractInfo = [
      ['CONTRACT REPORT'],
      [],
      ['Contract Number', contract.contractNumber],
      ['Title', contract.title],
      ['Client', contract.client],
      ['Status', contract.status],
      ['Start Date', this.formatDate(contract.startDate)],
      ['End Date', this.formatDate(contract.endDate)],
      ['Total Budget', `BDT ${contract.totalBudget.toLocaleString()}`],
      ['Spent Amount', `BDT ${contract.spentAmount.toLocaleString()}`],
      ['Progress', `${contract.totalBudget > 0 ? Math.round((contract.spentAmount / contract.totalBudget) * 100) : 0}%`],
      [],
      ['CONTRACT ITEMS'],
      ['Name', 'Category', 'Supplier', 'Quantity', 'Used', 'Unit', 'Unit Price', 'Total Price', 'Status']
    ];

    const itemRows = items.map(item => [
      `"${item.name}"`,
      item.category?.name || '-',
      item.supplier?.name || '-',
      item.quantity,
      item.usedQuantity,
      item.unit,
      item.unitPrice,
      item.quantity * item.unitPrice,
      item.deliveryStatus
    ]);

    const allRows = [...contractInfo, ...itemRows];
    const csvContent = allRows.map(row => row.join(',')).join('\n');

    this.downloadFile(csvContent, filename || `contract-${contract.contractNumber}-report`, 'csv');
  }

  // Export contracts list to Excel-compatible format (HTML table)
  exportContractsToExcel(contracts: Contract[], filename: string = 'contracts-report'): void {
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #4f46e5; color: white; font-weight: bold;">
              <th>Contract #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Status</th>
              <th>Total Budget (BDT)</th>
              <th>Spent Amount (BDT)</th>
              <th>Progress %</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
    `;

    contracts.forEach(c => {
      const progress = c.totalBudget > 0 ? Math.round((c.spentAmount / c.totalBudget) * 100) : 0;
      const statusColor = this.getStatusColor(c.status);
      html += `
        <tr>
          <td>${c.contractNumber}</td>
          <td>${c.title}</td>
          <td>${c.client}</td>
          <td style="background-color: ${statusColor}; color: white;">${c.status}</td>
          <td style="text-align: right;">${c.totalBudget.toLocaleString()}</td>
          <td style="text-align: right;">${c.spentAmount.toLocaleString()}</td>
          <td style="text-align: center;">${progress}%</td>
          <td>${this.formatDate(c.startDate)}</td>
          <td>${this.formatDate(c.endDate)}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    this.downloadFile(html, filename, 'xls');
  }

  // Export single contract to Excel-compatible format
  exportContractDetailToExcel(contract: Contract, items: ContractItem[], filename?: string): void {
    const progress = contract.totalBudget > 0 ? Math.round((contract.spentAmount / contract.totalBudget) * 100) : 0;

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <h2 style="color: #4f46e5;">Contract Report: ${contract.contractNumber}</h2>

        <table border="1" style="margin-bottom: 20px;">
          <tr><td style="background: #f1f5f9; font-weight: bold;">Contract Number</td><td>${contract.contractNumber}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Title</td><td>${contract.title}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Client</td><td>${contract.client}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Status</td><td style="background: ${this.getStatusColor(contract.status)}; color: white;">${contract.status}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Start Date</td><td>${this.formatDate(contract.startDate)}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">End Date</td><td>${this.formatDate(contract.endDate)}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Total Budget</td><td style="text-align: right;">BDT ${contract.totalBudget.toLocaleString()}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Spent Amount</td><td style="text-align: right;">BDT ${contract.spentAmount.toLocaleString()}</td></tr>
          <tr><td style="background: #f1f5f9; font-weight: bold;">Progress</td><td>${progress}%</td></tr>
        </table>

        <h3>Contract Items (${items.length})</h3>
        <table border="1">
          <thead>
            <tr style="background-color: #4f46e5; color: white; font-weight: bold;">
              <th>Item Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Used</th>
              <th>Unit</th>
              <th>Unit Price (BDT)</th>
              <th>Total (BDT)</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    items.forEach(item => {
      const deliveryColor = this.getDeliveryStatusColor(item.deliveryStatus);
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.category?.name || '-'}</td>
          <td>${item.supplier?.name || '-'}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: center;">${item.usedQuantity}</td>
          <td style="text-align: center;">${item.unit}</td>
          <td style="text-align: right;">${item.unitPrice.toLocaleString()}</td>
          <td style="text-align: right;">${(item.quantity * item.unitPrice).toLocaleString()}</td>
          <td style="background: ${deliveryColor}; color: white;">${item.deliveryStatus}</td>
        </tr>
      `;
    });

    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    html += `
          </tbody>
          <tfoot>
            <tr style="background: #f1f5f9; font-weight: bold;">
              <td colspan="7" style="text-align: right;">Total Items Value:</td>
              <td style="text-align: right;">BDT ${totalValue.toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
          Generated on: ${new Date().toLocaleString()}
        </p>
      </body>
      </html>
    `;

    this.downloadFile(html, filename || `contract-${contract.contractNumber}-report`, 'xls');
  }

  // Print contract report
  printContractReport(contract: Contract, items: ContractItem[]): void {
    const progress = contract.totalBudget > 0 ? Math.round((contract.spentAmount / contract.totalBudget) * 100) : 0;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contract Report - ${contract.contractNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
          .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4f46e5; }
          .header h1 { color: #4f46e5; font-size: 24px; }
          .header .contract-num { font-size: 14px; color: #6b7280; margin-top: 4px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; background: ${this.getStatusColor(contract.status)}; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
          .info-card { background: #f8fafc; padding: 16px; border-radius: 8px; }
          .info-card label { font-size: 12px; color: #6b7280; display: block; margin-bottom: 4px; }
          .info-card value { font-size: 16px; font-weight: 600; }
          .stats { display: flex; gap: 20px; margin-bottom: 30px; }
          .stat-box { flex: 1; background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-box .value { font-size: 24px; font-weight: 700; color: #4f46e5; }
          .stat-box .label { font-size: 12px; color: #6b7280; }
          h2 { margin: 30px 0 15px; font-size: 18px; color: #1a1a2e; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #4f46e5; color: white; font-weight: 600; font-size: 12px; text-transform: uppercase; }
          tr:nth-child(even) { background: #f8fafc; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${contract.title}</h1>
            <div class="contract-num">${contract.contractNumber}</div>
          </div>
          <span class="status">${contract.status}</span>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <label>Client</label>
            <value>${contract.client}</value>
          </div>
          <div class="info-card">
            <label>Timeline</label>
            <value>${this.formatDate(contract.startDate)} - ${this.formatDate(contract.endDate)}</value>
          </div>
        </div>

        <div class="stats">
          <div class="stat-box">
            <div class="value">BDT ${contract.totalBudget.toLocaleString()}</div>
            <div class="label">Total Budget</div>
          </div>
          <div class="stat-box">
            <div class="value">BDT ${contract.spentAmount.toLocaleString()}</div>
            <div class="label">Spent Amount</div>
          </div>
          <div class="stat-box">
            <div class="value">${progress}%</div>
            <div class="label">Progress</div>
          </div>
          <div class="stat-box">
            <div class="value">${items.length}</div>
            <div class="label">Total Items</div>
          </div>
        </div>

        <h2>Contract Items</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th class="text-center">Qty</th>
              <th class="text-center">Used</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.category?.name || '-'}</td>
                <td>${item.supplier?.name || '-'}</td>
                <td class="text-center">${item.quantity} ${item.unit}</td>
                <td class="text-center">${item.usedQuantity}</td>
                <td class="text-right">BDT ${item.unitPrice.toLocaleString()}</td>
                <td class="text-right">BDT ${(item.quantity * item.unitPrice).toLocaleString()}</td>
                <td>${item.deliveryStatus}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>ContractorPro - Contract Management System</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  private downloadCSV(headers: string[], rows: any[][], filename: string): void {
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    this.downloadFile(csvContent, filename, 'csv');
  }

  private downloadFile(content: string, filename: string, extension: string): void {
    const blob = new Blob([content], {
      type: extension === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.${extension}`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Draft': '#6b7280',
      'Active': '#10b981',
      'Completed': '#3b82f6',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  private getDeliveryStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Pending': '#f59e0b',
      'Ordered': '#3b82f6',
      'Delivered': '#10b981',
      'Installed': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  }
}
