export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export type ProductStatus = 'healthy' | 'low' | 'critical';

export interface ProductWithStatus extends Product {
  status: ProductStatus;
}

export interface FilterState {
  search: string;
  warehouse: string;
  status: string;
  dateRange: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}