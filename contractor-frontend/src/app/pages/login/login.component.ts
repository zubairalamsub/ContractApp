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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTabsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="logo">
          <h1>ContractorPro</h1>
          <p>Contract Management System</p>
        </div>

        <mat-tab-group>
          <mat-tab label="Login">
            <form (ngSubmit)="login()" #loginForm="ngForm" class="form">
              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input matInput [(ngModel)]="loginData.username" name="username" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'"
                       [(ngModel)]="loginData.password" name="password" required>
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix type="button"
                        (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <div class="error-message" *ngIf="errorMessage">
                {{errorMessage}}
              </div>

              <button mat-raised-button color="primary" type="submit"
                      [disabled]="!loginForm.valid || loading" class="submit-btn">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Login</span>
              </button>
            </form>
          </mat-tab>

          <mat-tab label="Register">
            <form (ngSubmit)="register()" #registerForm="ngForm" class="form">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput [(ngModel)]="registerData.fullName" name="fullName" required>
                <mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input matInput [(ngModel)]="registerData.username" name="regUsername" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" [(ngModel)]="registerData.email" name="email" required>
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'"
                       [(ngModel)]="registerData.password" name="regPassword" required minlength="6">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix type="button"
                        (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <div class="error-message" *ngIf="errorMessage">
                {{errorMessage}}
              </div>

              <button mat-raised-button color="primary" type="submit"
                      [disabled]="!registerForm.valid || loading" class="submit-btn">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Register</span>
              </button>
            </form>
          </mat-tab>
        </mat-tab-group>

        <div class="demo-credentials">
          <p>Demo: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
      h1 {
        margin: 0;
        color: #1a1a2e;
        font-size: 28px;
      }
      p {
        margin: 4px 0 0;
        color: #6b7280;
        font-size: 14px;
      }
    }
    .form {
      padding: 24px 0;
      mat-form-field {
        width: 100%;
        margin-bottom: 8px;
      }
    }
    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      mat-spinner {
        display: inline-block;
      }
    }
    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .demo-credentials {
      text-align: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      p {
        margin: 0;
        color: #6b7280;
        font-size: 13px;
      }
    }
  `]
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  registerData = { username: '', email: '', password: '', fullName: '' };
  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
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

    this.authService.register(this.registerData).subscribe({
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
