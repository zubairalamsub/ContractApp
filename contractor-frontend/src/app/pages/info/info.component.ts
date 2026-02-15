import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatButtonModule,
    MatDividerModule, MatListModule
  ],
  template: `
    <div class="info-page fade-in">
      <header class="page-header">
        <div class="header-content">
          <h1>Information</h1>
          <p class="subtitle">About ContractorPro and how to use it</p>
        </div>
      </header>

      <div class="info-content">
        <!-- App Info Card -->
        <mat-card class="info-card app-card">
          <div class="app-header">
            <div class="app-logo">
              <mat-icon>architecture</mat-icon>
            </div>
            <div class="app-title">
              <h2>ContractorPro</h2>
              <span class="version">Version 1.0.0</span>
            </div>
          </div>
          <mat-card-content>
            <p class="app-description">
              ContractorPro is a comprehensive contract management system designed for ICT and Electrical contractors.
              Manage contracts, track items, monitor budgets, and generate reports all in one place.
            </p>
          </mat-card-content>
        </mat-card>

        <!-- Features Card -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>star</mat-icon>
              Key Features
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>description</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Contract Management</h4>
                  <p>Create and manage contracts with detailed item tracking</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>inventory_2</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Item Tracking</h4>
                  <p>Track quantities, prices, and delivery status</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>business</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Supplier Management</h4>
                  <p>Maintain supplier database with contact details</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>category</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Category Organization</h4>
                  <p>Organize items by ICT and Electrical categories</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>analytics</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Dashboard Analytics</h4>
                  <p>Visual overview of contracts and budget status</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>download</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Export Reports</h4>
                  <p>Export to Excel, CSV, or print reports</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Quick Guide Card -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>help_outline</mat-icon>
              Quick Start Guide
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list class="guide-list">
              <mat-list-item>
                <mat-icon matListItemIcon>looks_one</mat-icon>
                <div matListItemTitle>Set up your Company Profile</div>
                <div matListItemLine>Add your company details and logo</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>looks_two</mat-icon>
                <div matListItemTitle>Add Suppliers</div>
                <div matListItemLine>Create supplier records with contact information</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>looks_3</mat-icon>
                <div matListItemTitle>Customize Categories</div>
                <div matListItemLine>Add custom categories or use default ICT/Electrical categories</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>looks_4</mat-icon>
                <div matListItemTitle>Create Contracts</div>
                <div matListItemLine>Add contracts with client details and budget</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>looks_5</mat-icon>
                <div matListItemTitle>Add Contract Items</div>
                <div matListItemLine>Track items with quantities, prices, and delivery status</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>looks_6</mat-icon>
                <div matListItemTitle>Monitor & Export</div>
                <div matListItemLine>Use dashboard for overview and export reports as needed</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Keyboard Shortcuts -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>keyboard</mat-icon>
              Tips & Shortcuts
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="tips-grid">
              <div class="tip-item">
                <mat-icon>touch_app</mat-icon>
                <p>Click on a contract row to view details</p>
              </div>
              <div class="tip-item">
                <mat-icon>filter_list</mat-icon>
                <p>Use filters to search and sort items</p>
              </div>
              <div class="tip-item">
                <mat-icon>print</mat-icon>
                <p>Print reports directly from contract detail page</p>
              </div>
              <div class="tip-item">
                <mat-icon>smartphone</mat-icon>
                <p>Fully responsive - works on mobile devices</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tech Stack -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>code</mat-icon>
              Technology Stack
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="tech-grid">
              <div class="tech-item">
                <span class="tech-label">Frontend</span>
                <span class="tech-value">Angular 18 + Material Design</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">Backend</span>
                <span class="tech-value">ASP.NET Core 9 Web API</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">Database</span>
                <span class="tech-value">PostgreSQL (Neon)</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">Hosting</span>
                <span class="tech-value">Vercel (Frontend) + Render (API)</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Footer -->
        <div class="info-footer">
          <p>&copy; 2024 ContractorPro. All rights reserved.</p>
          <p class="built-with">Built with Angular & .NET</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-page {
      padding: 24px;
      max-width: 1000px;
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

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .info-card {
      mat-card-header {
        margin-bottom: 16px;

        mat-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.125rem;

          mat-icon {
            color: var(--primary);
          }
        }
      }
    }

    .app-card {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;

      .app-header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 24px;
      }

      .app-logo {
        width: 72px;
        height: 72px;
        background: rgba(255,255,255,0.2);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: white;
        }
      }

      .app-title {
        h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .version {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      }

      .app-description {
        padding: 0 24px 24px;
        margin: 0;
        opacity: 0.9;
        line-height: 1.6;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--border-light);
        transform: translateY(-2px);
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: white;
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .feature-text {
        h4 {
          margin: 0 0 4px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      }
    }

    .guide-list {
      mat-list-item {
        height: auto !important;
        padding: 12px 0 !important;
        border-bottom: 1px solid var(--border-light);

        &:last-child {
          border-bottom: none;
        }

        mat-icon {
          color: var(--primary);
          margin-right: 16px;
        }
      }
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .tip-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);

      mat-icon {
        color: var(--primary);
        flex-shrink: 0;
      }

      p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .tech-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);

      .tech-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary);
      }

      .tech-value {
        font-size: 0.9375rem;
        color: var(--text-primary);
        font-weight: 500;
      }
    }

    .info-footer {
      text-align: center;
      padding: 32px 0 16px;
      color: var(--text-muted);

      p {
        margin: 0;
        font-size: 0.875rem;
      }

      .built-with {
        margin-top: 4px;
        font-size: 0.8125rem;
      }
    }

    @media (max-width: 768px) {
      .info-page {
        padding: 16px;
      }

      .page-header h1 {
        font-size: 1.5rem;
      }

      .app-card {
        .app-header {
          flex-direction: column;
          text-align: center;
          padding: 20px;
        }

        .app-title h2 {
          font-size: 1.5rem;
        }
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .tips-grid {
        grid-template-columns: 1fr;
      }

      .tech-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InfoComponent {}
