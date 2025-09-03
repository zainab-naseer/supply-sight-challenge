import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, KPI, Warehouse } from '../../types';
import { getProductStatus } from '../../utils/statusUtils';

interface DashboardState {
  products: Product[];
  warehouses: Warehouse[];
  kpis: KPI[];
  selectedProduct: (Product & { status: string }) | null;
  isDrawerOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  products: [],
  warehouses: [],
  kpis: [],
  selectedProduct: null,
  isDrawerOpen: false,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setWarehouses: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehouses = action.payload;
    },
    setKpis: (state, action: PayloadAction<KPI[]>) => {
      state.kpis = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        state.selectedProduct = {
          ...action.payload,
          status: action.payload.status || getProductStatus(action.payload.stock, action.payload.demand)
        };
      } else {
        state.selectedProduct = null;
      }
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    updateProductDemand: (state, action: PayloadAction<{ id: string; demand: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.demand = action.payload.demand;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct.demand = action.payload.demand;
        state.selectedProduct.status = getProductStatus(state.selectedProduct.stock, action.payload.demand);
      }
    },
    transferStock: (state, action: PayloadAction<{ id: string; from: string; to: string; qty: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.stock = Math.max(0, product.stock - action.payload.qty);
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct.stock = Math.max(0, state.selectedProduct.stock - action.payload.qty);
        state.selectedProduct.status = getProductStatus(state.selectedProduct.stock, state.selectedProduct.demand);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setWarehouses,
  setKpis,
  setSelectedProduct,
  setDrawerOpen,
  updateProductDemand,
  transferStock,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;