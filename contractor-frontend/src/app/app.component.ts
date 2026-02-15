import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/layout/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container" [class.with-sidebar]="authService.isAuthenticated()">
      <app-sidebar *ngIf="authService.isAuthenticated()"></app-sidebar>
      <main class="main-content" [class.full-width]="!authService.isAuthenticated()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      background: #f8fafc;
      min-height: 100vh;
      &.full-width {
        margin-left: 0;
      }
    }
    .app-container.with-sidebar .main-content {
      margin-left: 250px;
    }
  `]
})
export class AppComponent {
  title = 'ContractorPro';

  constructor(public authService: AuthService) {}
}
