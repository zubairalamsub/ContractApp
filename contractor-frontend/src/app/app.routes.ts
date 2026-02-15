import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { ContractDetailComponent } from './pages/contract-detail/contract-detail.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { InfoComponent } from './pages/info/info.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'contracts', component: ContractsComponent, canActivate: [authGuard] },
  { path: 'contracts/:id', component: ContractDetailComponent, canActivate: [authGuard] },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
  { path: 'company', component: CompanyProfileComponent, canActivate: [authGuard] },
  { path: 'info', component: InfoComponent, canActivate: [authGuard] }
];
