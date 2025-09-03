import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package } from 'lucide-react';
import { RootState } from '../store';
import { setDateRange } from '../store/slices/filtersSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { dateRange } = useSelector((state: RootState) => state.filters);

  const dateRangeOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
            <p className="text-sm text-gray-600">Supply Chain Management Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Date Range:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => dispatch(setDateRange(option.value))}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  dateRange === option.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;