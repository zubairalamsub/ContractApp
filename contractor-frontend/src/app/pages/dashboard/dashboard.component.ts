import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule,
    MatProgressBarModule, MatTableModule, MatChipsModule, MatButtonModule
  ],
  template: `
    <div class="dashboard fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          <p class="subtitle">Welcome back! Here's your overview.</p>
        </div>
      </header>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card" *ngFor="let stat of statCards; let i = index"
             [style.animation-delay]="i * 0.1 + 's'">
          <div class="stat-icon" [class]="stat.colorClass">
            <mat-icon>{{stat.icon}}</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{stat.value}}</span>
            <span class="stat-label">{{stat.label}}</span>
          </div>
          <div class="stat-trend" *ngIf="stat.trend">
            <mat-icon [class.positive]="stat.trend > 0" [class.negative]="stat.trend < 0">
              {{stat.trend > 0 ? 'trending_up' : 'trending_down'}}
            </mat-icon>
            <span [class.positive]="stat.trend > 0" [class.negative]="stat.trend < 0">
              {{stat.trend > 0 ? '+' : ''}}{{stat.trend}}%
            </span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <mat-card class="recent-contracts">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>description</mat-icon>
              <h2>Recent Contracts</h2>
            </div>
            <button mat-button color="primary" routerLink="/contracts">
              View All
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="stats?.recentContracts || []" class="contracts-table">
                <ng-container matColumnDef="contractNumber">
                  <th mat-header-cell *matHeaderCellDef>Contract #</th>
                  <td mat-cell *matCellDef="let contract">
                    <span class="contract-number">{{contract.contractNumber}}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let contract">
                    <span class="contract-title">{{contract.title}}</span>
                  </td>
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
                      <mat-progress-bar mode="determinate" [value]="contract.progress"
                        [class.high]="contract.progress >= 75"
                        [class.medium]="contract.progress >= 50 && contract.progress < 75"
                        [class.low]="contract.progress < 50">
                      </mat-progress-bar>
                      <span class="progress-text">{{contract.progress}}%</span>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                    [routerLink]="['/contracts', row.id]"
                    class="clickable-row"></tr>
              </table>
            </div>

            <div class="empty-state" *ngIf="!stats?.recentContracts?.length">
              <mat-icon>description</mat-icon>
              <p>No contracts yet</p>
              <button mat-raised-button color="primary" routerLink="/contracts">
                Create your first contract
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="quick-actions">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>bolt</mat-icon>
              <h2>Quick Actions</h2>
            </div>
          </div>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-stroked-button routerLink="/contracts" class="action-btn">
                <mat-icon>add_circle</mat-icon>
                <span>New Contract</span>
              </button>
              <button mat-stroked-button routerLink="/suppliers" class="action-btn">
                <mat-icon>business</mat-icon>
                <span>Add Supplier</span>
              </button>
              <button mat-stroked-button routerLink="/categories" class="action-btn">
                <mat-icon>category</mat-icon>
                <span>Manage Categories</span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;

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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
      animation: slideUp 0.4s ease-out backwards;

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: white;
      }

      &.blue { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); }
      &.green { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
      &.amber { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
      &.purple { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); }
    }

    .stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      font-weight: 600;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .positive { color: var(--success); }
      .negative { color: var(--error); }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-light);

      .card-title {
        display: flex;
        align-items: center;
        gap: 12px;

        mat-icon {
          color: var(--primary);
        }

        h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }
      }

      button {
        mat-icon {
          margin-left: 4px;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .recent-contracts {
      mat-card-content {
        padding: 0;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .contracts-table {
      width: 100%;
    }

    .contract-number {
      font-family: 'SF Mono', 'Monaco', monospace;
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
    }

    .contract-title {
      font-weight: 500;
    }

    .clickable-row {
      cursor: pointer;

      &:hover {
        background: var(--bg-secondary) !important;
      }
    }

    .progress-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 140px;

      mat-progress-bar {
        flex: 1;

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

    .empty-state {
      padding: 48px 24px;
      text-align: center;
      color: var(--text-secondary);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.5;
        margin-bottom: 16px;
      }

      p {
        margin: 0 0 16px;
      }
    }

    .quick-actions {
      height: fit-content;

      mat-card-content {
        padding: 16px;
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      justify-content: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      transition: all var(--transition-fast);

      mat-icon {
        color: var(--primary);
      }

      span {
        font-weight: 500;
      }

      &:hover {
        background: var(--bg-secondary);
        border-color: var(--primary);
      }
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        order: -1;

        .action-buttons {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 140px;
        }
      }
    }

    @media (max-width: 640px) {
      .dashboard {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 20px;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .page-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  displayedColumns = ['contractNumber', 'title', 'client', 'status', 'progress'];
  statCards: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDashboard().subscribe(stats => {
      this.stats = stats;
      this.statCards = [
        {
          icon: 'description',
          label: 'Total Contracts',
          value: stats.totalContracts,
          colorClass: 'blue',
          trend: 12
        },
        {
          icon: 'play_circle',
          label: 'Active Contracts',
          value: stats.activeContracts,
          colorClass: 'green',
          trend: 8
        },
        {
          icon: 'account_balance_wallet',
          label: 'Total Budget',
          value: this.formatCurrency(stats.totalBudget),
          colorClass: 'amber'
        },
        {
          icon: 'business',
          label: 'Suppliers',
          value: stats.totalSuppliers,
          colorClass: 'purple',
          trend: 5
        }
      ];
    });
  }

  formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return '৳' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return '৳' + (amount / 1000).toFixed(0) + 'K';
    }
    return '৳' + amount.toFixed(0);
  }
}
