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
import { ApiService } from '../../services/api.service';
import { Supplier } from '../../models';
import { SupplierDialogComponent } from './supplier-dialog.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatInputModule
  ],
  template: `
    <div class="suppliers-page">
      <div class="header">
        <h1>Suppliers</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Add Supplier
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="suppliers" class="suppliers-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let supplier">{{supplier.name}}</td>
            </ng-container>

            <ng-container matColumnDef="contactPerson">
              <th mat-header-cell *matHeaderCellDef>Contact Person</th>
              <td mat-cell *matCellDef="let supplier">{{supplier.contactPerson}}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let supplier">{{supplier.email}}</td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let supplier">{{supplier.phone}}</td>
            </ng-container>

            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let supplier">{{supplier.address}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let supplier">
                <button mat-icon-button (click)="openDialog(supplier)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSupplier(supplier)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .suppliers-page {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      h1 { margin: 0; color: #1a1a2e; }
    }
    .suppliers-table {
      width: 100%;
    }
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns = ['name', 'contactPerson', 'email', 'phone', 'address', 'actions'];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.apiService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }

  openDialog(supplier?: Supplier) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: supplier || null
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
        error: (err) => alert(err.error || 'Cannot delete supplier')
      });
    }
  }
}
