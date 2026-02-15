import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <div class="sidebar">
      <div class="logo">
        <h2>ContractorPro</h2>
      </div>
      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        <a mat-list-item routerLink="/contracts" routerLinkActive="active">
          <mat-icon matListItemIcon>description</mat-icon>
          <span matListItemTitle>Contracts</span>
        </a>
        <a mat-list-item routerLink="/suppliers" routerLinkActive="active">
          <mat-icon matListItemIcon>business</mat-icon>
          <span matListItemTitle>Suppliers</span>
        </a>
        <a mat-list-item routerLink="/categories" routerLinkActive="active">
          <mat-icon matListItemIcon>category</mat-icon>
          <span matListItemTitle>Categories</span>
        </a>
      </mat-nav-list>

      <div class="sidebar-footer">
        <mat-divider></mat-divider>
        <div class="user-info" *ngIf="authService.getCurrentUser() as user">
          <mat-icon>account_circle</mat-icon>
          <div class="user-details">
            <span class="user-name">{{user.fullName}}</span>
            <span class="user-role">{{user.role}}</span>
          </div>
        </div>
        <button mat-button class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #1a1a2e;
      color: white;
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
    }
    .logo {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
    }
    mat-nav-list {
      padding-top: 10px;
      flex: 1;
    }
    a[mat-list-item] {
      color: rgba(255,255,255,0.7);
      margin: 5px 10px;
      border-radius: 8px;
      &:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
      &.active {
        background: #4361ee;
        color: white;
      }
    }
    mat-icon {
      color: inherit;
    }
    .sidebar-footer {
      padding: 16px;
      mat-divider {
        background: rgba(255,255,255,0.1);
        margin-bottom: 16px;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      margin-bottom: 8px;
      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: rgba(255,255,255,0.7);
      }
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-weight: 500;
      font-size: 14px;
    }
    .user-role {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
    }
    .logout-btn {
      width: 100%;
      color: rgba(255,255,255,0.7);
      justify-content: flex-start;
      mat-icon {
        margin-right: 8px;
      }
      &:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
    }
  `]
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
