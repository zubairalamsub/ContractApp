import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';
import { Contract, ContractItem, Category, Supplier } from '../../models';
import { ItemDialogComponent } from './item-dialog.component';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatChipsModule, MatDialogModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatInputModule, MatSelectModule,
    MatFormFieldModule, MatTooltipModule, MatMenuModule
  ],
  template: `
    <div class="contract-detail fade-in">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading contract details...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon>error_outline</mat-icon>
        <h3>Failed to load contract</h3>
        <p>{{error}}</p>
        <button mat-raised-button color="primary" routerLink="/contracts">
          <mat-icon>arrow_back</mat-icon>
          Back to Contracts
        </button>
      </div>

    <div class="contract-content" *ngIf="contract && !loading">
      <div class="header">
        <div class="back-btn">
          <button mat-icon-button routerLink="/contracts">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1>{{contract.title}}</h1>
            <span class="contract-number">{{contract.contractNumber}}</span>
          </div>
        </div>
        <div class="header-actions">
          <button mat-stroked-button [matMenuTriggerFor]="exportMenu" class="export-btn">
            <mat-icon>download</mat-icon>
            Export
          </button>
          <mat-menu #exportMenu="matMenu">
            <button mat-menu-item (click)="exportToExcel()">
              <mat-icon>table_chart</mat-icon>
              <span>Export to Excel</span>
            </button>
            <button mat-menu-item (click)="exportToCSV()">
              <mat-icon>description</mat-icon>
              <span>Export to CSV</span>
            </button>
            <button mat-menu-item (click)="printReport()">
              <mat-icon>print</mat-icon>
              <span>Print Report</span>
            </button>
          </mat-menu>
          <mat-chip [class]="'status-' + contract.status.toLowerCase()">
            {{contract.status}}
          </mat-chip>
        </div>
      </div>

      <div class="info-row">
        <mat-card class="info-card">
          <mat-card-content>
            <mat-icon>person</mat-icon>
            <div>
              <span class="label">Client</span>
              <span class="value">{{contract.client}}</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="info-card">
          <mat-card-content>
            <mat-icon>calendar_today</mat-icon>
            <div>
              <span class="label">Timeline</span>
              <span class="value">{{contract.startDate | date:'mediumDate'}} - {{contract.endDate | date:'mediumDate'}}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-card-content>
            <span class="stat-value">{{contract.totalBudget | currency:'BDT':'symbol':'1.0-0'}}</span>
            <span class="stat-label">Total Budget</span>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <span class="stat-value">{{contract.spentAmount | currency:'BDT':'symbol':'1.0-0'}}</span>
            <span class="stat-label">Spent Amount</span>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <span class="stat-value">{{items.length}}</span>
            <span class="stat-label">Total Items</span>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="progress-stat">
              <mat-progress-bar mode="determinate" [value]="getProgress()"></mat-progress-bar>
              <span class="stat-value">{{getProgress()}}%</span>
            </div>
            <span class="stat-label">Budget Used</span>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="items-card">
        <mat-card-header>
          <mat-card-title>Contract Items</mat-card-title>
          <button mat-raised-button color="primary" (click)="openItemDialog()">
            <mat-icon>add</mat-icon>
            Add Item
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Search items...">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Delivery Status</mat-label>
              <mat-select [(ngModel)]="statusFilter">
                <mat-option value="">All</mat-option>
                <mat-option value="Pending">Pending</mat-option>
                <mat-option value="Ordered">Ordered</mat-option>
                <mat-option value="Delivered">Delivered</mat-option>
                <mat-option value="Installed">Installed</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="filteredItems" class="items-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Item Name</th>
              <td mat-cell *matCellDef="let item">{{item.name}}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">
                <mat-chip [style.background-color]="item.category?.color" class="category-chip">
                  {{item.category?.name}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Supplier</th>
              <td mat-cell *matCellDef="let item">{{item.supplier?.name || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Qty/Used</th>
              <td mat-cell *matCellDef="let item">
                <div class="qty-cell">
                  <span>{{item.usedQuantity}}/{{item.quantity}} {{item.unit}}</span>
                  <mat-progress-bar mode="determinate" [value]="(item.usedQuantity / item.quantity) * 100"></mat-progress-bar>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef>Unit Price</th>
              <td mat-cell *matCellDef="let item">{{item.unitPrice | currency:'BDT':'symbol':'1.0-0'}}</td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let item">{{item.quantity * item.unitPrice | currency:'BDT':'symbol':'1.0-0'}}</td>
            </ng-container>

            <ng-container matColumnDef="deliveryStatus">
              <th mat-header-cell *matHeaderCellDef>Delivery</th>
              <td mat-cell *matCellDef="let item">
                <mat-chip [class]="'delivery-' + item.deliveryStatus.toLowerCase()">
                  {{item.deliveryStatus}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button (click)="openItemDialog(item)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteItem(item)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="itemColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: itemColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card class="suppliers-card" *ngIf="contractSuppliers.length > 0">
        <mat-card-header>
          <mat-card-title>Suppliers on this Contract</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="suppliers-grid">
            <mat-card *ngFor="let supplier of contractSuppliers" class="supplier-card">
              <mat-card-content>
                <h3>{{supplier.name}}</h3>
                <p><mat-icon>person</mat-icon> {{supplier.contactPerson}}</p>
                <p><mat-icon>email</mat-icon> {{supplier.email}}</p>
                <p><mat-icon>phone</mat-icon> {{supplier.phone}}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    </div>
  `,
  styles: [`
    .contract-detail {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 16px;

      p {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      ::ng-deep .mat-mdc-progress-spinner circle {
        stroke: var(--primary) !important;
      }
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 12px;
      text-align: center;

      mat-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        color: var(--error);
      }

      h3 {
        margin: 0;
        color: var(--text-primary);
      }

      p {
        margin: 0;
        color: var(--text-secondary);
      }

      button {
        margin-top: 8px;
        gap: 8px;
      }
    }

    .contract-content {
      animation: fadeIn 0.3s ease-out;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .back-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      h1 { margin: 0; color: #1a1a2e; }
      .contract-number { color: #6b7280; font-size: 14px; }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .export-btn {
      gap: 8px;
      height: 40px;
      border-color: var(--border-medium);
      mat-icon { color: var(--primary); }
      &:hover {
        border-color: var(--primary);
        background: rgba(79, 70, 229, 0.05);
      }
    }
    .info-row, .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 12px;
      mat-icon { color: #4361ee; }
      .label { font-size: 12px; color: #6b7280; display: block; }
      .value { font-weight: 500; }
    }
    .stat-card mat-card-content {
      text-align: center;
      padding: 16px;
    }
    .stat-value { font-size: 24px; font-weight: 600; color: #1a1a2e; display: block; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .progress-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
      mat-progress-bar { width: 80px; }
    }
    .items-card {
      margin-bottom: 24px;
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      mat-form-field { flex: 1; max-width: 300px; }
    }
    .items-table { width: 100%; }
    .qty-cell {
      mat-progress-bar { width: 60px; margin-top: 4px; }
    }
    .category-chip { color: white !important; }
    .delivery-pending { background: #fef3c7 !important; color: #92400e !important; }
    .delivery-ordered { background: #dbeafe !important; color: #1d4ed8 !important; }
    .delivery-delivered { background: #d1fae5 !important; color: #047857 !important; }
    .delivery-installed { background: #c7d2fe !important; color: #4338ca !important; }
    .status-draft { background: #e5e7eb !important; }
    .status-active { background: #d1fae5 !important; color: #047857 !important; }
    .status-completed { background: #dbeafe !important; color: #1d4ed8 !important; }
    .status-cancelled { background: #fee2e2 !important; color: #dc2626 !important; }
    .suppliers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    .supplier-card {
      h3 { margin: 0 0 12px; }
      p { display: flex; align-items: center; gap: 8px; margin: 8px 0; font-size: 14px; color: #6b7280;
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
    }
  `]
})
export class ContractDetailComponent implements OnInit {
  contract: Contract | null = null;
  items: ContractItem[] = [];
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  searchTerm = '';
  statusFilter = '';
  itemColumns = ['name', 'category', 'supplier', 'quantity', 'unitPrice', 'total', 'deliveryStatus', 'actions'];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContract(id);
    this.apiService.getCategories().subscribe(c => this.categories = c);
    this.apiService.getSuppliers().subscribe(s => this.suppliers = s);
  }

  loadContract(id: number) {
    this.loading = true;
    this.error = '';
    this.apiService.getContract(id).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.items = contract.items || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load contract';
        this.loading = false;
      }
    });
  }

  get filteredItems(): ContractItem[] {
    return this.items.filter(item => {
      const matchesSearch = !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || item.deliveryStatus === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get contractSuppliers(): Supplier[] {
    const supplierIds = [...new Set(this.items.filter(i => i.supplierId).map(i => i.supplierId))];
    return this.suppliers.filter(s => supplierIds.includes(s.id));
  }

  getProgress(): number {
    if (!this.contract || this.contract.totalBudget === 0) return 0;
    return Math.round((this.contract.spentAmount / this.contract.totalBudget) * 100);
  }

  openItemDialog(item?: ContractItem) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '600px',
      data: {
        item: item || null,
        contractId: this.contract?.id,
        categories: this.categories,
        suppliers: this.suppliers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.contract) {
        this.loadContract(this.contract.id);
      }
    });
  }

  deleteItem(item: ContractItem) {
    if (this.contract && confirm(`Delete item "${item.name}"?`)) {
      this.apiService.deleteContractItem(this.contract.id, item.id).subscribe(() => {
        this.loadContract(this.contract!.id);
      });
    }
  }

  exportToExcel() {
    if (this.contract) {
      this.exportService.exportContractDetailToExcel(this.contract, this.items);
    }
  }

  exportToCSV() {
    if (this.contract) {
      this.exportService.exportContractDetailToCSV(this.contract, this.items);
    }
  }

  printReport() {
    if (this.contract) {
      this.exportService.printContractReport(this.contract, this.items);
    }
  }
}
