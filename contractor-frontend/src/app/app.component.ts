import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './components/layout/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, MatIconModule, MatButtonModule],
  template: `
    <div class="app-container" [class.with-sidebar]="authService.isAuthenticated()">
      <app-sidebar
        *ngIf="authService.isAuthenticated()"
        [collapsed]="sidebarCollapsed"
        [mobileOpen]="mobileMenuOpen"
        (collapsedChange)="sidebarCollapsed = $event"
        (mobileOpenChange)="mobileMenuOpen = $event">
      </app-sidebar>

      <div class="main-wrapper" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Mobile Header -->
        <header class="mobile-header" *ngIf="authService.isAuthenticated()">
          <button mat-icon-button (click)="mobileMenuOpen = true">
            <mat-icon>menu</mat-icon>
          </button>
          <div class="mobile-logo">
            <mat-icon>architecture</mat-icon>
            <span>ContractorPro</span>
          </div>
          <div class="spacer"></div>
        </header>

        <main class="main-content" [class.full-width]="!authService.isAuthenticated()">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .main-wrapper {
      flex: 1;
      min-height: 100vh;
      transition: margin-left var(--transition-normal);
    }

    .app-container.with-sidebar .main-wrapper {
      margin-left: var(--sidebar-width);

      &.sidebar-collapsed {
        margin-left: var(--sidebar-collapsed-width);
      }
    }

    .main-content {
      min-height: 100vh;
      background: var(--bg-primary);

      &.full-width {
        margin-left: 0;
      }
    }

    .mobile-header {
      display: none;
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-card);
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-light);
      align-items: center;
      gap: 12px;
      box-shadow: var(--shadow-sm);

      .mobile-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: var(--text-primary);

        mat-icon {
          color: var(--primary);
        }
      }

      .spacer {
        flex: 1;
      }
    }

    @media (max-width: 1024px) {
      .app-container.with-sidebar .main-wrapper {
        margin-left: 0;

        &.sidebar-collapsed {
          margin-left: 0;
        }
      }

      .mobile-header {
        display: flex;
      }
    }
  `]
})
export class AppComponent {
  title = 'ContractorPro';
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  constructor(public authService: AuthService) {}
}
