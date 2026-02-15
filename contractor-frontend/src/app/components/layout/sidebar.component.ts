import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule, MatTooltipModule],
  template: `
    <div class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <div class="logo-icon">
            <mat-icon>architecture</mat-icon>
          </div>
          <div class="logo-text">
            <h2>ContractorPro</h2>
            <span>Management System</span>
          </div>
        </div>
        <div class="logo-collapsed" *ngIf="collapsed">
          <mat-icon>architecture</mat-icon>
        </div>
        <button mat-icon-button class="collapse-btn desktop-only" (click)="toggleCollapse()">
          <mat-icon>{{collapsed ? 'chevron_right' : 'chevron_left'}}</mat-icon>
        </button>
        <button mat-icon-button class="close-btn mobile-only" (click)="closeMobile()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <nav class="nav-menu">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: item.exact}"
           class="nav-item"
           [matTooltip]="collapsed ? item.label : ''"
           matTooltipPosition="right"
           (click)="closeMobile()">
          <mat-icon>{{item.icon}}</mat-icon>
          <span class="nav-label" *ngIf="!collapsed">{{item.label}}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <mat-divider></mat-divider>
        <div class="user-info" *ngIf="authService.getCurrentUser() as user">
          <div class="user-avatar">
            {{user.fullName?.charAt(0) || 'U'}}
          </div>
          <div class="user-details" *ngIf="!collapsed">
            <span class="user-name">{{user.fullName}}</span>
            <span class="user-role">{{user.role}}</span>
          </div>
        </div>
        <button mat-button class="logout-btn" (click)="logout()" [matTooltip]="collapsed ? 'Logout' : ''" matTooltipPosition="right">
          <mat-icon>logout</mat-icon>
          <span *ngIf="!collapsed">Logout</span>
        </button>
      </div>
    </div>

    <div class="sidebar-overlay" *ngIf="mobileOpen" (click)="closeMobile()"></div>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-dark-secondary) 100%);
      color: var(--text-light);
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-xl);

      &.collapsed {
        width: var(--sidebar-collapsed-width);

        .nav-item {
          justify-content: center;
          padding: 14px;
        }
      }
    }

    .sidebar-header {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      min-height: 72px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        color: white;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .logo-text {
      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: white;
        letter-spacing: -0.02em;
      }
      span {
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 400;
      }
    }

    .logo-collapsed {
      width: 100%;
      display: flex;
      justify-content: center;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: var(--primary-light);
      }
    }

    .collapse-btn, .close-btn {
      color: var(--text-muted);

      &:hover {
        color: white;
        background: rgba(255,255,255,0.1) !important;
      }
    }

    .nav-menu {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      text-decoration: none;
      transition: all var(--transition-fast);
      font-weight: 500;
      font-size: 14px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: inherit;
        transition: color var(--transition-fast);
      }

      &:hover {
        background: rgba(255,255,255,0.08);
        color: white;
      }

      &.active {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);

        mat-icon {
          color: white;
        }
      }
    }

    .sidebar-footer {
      padding: 16px;

      mat-divider {
        background: rgba(255,255,255,0.08);
        margin-bottom: 16px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      border-radius: var(--radius-md);
      margin-bottom: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      color: white;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      color: var(--text-muted);
    }

    .logout-btn {
      width: 100%;
      color: var(--text-muted);
      justify-content: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-weight: 500;

      mat-icon {
        margin: 0;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &:hover {
        background: rgba(239, 68, 68, 0.15) !important;
        color: var(--error);
      }
    }

    .sidebar-overlay {
      display: none;
    }

    .desktop-only { display: flex; }
    .mobile-only { display: none; }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);

        &.mobile-open {
          transform: translateX(0);
        }
      }

      .sidebar-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        animation: fadeIn 0.2s ease;
      }

      .desktop-only { display: none; }
      .mobile-only { display: flex; }

      .sidebar.collapsed {
        width: var(--sidebar-width);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  navItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', exact: true },
    { icon: 'description', label: 'Contracts', route: '/contracts', exact: false },
    { icon: 'business', label: 'Suppliers', route: '/suppliers', exact: false },
    { icon: 'category', label: 'Categories', route: '/categories', exact: false }
  ];

  constructor(public authService: AuthService) {}

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeMobile() {
    this.mobileOpen = false;
    this.mobileOpenChange.emit(false);
  }

  logout() {
    this.authService.logout();
  }
}
