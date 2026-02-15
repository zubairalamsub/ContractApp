import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService, CompanyOption } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTabsModule,
    MatProgressSpinnerModule, MatSelectModule, MatRadioModule
  ],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Left Panel - Branding -->
        <div class="brand-panel">
          <div class="brand-content">
            <div class="logo-section">
              <div class="logo-icon">
                <mat-icon>architecture</mat-icon>
              </div>
              <h1>ContractorPro</h1>
            </div>
            <p class="tagline">Streamline your contract management with powerful tools and insights.</p>
            <div class="features">
              <div class="feature">
                <mat-icon>description</mat-icon>
                <span>Manage Contracts</span>
              </div>
              <div class="feature">
                <mat-icon>analytics</mat-icon>
                <span>Track Progress</span>
              </div>
              <div class="feature">
                <mat-icon>business</mat-icon>
                <span>Supplier Management</span>
              </div>
            </div>
          </div>
          <div class="brand-footer">
            <p>&copy; 2024 ContractorPro. All rights reserved.</p>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div class="form-panel">
          <mat-card class="login-card">
            <mat-tab-group animationDuration="200ms">
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon>login</mat-icon>
                  <span>Sign In</span>
                </ng-template>
                <form (ngSubmit)="login()" #loginForm="ngForm" class="form">
                  <div class="form-header">
                    <h2>Welcome back</h2>
                    <p>Enter your credentials to access your account</p>
                  </div>

                  <mat-form-field appearance="outline">
                    <mat-label>Username</mat-label>
                    <input matInput [(ngModel)]="loginData.username" name="username" required autocomplete="username">
                    <mat-icon matPrefix>person_outline</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Password</mat-label>
                    <input matInput [type]="hidePassword ? 'password' : 'text'"
                           [(ngModel)]="loginData.password" name="password" required autocomplete="current-password">
                    <mat-icon matPrefix>lock_outline</mat-icon>
                    <button mat-icon-button matSuffix type="button"
                            (click)="hidePassword = !hidePassword" tabindex="-1">
                      <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                    </button>
                  </mat-form-field>

                  <div class="error-message" *ngIf="errorMessage">
                    <mat-icon>error_outline</mat-icon>
                    <span>{{errorMessage}}</span>
                  </div>

                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="!loginForm.valid || loading" class="submit-btn">
                    <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                    <span *ngIf="!loading">Sign In</span>
                  </button>
                </form>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon>person_add</mat-icon>
                  <span>Register</span>
                </ng-template>
                <form (ngSubmit)="register()" #registerForm="ngForm" class="form">
                  <div class="form-header">
                    <h2>Create account</h2>
                    <p>Fill in your details to get started</p>
                  </div>

                  <mat-form-field appearance="outline">
                    <mat-label>Full Name</mat-label>
                    <input matInput [(ngModel)]="registerData.fullName" name="fullName" required>
                    <mat-icon matPrefix>badge</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Username</mat-label>
                    <input matInput [(ngModel)]="registerData.username" name="regUsername" required autocomplete="username">
                    <mat-icon matPrefix>person_outline</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" [(ngModel)]="registerData.email" name="email" required autocomplete="email">
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Password</mat-label>
                    <input matInput [type]="hidePassword ? 'password' : 'text'"
                           [(ngModel)]="registerData.password" name="regPassword" required minlength="6" autocomplete="new-password">
                    <mat-icon matPrefix>lock_outline</mat-icon>
                    <button mat-icon-button matSuffix type="button"
                            (click)="hidePassword = !hidePassword" tabindex="-1">
                      <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                    </button>
                  </mat-form-field>

                  <div class="company-section">
                    <label class="section-label">Company (Optional)</label>
                    <mat-radio-group [(ngModel)]="companyOption" name="companyOption" class="company-radio">
                      <mat-radio-button value="none">No Company</mat-radio-button>
                      <mat-radio-button value="existing">Join Existing</mat-radio-button>
                      <mat-radio-button value="new">Create New</mat-radio-button>
                    </mat-radio-group>

                    <mat-form-field appearance="outline" *ngIf="companyOption === 'existing'" class="company-field">
                      <mat-label>Select Company</mat-label>
                      <mat-select [(ngModel)]="registerData.companyId" name="companyId">
                        <mat-option *ngFor="let company of companies" [value]="company.id">
                          {{company.name}}
                        </mat-option>
                      </mat-select>
                      <mat-icon matPrefix>business</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" *ngIf="companyOption === 'new'" class="company-field">
                      <mat-label>Company Name</mat-label>
                      <input matInput [(ngModel)]="registerData.companyName" name="companyName">
                      <mat-icon matPrefix>domain_add</mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="error-message" *ngIf="errorMessage">
                    <mat-icon>error_outline</mat-icon>
                    <span>{{errorMessage}}</span>
                  </div>

                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="!registerForm.valid || loading" class="submit-btn">
                    <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                    <span *ngIf="!loading">Create Account</span>
                  </button>
                </form>
              </mat-tab>
            </mat-tab-group>

            <div class="demo-credentials">
              <mat-icon>info</mat-icon>
              <span>Demo: <strong>admin</strong> / <strong>admin123</strong></span>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-secondary) 50%, var(--primary-dark) 100%);
      padding: 20px;
    }

    .login-wrapper {
      display: flex;
      width: 100%;
      max-width: 1000px;
      min-height: 600px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .brand-panel {
      flex: 1;
      background: linear-gradient(180deg, rgba(79, 70, 229, 0.9) 0%, rgba(55, 48, 163, 0.95) 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      }
    }

    .brand-content {
      position: relative;
      z-index: 1;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .brand-panel h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: white;
    }

    .tagline {
      font-size: 1.125rem;
      line-height: 1.6;
      opacity: 0.9;
      margin-bottom: 40px;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      backdrop-filter: blur(5px);
      transition: all var(--transition-fast);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(4px);
      }

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      span {
        font-weight: 500;
      }
    }

    .brand-footer {
      position: relative;
      z-index: 1;

      p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.7;
      }
    }

    .form-panel {
      flex: 1;
      background: var(--bg-card);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: none !important;
      border: none !important;
      background: transparent !important;
    }

    .form {
      padding: 24px 0;
    }

    .form-header {
      margin-bottom: 24px;

      h2 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .submit-btn {
      width: 100%;
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;

      mat-spinner {
        display: inline-block;
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--error-bg);
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius-md);
      margin-bottom: 16px;
      font-size: 0.875rem;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }

    .demo-credentials {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      margin-top: 16px;
      font-size: 0.875rem;
      color: var(--text-secondary);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--primary);
      }

      strong {
        color: var(--text-primary);
      }
    }

    .company-section {
      margin: 16px 0;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);

      .section-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 12px;
      }

      .company-radio {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .company-field {
        width: 100%;
        margin-top: 8px;
        margin-bottom: 0;
      }
    }

    ::ng-deep .mat-mdc-tab-labels {
      justify-content: center;
      gap: 8px;
    }

    ::ng-deep .mat-mdc-tab {
      min-width: auto;
      padding: 0 24px;

      .mdc-tab__content {
        gap: 8px;
      }
    }

    @media (max-width: 900px) {
      .login-wrapper {
        flex-direction: column;
        max-width: 480px;
      }

      .brand-panel {
        padding: 32px;
        min-height: auto;
      }

      .features {
        display: none;
      }

      .tagline {
        margin-bottom: 0;
        font-size: 1rem;
      }

      .form-panel {
        padding: 32px;
      }
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 0;
      }

      .login-wrapper {
        border-radius: 0;
        min-height: 100vh;
      }

      .brand-panel {
        padding: 24px;
      }

      .form-panel {
        padding: 24px;
      }

      .logo-section h1 {
        font-size: 24px;
      }

      .form-header h2 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  registerData: { username: string; email: string; password: string; fullName: string; companyId?: number; companyName?: string } = {
    username: '', email: '', password: '', fullName: ''
  };
  hidePassword = true;
  loading = false;
  errorMessage = '';
  companyOption = 'none';
  companies: CompanyOption[] = [];

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    this.loadCompanies();
  }

  loadCompanies() {
    this.authService.getCompanies().subscribe({
      next: (companies) => this.companies = companies,
      error: () => this.companies = []
    });
  }

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Connection error. Please try again.';
      }
    });
  }

  register() {
    this.loading = true;
    this.errorMessage = '';

    // Prepare registration data based on company option
    const data = { ...this.registerData };
    if (this.companyOption === 'none') {
      delete data.companyId;
      delete data.companyName;
    } else if (this.companyOption === 'existing') {
      delete data.companyName;
    } else if (this.companyOption === 'new') {
      delete data.companyId;
    }

    this.authService.register(data).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Connection error. Please try again.';
      }
    });
  }
}
