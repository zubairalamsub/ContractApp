import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule,
    MatProgressBarModule, MatTableModule, MatChipsModule
  ],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon contracts">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{stats.totalContracts}}</span>
              <span class="stat-label">Total Contracts</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon active">
              <mat-icon>play_circle</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{stats.activeContracts}}</span>
              <span class="stat-label">Active Contracts</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon budget">
              <mat-icon>account_balance_wallet</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{stats.totalBudget | currency:'BDT':'symbol':'1.0-0'}}</span>
              <span class="stat-label">Total Budget</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon suppliers">
              <mat-icon>business</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{stats.totalSuppliers}}</span>
              <span class="stat-label">Suppliers</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="recent-contracts" *ngIf="stats">
        <mat-card-header>
          <mat-card-title>Recent Contracts</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="stats.recentContracts" class="contracts-table">
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
                  <mat-progress-bar mode="determinate" [value]="contract.progress"></mat-progress-bar>
                  <span>{{contract.progress}}%</span>
                </div>
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
    .dashboard {
      padding: 20px;
    }
    h1 {
      margin-bottom: 24px;
      color: #1a1a2e;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .stat-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }
    }
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: white;
      }
      &.contracts { background: #4361ee; }
      &.active { background: #10b981; }
      &.budget { background: #f59e0b; }
      &.suppliers { background: #8b5cf6; }
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .stat-label {
      color: #6b7280;
      font-size: 14px;
    }
    .recent-contracts {
      .contracts-table {
        width: 100%;
      }
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
        width: 100px;
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
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  displayedColumns = ['contractNumber', 'title', 'client', 'status', 'progress'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDashboard().subscribe(stats => {
      this.stats = stats;
    });
  }
}
