import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models';
import { CategoryDialogComponent } from './category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div class="categories-page">
      <div class="header">
        <h1>Categories</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Category
        </button>
      </div>

      <div class="categories-grid">
        <mat-card class="group-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>computer</mat-icon>
              ICT Categories
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-list">
              <div *ngFor="let category of ictCategories" class="category-item">
                <mat-chip [style.background-color]="category.color" class="category-chip">
                  {{category.name}}
                </mat-chip>
                <div class="actions" *ngIf="!category.isDefault">
                  <button mat-icon-button (click)="openDialog(category)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCategory(category)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <span class="default-badge" *ngIf="category.isDefault">Default</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="group-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>electrical_services</mat-icon>
              Electrical Categories
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="category-list">
              <div *ngFor="let category of electricalCategories" class="category-item">
                <mat-chip [style.background-color]="category.color" class="category-chip">
                  {{category.name}}
                </mat-chip>
                <div class="actions" *ngIf="!category.isDefault">
                  <button mat-icon-button (click)="openDialog(category)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCategory(category)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <span class="default-badge" *ngIf="category.isDefault">Default</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .categories-page {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      h1 { margin: 0; color: #1a1a2e; }
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    .group-card {
      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .category-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      &:hover {
        background: #f8fafc;
      }
    }
    .category-chip {
      color: white !important;
      font-weight: 500;
    }
    .actions {
      margin-left: auto;
    }
    .default-badge {
      margin-left: auto;
      font-size: 12px;
      color: #6b7280;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 4px;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
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
      width: '400px',
      data: category || null
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
        error: (err) => alert(err.error || 'Cannot delete category')
      });
    }
  }
}
