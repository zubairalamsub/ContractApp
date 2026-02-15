import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { ContractItem, Category, Supplier } from '../../models';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatOptionModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Edit' : 'Add'}} Item</h2>
    <mat-dialog-content>
      <form #itemForm="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Item Name</mat-label>
          <input matInput [(ngModel)]="item.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="item.categoryId" name="categoryId" required>
            <mat-optgroup label="ICT">
              <mat-option *ngFor="let cat of ictCategories" [value]="cat.id">
                <span [style.color]="cat.color">●</span> {{cat.name}}
              </mat-option>
            </mat-optgroup>
            <mat-optgroup label="Electrical">
              <mat-option *ngFor="let cat of electricalCategories" [value]="cat.id">
                <span [style.color]="cat.color">●</span> {{cat.name}}
              </mat-option>
            </mat-optgroup>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Supplier</mat-label>
          <mat-select [(ngModel)]="item.supplierId" name="supplierId">
            <mat-option [value]="null">None</mat-option>
            <mat-option *ngFor="let supplier of data.suppliers" [value]="supplier.id">
              {{supplier.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" [(ngModel)]="item.quantity" name="quantity" required min="1">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Unit</mat-label>
            <mat-select [(ngModel)]="item.unit" name="unit">
              <mat-option value="pcs">pcs</mat-option>
              <mat-option value="m">m</mat-option>
              <mat-option value="kg">kg</mat-option>
              <mat-option value="set">set</mat-option>
              <mat-option value="roll">roll</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Unit Price (BDT)</mat-label>
            <input matInput type="number" [(ngModel)]="item.unitPrice" name="unitPrice" required min="0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Used Quantity</mat-label>
            <input matInput type="number" [(ngModel)]="item.usedQuantity" name="usedQuantity" min="0">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Delivery Status</mat-label>
          <mat-select [(ngModel)]="item.deliveryStatus" name="deliveryStatus">
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="Ordered">Ordered</mat-option>
            <mat-option value="Delivered">Delivered</mat-option>
            <mat-option value="Installed">Installed</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="total-display">
          <span class="label">Total:</span>
          <span class="value">{{(item.quantity || 0) * (item.unitPrice || 0) | currency:'BDT':'symbol':'1.0-0'}}</span>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!itemForm.valid">
        {{isEdit ? 'Update' : 'Add'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      gap: 16px;
      mat-form-field { flex: 1; }
    }
    .total-display {
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      .label { color: #6b7280; }
      .value { font-size: 20px; font-weight: 600; color: #1a1a2e; }
    }
  `]
})
export class ItemDialogComponent {
  item: Partial<ContractItem>;
  isEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      item: ContractItem | null;
      contractId: number;
      categories: Category[];
      suppliers: Supplier[];
    },
    private apiService: ApiService
  ) {
    this.isEdit = !!data.item;
    this.item = data.item ? { ...data.item } : {
      name: '',
      categoryId: 0,
      supplierId: undefined,
      quantity: 1,
      usedQuantity: 0,
      unit: 'pcs',
      unitPrice: 0,
      deliveryStatus: 'Pending'
    };
  }

  get ictCategories(): Category[] {
    return this.data.categories.filter(c => c.group === 'ICT');
  }

  get electricalCategories(): Category[] {
    return this.data.categories.filter(c => c.group === 'Electrical');
  }

  save() {
    if (this.isEdit && this.data.item) {
      this.apiService.updateContractItem(
        this.data.contractId,
        this.data.item.id,
        { ...this.item, contractId: this.data.contractId } as ContractItem
      ).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.addContractItem(this.data.contractId, this.item).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
