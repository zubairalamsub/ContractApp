import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';
import { Contract } from '../../models';
import { ContractDialogComponent } from './contract-dialog.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatChipsModule, MatDialogModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatTooltipModule, MatMenuModule
  ],
  template: `
    <div class="contracts-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Contracts</h1>
          <p class="subtitle">Manage and track all your contracts</p>
        </div>
        <div class="header-actions">
          <button mat-stroked-button [matMenuTriggerFor]="exportMenu" class="export-btn"
                  [disabled]="loading || contracts.length === 0">
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
          </mat-menu>
          <button mat-raised-button color="primary" (click)="openDialog()" class="add-btn" [disabled]="loading">
            <mat-icon>add</mat-icon>
            New Contract
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading contracts...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon>error_outline</mat-icon>
        <h3>Failed to load contracts</h3>
        <p>{{error}}</p>
        <button mat-raised-button color="primary" (click)="loadContracts()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <!-- Desktop Table View -->
      <mat-card class="contracts-card desktop-view" *ngIf="!loading && !error">
        <div class="table-container">
          <table mat-table [dataSource]="contracts" class="contracts-table">
            <ng-container matColumnDef="contractNumber">
              <th mat-header-cell *matHeaderCellDef>Contract #</th>
              <td mat-cell *matCellDef="let contract">
                <div class="contract-numbers">
                  <span class="contract-number">{{contract.contractNumber}}</span>
                  <span class="tender-number" *ngIf="contract.tenderNumber">Tender: {{contract.tenderNumber}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let contract">
                <div class="date-info">
                  <span class="start-date">{{contract.startDate | date:'dd MMM yyyy'}}</span>
                  <span class="date-separator">to</span>
                  <span class="end-date">{{contract.endDate | date:'dd MMM yyyy'}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let contract">
                <div class="contract-info">
                  <span class="contract-title">{{contract.title}}</span>
                  <span class="contract-client">{{contract.client}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="budget">
              <th mat-header-cell *matHeaderCellDef>Budget</th>
              <td mat-cell *matCellDef="let contract">
                <div class="budget-info">
                  <span class="budget-amount">{{contract.totalBudget | currency:'BDT':'symbol':'1.0-0'}}</span>
                  <span class="budget-spent">Spent: {{contract.spentAmount | currency:'BDT':'symbol':'1.0-0'}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let contract">
                <mat-chip [class]="'status-' + contract.status.toLowerCase()">
                  {{contract.status}}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="progress">
              <th mat-header-cell *matHeaderCellDef>Progress</th>
              <td mat-cell *matCellDef="let contract">
                <div class="progress-cell">
                  <mat-progress-bar mode="determinate" [value]="getProgress(contract)"
                    [class.high]="getProgress(contract) >= 75"
                    [class.medium]="getProgress(contract) >= 50 && getProgress(contract) < 75"
                    [class.low]="getProgress(contract) < 50">
                  </mat-progress-bar>
                  <span class="progress-text">{{getProgress(contract)}}%</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let contract">
                <div class="actions">
                  <button mat-icon-button [routerLink]="['/contracts', contract.id]"
                          matTooltip="View Details" class="action-btn view">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openDialog(contract); $event.stopPropagation()"
                          matTooltip="Edit" class="action-btn edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteContract(contract); $event.stopPropagation()"
                          matTooltip="Delete" class="action-btn delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                [routerLink]="['/contracts', row.id]"
                class="clickable-row"></tr>
          </table>
        </div>

        <div class="empty-state" *ngIf="contracts.length === 0">
          <div class="empty-icon">
            <mat-icon>description</mat-icon>
          </div>
          <h3>No contracts yet</h3>
          <p>Create your first contract to get started</p>
          <button mat-raised-button color="primary" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Create Contract
          </button>
        </div>
      </mat-card>

      <!-- Mobile Card View -->
      <div class="mobile-view" *ngIf="!loading && !error">
        <div class="mobile-cards" *ngIf="contracts.length > 0">
          <mat-card class="contract-card" *ngFor="let contract of contracts"
                    [routerLink]="['/contracts', contract.id]">
            <div class="card-header">
              <div class="card-title-section">
                <h3 class="card-title">{{contract.title}}</h3>
                <span class="card-client">{{contract.client}}</span>
              </div>
              <mat-chip [class]="'status-' + contract.status.toLowerCase()" class="card-status">
                {{contract.status}}
              </mat-chip>
            </div>

            <div class="card-details">
              <div class="detail-row">
                <span class="detail-label">Contract #</span>
                <span class="contract-number">{{contract.contractNumber}}</span>
              </div>
              <div class="detail-row" *ngIf="contract.tenderNumber">
                <span class="detail-label">Tender #</span>
                <span class="detail-value">{{contract.tenderNumber}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">{{contract.startDate | date:'dd MMM yyyy'}} - {{contract.endDate | date:'dd MMM yyyy'}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Budget</span>
                <span class="budget-amount">{{contract.totalBudget | currency:'BDT':'symbol':'1.0-0'}}</span>
              </div>
            </div>

            <div class="card-progress">
              <div class="progress-header">
                <span class="progress-label">Spent: {{contract.spentAmount | currency:'BDT':'symbol':'1.0-0'}}</span>
                <span class="progress-text">{{getProgress(contract)}}%</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="getProgress(contract)"
                [class.high]="getProgress(contract) >= 75"
                [class.medium]="getProgress(contract) >= 50 && getProgress(contract) < 75"
                [class.low]="getProgress(contract) < 50">
              </mat-progress-bar>
            </div>

            <div class="card-actions">
              <button mat-icon-button [routerLink]="['/contracts', contract.id]"
                      (click)="$event.stopPropagation()" class="action-btn view">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button (click)="openDialog(contract); $event.stopPropagation()"
                      class="action-btn edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteContract(contract); $event.stopPropagation()"
                      class="action-btn delete">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card>
        </div>

        <div class="empty-state" *ngIf="contracts.length === 0">
          <div class="empty-icon">
            <mat-icon>description</mat-icon>
          </div>
          <h3>No contracts yet</h3>
          <p>Create your first contract to get started</p>
          <button mat-raised-button color="primary" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Create Contract
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contracts-page {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;

      .header-content {
        h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .subtitle {
          margin: 8px 0 0;
          color: var(--text-secondary);
          font-size: 1rem;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .export-btn {
      gap: 8px;
      height: 48px;
      border-color: var(--border-medium);

      mat-icon {
        color: var(--primary);
      }

      &:hover {
        border-color: var(--primary);
        background: rgba(79, 70, 229, 0.05);
      }
    }

    .add-btn {
      gap: 8px;
      padding: 0 24px;
      height: 48px;
    }

    .contracts-card {
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .contracts-table {
      width: 100%;
      min-width: 800px;
    }

    .contract-numbers {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contract-number {
      font-family: 'SF Mono', 'Monaco', monospace;
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 600;
      background: var(--bg-secondary);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      display: inline-block;
      width: fit-content;
    }

    .tender-number {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.8125rem;
    }

    .start-date {
      color: var(--text-primary);
      font-weight: 500;
    }

    .date-separator {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .end-date {
      color: var(--text-secondary);
    }

    .contract-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contract-title {
      font-weight: 600;
      color: var(--text-primary);
    }

    .contract-client {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .budget-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .budget-amount {
      font-weight: 600;
      color: var(--text-primary);
    }

    .budget-spent {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .progress-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 140px;

      mat-progress-bar {
        flex: 1;
        border-radius: 9999px;

        &.high ::ng-deep .mdc-linear-progress__bar-inner {
          background: var(--success) !important;
        }
        &.medium ::ng-deep .mdc-linear-progress__bar-inner {
          background: var(--warning) !important;
        }
        &.low ::ng-deep .mdc-linear-progress__bar-inner {
          background: var(--primary) !important;
        }
      }

      .progress-text {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        min-width: 36px;
      }
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      transition: all var(--transition-fast);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &.view:hover {
        color: var(--primary);
        background: rgba(79, 70, 229, 0.1);
      }

      &.edit:hover {
        color: var(--warning);
        background: rgba(245, 158, 11, 0.1);
      }

      &.delete:hover {
        color: var(--error);
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .clickable-row {
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--bg-secondary) !important;
      }
    }

    .empty-state {
      padding: 64px 24px;
      text-align: center;

      .empty-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: var(--bg-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: var(--text-muted);
        }
      }

      h3 {
        margin: 0 0 8px;
        font-size: 1.25rem;
        color: var(--text-primary);
      }

      p {
        margin: 0 0 24px;
        color: var(--text-secondary);
      }

      button {
        gap: 8px;
      }
    }

    /* Desktop/Mobile view toggles */
    .desktop-view {
      display: block;
    }

    .mobile-view {
      display: none;
    }

    @media (max-width: 768px) {
      .contracts-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        flex-direction: row;
        width: 100%;

        .export-btn {
          flex: 1;
        }

        .add-btn {
          flex: 1;
        }
      }

      .page-header h1 {
        font-size: 1.5rem;
      }

      .desktop-view {
        display: none !important;
      }

      .mobile-view {
        display: block;
      }

      .mobile-cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .contract-card {
        padding: 16px;
        cursor: pointer;
        transition: box-shadow var(--transition-fast);

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
      }

      .card-title-section {
        flex: 1;
        min-width: 0;
      }

      .card-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-client {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      .card-status {
        flex-shrink: 0;
      }

      .card-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
        padding: 12px;
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }

      .detail-label {
        font-size: 0.8125rem;
        color: var(--text-secondary);
      }

      .detail-value {
        font-size: 0.875rem;
        color: var(--text-primary);
        text-align: right;
      }

      .card-progress {
        margin-bottom: 12px;

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .progress-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        mat-progress-bar {
          border-radius: 9999px;

          &.high ::ng-deep .mdc-linear-progress__bar-inner {
            background: var(--success) !important;
          }
          &.medium ::ng-deep .mdc-linear-progress__bar-inner {
            background: var(--warning) !important;
          }
          &.low ::ng-deep .mdc-linear-progress__bar-inner {
            background: var(--primary) !important;
          }
        }
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        padding-top: 12px;
        border-top: 1px solid var(--border-light);
      }
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
  `]
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];
  displayedColumns = ['contractNumber', 'date', 'title', 'budget', 'status', 'progress', 'actions'];
  loading = true;
  error = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.loading = true;
    this.error = '';
    this.apiService.getContracts().subscribe({
      next: (contracts) => {
        this.contracts = contracts;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load contracts';
        this.loading = false;
      }
    });
  }

  getProgress(contract: Contract): number {
    if (contract.totalBudget === 0) return 0;
    return Math.round((contract.spentAmount / contract.totalBudget) * 100);
  }

  openDialog(contract?: Contract) {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: contract || null,
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContracts();
      }
    });
  }

  deleteContract(contract: Contract) {
    if (confirm(`Delete contract "${contract.title}"?`)) {
      this.apiService.deleteContract(contract.id).subscribe(() => {
        this.loadContracts();
      });
    }
  }

  exportToExcel() {
    this.exportService.exportContractsToExcel(this.contracts, 'contracts-report');
  }

  exportToCSV() {
    this.exportService.exportContractsToCSV(this.contracts, 'contracts-report');
  }
}
