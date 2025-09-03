import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, PaginationState } from '../../types';

interface FiltersState extends FilterState {
  pagination: PaginationState;
}

const initialState: FiltersState = {
  search: '',
  warehouse: '',
  status: '',
  dateRange: '30',
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setWarehouse: (state, action: PayloadAction<string>) => {
      state.warehouse = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.pagination.total = action.payload;
    },
    resetFilters: (state) => {
      state.search = '';
      state.warehouse = '';
      state.status = '';
      state.pagination.currentPage = 1;
    },
  },
});

export const {
  setSearch,
  setWarehouse,
  setStatus,
  setDateRange,
  setCurrentPage,
  setTotal,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;