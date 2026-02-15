import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../services/api.service';
import { Company } from '../../models';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule
  ],
  template: `
    <div class="company-profile-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Company Profile</h1>
          <p class="subtitle">Manage your company information</p>
        </div>
      </header>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading company profile...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon>error_outline</mat-icon>
        <h3>Failed to load company profile</h3>
        <p>{{error}}</p>
        <button mat-raised-button color="primary" (click)="loadCompany()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
      </div>

      <div class="profile-content" *ngIf="company && !loading && !error">
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>business</mat-icon>
              Company Information
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <form class="profile-form" (ngSubmit)="saveCompany()">
              <div class="logo-section">
                <div class="logo-preview" [class.has-logo]="company.logo">
                  <img *ngIf="company.logo" [src]="company.logo" alt="Company Logo">
                  <mat-icon *ngIf="!company.logo">business</mat-icon>
                </div>
                <div class="logo-actions">
                  <input type="file" #fileInput hidden accept="image/*" (change)="onLogoSelected($event)">
                  <button mat-stroked-button type="button" (click)="fileInput.click()">
                    <mat-icon>upload</mat-icon>
                    Upload Logo
                  </button>
                  <button mat-stroked-button type="button" color="warn" *ngIf="company.logo" (click)="removeLogo()">
                    <mat-icon>delete</mat-icon>
                    Remove
                  </button>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="form-section">
                <h3>Basic Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Company Name</mat-label>
                    <input matInput [(ngModel)]="company.name" name="name" required>
                    <mat-icon matSuffix>business</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row two-columns">
                  <mat-form-field appearance="outline">
                    <mat-label>Tax ID / VAT Number</mat-label>
                    <input matInput [(ngModel)]="company.taxId" name="taxId">
                    <mat-icon matSuffix>receipt</mat-icon>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Registration Number</mat-label>
                    <input matInput [(ngModel)]="company.registrationNumber" name="registrationNumber">
                    <mat-icon matSuffix>badge</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput [(ngModel)]="company.description" name="description" rows="3"></textarea>
                    <mat-icon matSuffix>description</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="form-section">
                <h3>Contact Information</h3>
                <div class="form-row two-columns">
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput [(ngModel)]="company.email" name="email" type="email">
                    <mat-icon matSuffix>email</mat-icon>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Phone</mat-label>
                    <input matInput [(ngModel)]="company.phone" name="phone">
                    <mat-icon matSuffix>phone</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Website</mat-label>
                    <input matInput [(ngModel)]="company.website" name="website">
                    <mat-icon matSuffix>language</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="form-section">
                <h3>Address</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Street Address</mat-label>
                    <input matInput [(ngModel)]="company.address" name="address">
                    <mat-icon matSuffix>location_on</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row three-columns">
                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput [(ngModel)]="company.city" name="city">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Postal Code</mat-label>
                    <input matInput [(ngModel)]="company.postalCode" name="postalCode">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Country</mat-label>
                    <input matInput [(ngModel)]="company.country" name="country">
                  </mat-form-field>
                </div>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="saving">
                  <mat-icon>{{saving ? 'hourglass_empty' : 'save'}}</mat-icon>
                  {{saving ? 'Saving...' : 'Save Changes'}}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .company-profile-page {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;

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

    .profile-card {
      mat-card-header {
        margin-bottom: 24px;

        mat-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;

          mat-icon {
            color: var(--primary);
          }
        }
      }
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 20px 0;

      .logo-preview {
        width: 120px;
        height: 120px;
        border-radius: var(--radius-lg);
        background: var(--bg-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--border-medium);
        overflow: hidden;

        &.has-logo {
          border-style: solid;
          border-color: var(--primary);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: var(--text-muted);
        }
      }

      .logo-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;

        button {
          gap: 8px;
        }
      }
    }

    mat-divider {
      margin: 24px 0;
    }

    .form-section {
      h3 {
        margin: 0 0 16px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;

      &.two-columns {
        mat-form-field {
          flex: 1;
        }
      }

      &.three-columns {
        mat-form-field {
          flex: 1;
        }
      }

      .full-width {
        width: 100%;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 24px;

      button {
        gap: 8px;
        padding: 0 32px;
        height: 48px;
      }
    }

    @media (max-width: 768px) {
      .company-profile-page {
        padding: 16px;
      }

      .page-header h1 {
        font-size: 1.5rem;
      }

      .logo-section {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-row {
        flex-direction: column;
        gap: 0;

        &.two-columns, &.three-columns {
          mat-form-field {
            width: 100%;
          }
        }
      }

      .form-actions {
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class CompanyProfileComponent implements OnInit {
  company: Company | null = null;
  loading = true;
  saving = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany() {
    this.loading = true;
    this.error = '';
    this.apiService.getCompany().subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load company profile';
        this.loading = false;
      }
    });
  }

  saveCompany() {
    if (!this.company) return;

    this.saving = true;
    this.apiService.updateCompany(this.company).subscribe({
      next: (updated) => {
        this.company = updated;
        this.saving = false;
        this.snackBar.open('Company profile saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.message || 'Failed to save company profile', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('Logo file size must be less than 2MB', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.company && e.target?.result) {
          this.company.logo = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    if (this.company) {
      this.company.logo = undefined;
    }
  }
}
