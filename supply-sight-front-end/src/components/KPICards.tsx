import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gql } from '@apollo/client';
import { Package, Target, Percent } from 'lucide-react';

import { RootState } from '../store';

import { setKpis } from '../store/slices/dashboardSlice';
import { useQuery } from '@apollo/client/react';


const GET_KPIS = gql`
  query GetKpis($range: String!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

const KPICards: React.FC = () => {
  const dispatch = useDispatch();
  const { dateRange } = useSelector((state: RootState) => state.filters);
  const { kpis } = useSelector((state: RootState) => state.dashboard);

 const { loading, data, error } = useQuery(GET_KPIS, {
    variables: { range: dateRange },
  });
  const kpiData = React.useMemo(() => {
    const totalStock = kpis.reduce((sum, kpi) => sum + kpi.stock, 0);
    const totalDemand = kpis.reduce((sum, kpi) => sum + kpi.demand , 0);

      const totalFulfilled = kpis.reduce(
      (sum, kpi) => sum + Math.min(kpi.stock, kpi.demand),
      0
    );

  const fillRate = totalDemand > 0 ? (totalFulfilled / totalDemand) * 100 : 100;

    return {
     totalStock,
     totalDemand,
     fillRate
    };

  }, [kpis, dateRange]);

  useEffect(() => {
    if (data?.kpis) {
      dispatch(setKpis(data.kpis));
    }
  }, [data, dispatch]);

  const cards = [
    {
      title: 'Total Stock',
      value: kpiData.totalStock.toLocaleString(),
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Demand',
      value: kpiData.totalDemand.toLocaleString(),
      icon: Target,
      color: 'bg-emerald-50 text-emerald-600',
      bgColor: 'bg-emerald-500',
    },
    {
      title: 'Fill Rate',
      value: `${kpiData.fillRate.toFixed(1)}%`,
      icon: Percent,
      color: 'bg-purple-50 text-purple-600',
      bgColor: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-gray-500 text-lg">Loading KPIs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-red-500 text-lg">Error loading KPIs: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;