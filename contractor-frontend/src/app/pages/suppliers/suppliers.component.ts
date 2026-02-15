import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Supplier } from '../../models';
import { SupplierDialogComponent } from './supplier-dialog.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="suppliers-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Suppliers</h1>
          <p class="subtitle">Manage your supplier contacts</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-btn" [disabled]="loading">
          <mat-icon>add</mat-icon>
          Add Supplier
        </button>
      </header>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading suppliers...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon>error_outline</mat-icon>
        <h3>Failed to load suppliers</h3>
        <p>{{error}}</p>
        <button mat-raised-button color="primary" (click)="loadSuppliers()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <mat-card *ngIf="!loading && !error">
        <div class="table-container">
          <table mat-table [dataSource]="suppliers" class="suppliers-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let supplier">
                <span class="supplier-name">{{supplier.name}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="contactPerson">
              <th mat-header-cell *matHeaderCellDef>Contact Person</th>
              <td mat-cell *matCellDef="let supplier">
                <div class="contact-info">
                  <mat-icon>person</mat-icon>
                  {{supplier.contactPerson || '-'}}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let supplier">
                <div class="contact-info">
                  <mat-icon>email</mat-icon>
                  {{supplier.email || '-'}}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let supplier">
                <div class="contact-info">
                  <mat-icon>phone</mat-icon>
                  {{supplier.phone || '-'}}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let supplier">
                <div class="actions">
                  <button mat-icon-button (click)="openDialog(supplier)" matTooltip="Edit" class="action-btn edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteSupplier(supplier)" matTooltip="Delete" class="action-btn delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <div class="empty-state" *ngIf="suppliers.length === 0">
          <div class="empty-icon">
            <mat-icon>business</mat-icon>
          </div>
          <h3>No suppliers yet</h3>
          <p>Add your first supplier to get started</p>
          <button mat-raised-button color="primary" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Add Supplier
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .suppliers-page {
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

    .table-container {
      overflow-x: auto;
    }

    .suppliers-table {
      width: 100%;
      min-width: 700px;
    }

    .supplier-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-muted);
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

      &.edit:hover {
        color: var(--warning);
        background: rgba(245, 158, 11, 0.1);
      }

      &.delete:hover {
        color: var(--error);
        background: rgba(239, 68, 68, 0.1);
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
      .suppliers-page {
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
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns = ['name', 'contactPerson', 'email', 'phone', 'actions'];
  loading = true;
  error = '';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.loading = true;
    this.error = '';
    this.apiService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load suppliers';
        this.loading = false;
      }
    });
  }

  openDialog(supplier?: Supplier) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: supplier || null,
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  deleteSupplier(supplier: Supplier) {
    if (confirm(`Delete supplier "${supplier.name}"?`)) {
      this.apiService.deleteSupplier(supplier.id).subscribe({
        next: () => this.loadSuppliers(),
        error: (err) => alert(err.error?.message || 'Cannot delete supplier')
      });
    }
  }
}
