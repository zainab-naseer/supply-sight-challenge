import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { RootState } from '../store';
import { addStatusToProducts } from '../utils/statusUtils';
import { ProductWithStatus } from '../types';

const GET_PRODUCTS = gql`
  query GetProducts($search: String, $warehouse: String, $status: String) {
    products(search: $search, warehouse: $warehouse, status: $status) {
      id
      name
      warehouse
      sku
      stock
      demand
    }
  }
`;

export const useFilteredProducts = (): {
  filteredProducts: ProductWithStatus[];
  paginatedProducts: ProductWithStatus[];
  totalProducts: number;
  loading: boolean;
  error: any;
} => {
  const { search, warehouse, status, pagination } = useSelector((state: RootState) => state.filters);

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { search, warehouse, status },
  });

  const products: ProductWithStatus[] = data?.products ? addStatusToProducts(data.products) : [];

  const paginatedProducts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return products.slice(startIndex, endIndex);
  }, [products, pagination.currentPage, pagination.pageSize]);

  return {
    filteredProducts: products,
    paginatedProducts,
    totalProducts: products.length,
    loading,
    error,
  };
};