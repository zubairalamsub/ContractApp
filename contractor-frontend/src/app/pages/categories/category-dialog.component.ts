import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Edit' : 'Add'}} Category</h2>
    <mat-dialog-content>
      <form #categoryForm="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="category.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Group</mat-label>
          <mat-select [(ngModel)]="category.group" name="group" required>
            <mat-option value="ICT">ICT</mat-option>
            <mat-option value="Electrical">Electrical</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="color-field">
          <label>Color</label>
          <div class="color-options">
            <button *ngFor="let color of colors"
                    type="button"
                    class="color-btn"
                    [style.background-color]="color"
                    [class.selected]="category.color === color"
                    (click)="category.color = color">
            </button>
          </div>
          <div class="custom-color">
            <input type="color" [(ngModel)]="category.color" name="color">
            <span>{{category.color}}</span>
          </div>
        </div>

        <div class="preview">
          <span>Preview:</span>
          <span class="preview-chip" [style.background-color]="category.color">
            {{category.name || 'Category Name'}}
          </span>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!categoryForm.valid">
        {{isEdit ? 'Update' : 'Add'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 350px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }
    .color-field {
      margin-bottom: 16px;
      label {
        font-size: 12px;
        color: #6b7280;
        display: block;
        margin-bottom: 8px;
      }
    }
    .color-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .color-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      &.selected {
        border-color: #1a1a2e;
        box-shadow: 0 0 0 2px white, 0 0 0 4px #1a1a2e;
      }
    }
    .custom-color {
      display: flex;
      align-items: center;
      gap: 8px;
      input[type="color"] {
        width: 40px;
        height: 30px;
        border: none;
        cursor: pointer;
      }
      span {
        font-family: monospace;
        color: #6b7280;
      }
    }
    .preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      span:first-child {
        color: #6b7280;
        font-size: 14px;
      }
    }
    .preview-chip {
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class CategoryDialogComponent {
  category: Partial<Category>;
  isEdit: boolean;
  colors = [
    '#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
    '#EF4444', '#F97316', '#FBBF24', '#84CC16', '#6366F1'
  ];

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null,
    private apiService: ApiService
  ) {
    this.isEdit = !!data;
    this.category = data ? { ...data } : {
      name: '',
      group: 'ICT',
      color: '#3B82F6'
    };
  }

  save() {
    if (this.isEdit && this.data) {
      this.apiService.updateCategory(this.data.id, this.category as Category).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.createCategory(this.category).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
