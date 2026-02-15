import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models';
import { CategoryDialogComponent } from './category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="categories-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Categories</h1>
          <p class="subtitle">Organize items by category groups</p>
        </div>
        <button mat-raised-button color="primary" (click)="openDialog()" class="add-btn" [disabled]="loading">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </header>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading categories...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon>error_outline</mat-icon>
        <h3>Failed to load categories</h3>
        <p>{{error}}</p>
        <button mat-raised-button color="primary" (click)="loadCategories()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <div class="categories-grid" *ngIf="!loading && !error">
        <mat-card class="group-card">
          <div class="card-header">
            <div class="card-title">
              <div class="icon-wrapper ict">
                <mat-icon>computer</mat-icon>
              </div>
              <div>
                <h2>ICT Categories</h2>
                <span class="count">{{ictCategories.length}} categories</span>
              </div>
            </div>
          </div>
          <mat-card-content>
            <div class="category-list">
              <div *ngFor="let category of ictCategories" class="category-item">
                <mat-chip [style.background-color]="category.color" class="category-chip">
                  {{category.name}}
                </mat-chip>
                <div class="item-actions">
                  <span class="default-badge" *ngIf="category.isDefault">Default</span>
                  <div class="actions" *ngIf="!category.isDefault">
                    <button mat-icon-button (click)="openDialog(category)" matTooltip="Edit" class="action-btn edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteCategory(category)" matTooltip="Delete" class="action-btn delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
              <div class="empty-category" *ngIf="ictCategories.length === 0">
                <p>No ICT categories</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="group-card">
          <div class="card-header">
            <div class="card-title">
              <div class="icon-wrapper electrical">
                <mat-icon>electrical_services</mat-icon>
              </div>
              <div>
                <h2>Electrical Categories</h2>
                <span class="count">{{electricalCategories.length}} categories</span>
              </div>
            </div>
          </div>
          <mat-card-content>
            <div class="category-list">
              <div *ngFor="let category of electricalCategories" class="category-item">
                <mat-chip [style.background-color]="category.color" class="category-chip">
                  {{category.name}}
                </mat-chip>
                <div class="item-actions">
                  <span class="default-badge" *ngIf="category.isDefault">Default</span>
                  <div class="actions" *ngIf="!category.isDefault">
                    <button mat-icon-button (click)="openDialog(category)" matTooltip="Edit" class="action-btn edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteCategory(category)" matTooltip="Delete" class="action-btn delete">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
              <div class="empty-category" *ngIf="electricalCategories.length === 0">
                <p>No Electrical categories</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .categories-page {
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .group-card {
      .card-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-light);
      }

      .card-title {
        display: flex;
        align-items: center;
        gap: 16px;

        h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      }

      mat-card-content {
        padding: 16px;
      }
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: white;
      }

      &.ict {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      }

      &.electrical {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--border-light);
      }
    }

    .category-chip {
      color: white !important;
      font-weight: 500;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      transition: all var(--transition-fast);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
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

    .default-badge {
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--bg-card);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid var(--border-light);
    }

    .empty-category {
      padding: 24px;
      text-align: center;
      color: var(--text-muted);

      p {
        margin: 0;
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

    @media (max-width: 768px) {
      .categories-page {
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

      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  error = '';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  get ictCategories(): Category[] {
    return this.categories.filter(c => c.group === 'ICT');
  }

  get electricalCategories(): Category[] {
    return this.categories.filter(c => c.group === 'Electrical');
  }

  openDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '450px',
      data: category || null,
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: Category) {
    if (confirm(`Delete category "${category.name}"?`)) {
      this.apiService.deleteCategory(category.id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Cannot delete category')
      });
    }
  }
}
