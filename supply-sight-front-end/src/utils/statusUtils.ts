import { Product, ProductStatus, ProductWithStatus } from '../types';

export const getProductStatus = (stock: number, demand: number): ProductStatus => {
  if (stock > demand) return 'healthy';
  if (stock === demand) return 'low';
  return 'critical';
};

export const addStatusToProducts = (products: Product[]): ProductWithStatus[] => {
  return products.map(product => ({
    ...product,
    status: getProductStatus(product.stock, product.demand),
  }));
};

export const getStatusColor = (status: ProductStatus): string => {
  switch (status) {
    case 'healthy': return 'text-emerald-600';
    case 'low': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getStatusBg = (status: ProductStatus): string => {
  switch (status) {
    case 'healthy': return 'bg-emerald-50';
    case 'low': return 'bg-yellow-50';
    case 'critical': return 'bg-red-50';
    default: return 'bg-gray-50';
  }
};

export const getStatusIcon = (status: ProductStatus): string => {
  switch (status) {
    case 'healthy': return '🟢';
    case 'low': return '🟡';
    case 'critical': return '🔴';
    default: return '⚪';
  }
};