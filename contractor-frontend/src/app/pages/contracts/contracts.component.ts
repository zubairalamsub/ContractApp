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
import { ApiService } from '../../services/api.service';
import { Contract } from '../../models';
import { ContractDialogComponent } from './contract-dialog.component';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatChipsModule, MatDialogModule, MatProgressBarModule
  ],
  template: `
    <div class="contracts-page">
      <div class="header">
        <h1>Contracts</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          New Contract
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="contracts" class="contracts-table">
            <ng-container matColumnDef="contractNumber">
              <th mat-header-cell *matHeaderCellDef>Contract #</th>
              <td mat-cell *matCellDef="let contract">{{contract.contractNumber}}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let contract">{{contract.title}}</td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef>Client</th>
              <td mat-cell *matCellDef="let contract">{{contract.client}}</td>
            </ng-container>

            <ng-container matColumnDef="budget">
              <th mat-header-cell *matHeaderCellDef>Budget</th>
              <td mat-cell *matCellDef="let contract">
                {{contract.totalBudget | currency:'BDT':'symbol':'1.0-0'}}
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
                  <mat-progress-bar mode="determinate" [value]="getProgress(contract)"></mat-progress-bar>
                  <span>{{getProgress(contract)}}%</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let contract">
                <button mat-icon-button [routerLink]="['/contracts', contract.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button (click)="openDialog(contract); $event.stopPropagation()">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteContract(contract); $event.stopPropagation()">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                [routerLink]="['/contracts', row.id]"
                class="clickable-row"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .contracts-page {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      h1 {
        margin: 0;
        color: #1a1a2e;
      }
    }
    .contracts-table {
      width: 100%;
    }
    .clickable-row {
      cursor: pointer;
      &:hover {
        background: #f8fafc;
      }
    }
    .progress-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      mat-progress-bar {
        width: 80px;
      }
      span {
        font-size: 12px;
        color: #6b7280;
      }
    }
    .status-draft { background: #e5e7eb !important; }
    .status-active { background: #d1fae5 !important; color: #047857 !important; }
    .status-completed { background: #dbeafe !important; color: #1d4ed8 !important; }
    .status-cancelled { background: #fee2e2 !important; color: #dc2626 !important; }
  `]
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];
  displayedColumns = ['contractNumber', 'title', 'client', 'budget', 'status', 'progress', 'actions'];

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
      data: contract || null
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
