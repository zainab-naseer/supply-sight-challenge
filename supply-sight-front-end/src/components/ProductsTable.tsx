import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { RootState } from '../store';
import { setCurrentPage, setTotal } from '../store/slices/filtersSlice';
import { setSelectedProduct, setDrawerOpen } from '../store/slices/dashboardSlice';
import { useFilteredProducts } from '../hooks/useProducts';
import { getStatusColor, getStatusBg, getStatusIcon } from '../utils/statusUtils';

const ProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { warehouses } = useSelector((state: RootState) => state.dashboard);
  const { pagination } = useSelector((state: RootState) => state.filters);
  const { paginatedProducts, totalProducts } = useFilteredProducts();

  React.useEffect(() => {
    dispatch(setTotal(totalProducts));
  }, [totalProducts, dispatch]);

  const getWarehouseName = (warehouseCode: string) => {
    const warehouse = warehouses.find(wh => wh.code === warehouseCode);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : warehouseCode;
  };

  const handleRowClick = (product: any) => {
    dispatch(setSelectedProduct(product));
    dispatch(setDrawerOpen(true));
  };

  const totalPages = Math.ceil(totalProducts / pagination.pageSize);

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      dispatch(setCurrentPage(pagination.currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < totalPages) {
      dispatch(setCurrentPage(pagination.currentPage + 1));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Products</h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {totalProducts}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product)}
                className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 ${getStatusBg(product.status)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-mono">{product.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-mono">{product.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{getWarehouseName(product.warehouse)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.stock.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.demand.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(product.status)}`}>
                    <span>{getStatusIcon(product.status)}</span>
                    <span className="capitalize">{product.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.pageSize, totalProducts)} of{' '}
          {totalProducts} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={pagination.currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            {pagination.currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;