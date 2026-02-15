import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract, ContractItem, Category, Supplier, DashboardStats, Company } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://contractapp-k7cc.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`);
  }

  // Contracts
  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.baseUrl}/contracts`);
  }

  getContract(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/contracts/${id}`);
  }

  createContract(contract: Partial<Contract>): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseUrl}/contracts`, contract);
  }

  updateContract(id: number, contract: Contract): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/contracts/${id}`, contract);
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/contracts/${id}`);
  }

  // Contract Items
  getContractItems(contractId: number): Observable<ContractItem[]> {
    return this.http.get<ContractItem[]>(`${this.baseUrl}/contracts/${contractId}/items`);
  }

  addContractItem(contractId: number, item: Partial<ContractItem>): Observable<ContractItem> {
    return this.http.post<ContractItem>(`${this.baseUrl}/contracts/${contractId}/items`, item);
  }

  updateContractItem(contractId: number, itemId: number, item: ContractItem): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/contracts/${contractId}/items/${itemId}`, item);
  }

  deleteContractItem(contractId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/contracts/${contractId}/items/${itemId}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategoriesByGroup(group: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/group/${group}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: number, category: Category): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  // Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}/suppliers`);
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/suppliers/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/suppliers`, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/suppliers/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/suppliers/${id}`);
  }

  // Company
  getCompany(): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/company`);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/company`, company);
  }
}
