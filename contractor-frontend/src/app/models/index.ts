export interface Contract {
  id: number;
  contractNumber: string;
  title: string;
  client: string;
  description: string;
  totalBudget: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: ContractItem[];
}

export interface ContractItem {
  id: number;
  contractId: number;
  name: string;
  categoryId: number;
  supplierId?: number;
  quantity: number;
  usedQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryStatus: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
}

export interface Category {
  id: number;
  name: string;
  group: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  draftContracts: number;
  totalBudget: number;
  totalSpent: number;
  totalItems: number;
  totalSuppliers: number;
  pendingDeliveries: number;
  recentContracts: RecentContract[];
}

export interface RecentContract {
  id: number;
  contractNumber: string;
  title: string;
  client: string;
  status: string;
  totalBudget: number;
  spentAmount: number;
  progress: number;
}
