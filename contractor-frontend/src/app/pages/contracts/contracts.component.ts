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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Contract } from '../../models';
import { ContractDialogComponent } from './contract-dialog.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatChipsModule, MatDialogModule, MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="contracts-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Contracts</h1>
          <p class="subtitle">Manage and track all your contracts</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-btn">
          <mat-icon>add</mat-icon>
          New Contract
        </button>
      </header>

      <mat-card class="contracts-card">
        <div class="table-container">
          <table mat-table [dataSource]="contracts" class="contracts-table">
            <ng-container matColumnDef="contractNumber">
              <th mat-header-cell *matHeaderCellDef>Contract #</th>
              <td mat-cell *matCellDef="let contract">
                <span class="contract-number">{{contract.contractNumber}}</span>
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

    .contract-number {
      font-family: 'SF Mono', 'Monaco', monospace;
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 600;
      background: var(--bg-secondary);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
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

    @media (max-width: 768px) {
      .contracts-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: stretch;

        .add-btn {
          width: 100%;
        }
      }

      .page-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];
  displayedColumns = ['contractNumber', 'title', 'budget', 'status', 'progress', 'actions'];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.apiService.getContracts().subscribe(contracts => {
      this.contracts = contracts;
    });
  }

  getProgress(contract: Contract): number {
    if (contract.totalBudget === 0) return 0;
    return Math.round((contract.spentAmount / contract.totalBudget) * 100);
  }

  openDialog(contract?: Contract) {
    const dialogRef = this.dialog.open(ContractDialogComponent, {
      width: '600px',
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
}
