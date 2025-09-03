import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { RootState } from '../store';
import { setSearch, setWarehouse, setStatus, resetFilters } from '../store/slices/filtersSlice';

const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const { search, warehouse, status } = useSelector((state: RootState) => state.filters);
  const { warehouses } = useSelector((state: RootState) => state.dashboard);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'healthy', label: '🟢 Healthy' },
    { value: 'low', label: '🟡 Low' },
    { value: 'critical', label: '🔴 Critical' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Name, SKU, or ID"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            value={warehouse}
            onChange={(e) => dispatch(setWarehouse(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.code} value={wh.code}>
                {wh.name} ({wh.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => dispatch(setStatus(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => dispatch(resetFilters())}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;