import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { Contract } from '../../models';

@Component({
  selector: 'app-contract-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEdit ? 'Edit' : 'New'}} Contract</h2>
    <mat-dialog-content>
      <form #contractForm="ngForm">
        <mat-form-field appearance="outline">
          <mat-label>Contract Number</mat-label>
          <input matInput [(ngModel)]="contract.contractNumber" name="contractNumber" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="contract.title" name="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Client</mat-label>
          <input matInput [(ngModel)]="contract.client" name="client" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="contract.description" name="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Total Budget (BDT)</mat-label>
          <input matInput type="number" [(ngModel)]="contract.totalBudget" name="totalBudget" required>
        </mat-form-field>

        <div class="date-row">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput [matDatepicker]="startPicker" [(ngModel)]="contract.startDate" name="startDate">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput [matDatepicker]="endPicker" [(ngModel)]="contract.endDate" name="endDate">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="contract.status" name="status">
            <mat-option value="Draft">Draft</mat-option>
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Completed">Completed</mat-option>
            <mat-option value="Cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!contractForm.valid">
        {{isEdit ? 'Update' : 'Create'}}
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
    .date-row {
      display: flex;
      gap: 16px;
      mat-form-field {
        flex: 1;
      }
    }
  `]
})
export class ContractDialogComponent {
  contract: Partial<Contract>;
  isEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<ContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contract | null,
    private apiService: ApiService
  ) {
    this.isEdit = !!data;
    this.contract = data ? { ...data } : {
      contractNumber: '',
      title: '',
      client: '',
      description: '',
      totalBudget: 0,
      spentAmount: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      status: 'Draft'
    };
  }

  save() {
    if (this.isEdit && this.data) {
      this.apiService.updateContract(this.data.id, this.contract as Contract).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.createContract(this.contract).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
