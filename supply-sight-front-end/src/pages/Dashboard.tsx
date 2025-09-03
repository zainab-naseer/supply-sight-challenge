import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import KPICards from '../components/KPICards';
import Filters from '../components/Filters';
import StockDemandChart from '../components/StockDemandChart';
import ProductsTable from '../components/ProductsTable';
import ProductDrawer from '../components/ProductDrawer';
import { setProducts, setWarehouses, setKpis } from '../store/slices/dashboardSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  const GET_DASHBOARD_DATA = gql`
    query GetDashboardData {
    products {
    id
    name
    warehouse
    sku
    stock
    demand
    }
    warehouses {
    code
    name
    city
    country
    }
    kpis(range: "30") {
      date
      stock
      demand
    }
  }
  `; 

    const { data, loading, error } = useQuery(GET_DASHBOARD_DATA);
    const products = data ? data.products : [];
    const warehouses = data ? data.warehouses : [];
    const kpis = data ? data.kpis : [];

    console.log({
      products,
      warehouses,
      loading,
      error
    })
    

  useEffect(() => {
    if (data) {
      dispatch(setProducts(products));
      dispatch(setWarehouses(warehouses));
      dispatch(setKpis(kpis));
    }
  }, [data, dispatch, products, warehouses, kpis]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <span className="text-gray-500 text-lg mb-4">Loading dashboard data...</span>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        <div className="w-full mt-8 opacity-50 pointer-events-none">
          <Filters />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <span className="text-red-500 text-lg mb-4">Error loading dashboard: {error.message}</span>
        <div className="w-full mt-8 opacity-50 pointer-events-none">
          <Filters />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KPICards />
      <Filters />
      <StockDemandChart />
      <ProductsTable />
      <ProductDrawer />
    </div>
  );
};

export default Dashboard;