import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Supplier } from '../../models';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Edit' : 'Add'}} Supplier</h2>
    <mat-dialog-content>
      <form #supplierForm="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="supplier.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Contact Person</mat-label>
          <input matInput [(ngModel)]="supplier.contactPerson" name="contactPerson">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="supplier.email" name="email">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput [(ngModel)]="supplier.phone" name="phone">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Address</mat-label>
          <textarea matInput [(ngModel)]="supplier.address" name="address" rows="2"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!supplierForm.valid">
        {{isEdit ? 'Update' : 'Add'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }
  `]
})
export class SupplierDialogComponent {
  supplier: Partial<Supplier>;
  isEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<SupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier | null,
    private apiService: ApiService
  ) {
    this.isEdit = !!data;
    this.supplier = data ? { ...data } : {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  save() {
    if (this.isEdit && this.data) {
      this.apiService.updateSupplier(this.data.id, this.supplier as Supplier).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.createSupplier(this.supplier).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
