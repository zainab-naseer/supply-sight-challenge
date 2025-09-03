import React from 'react';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { RootState } from '../store';

const StockDemandChart: React.FC = () => {
  const { kpis } = useSelector((state: RootState) => state.dashboard);
  const { dateRange } = useSelector((state: RootState) => state.filters);

  const chartData = React.useMemo(() => {
    const days = parseInt(dateRange);
    const filteredKpis = kpis.slice(-days);

    return {
      categories: filteredKpis.map(kpi => new Date(kpi.date).toLocaleDateString()),
      stockData: filteredKpis.map(kpi => kpi.stock),
      demandData: filteredKpis.map(kpi => kpi.demand),
    };
  }, [kpis, dateRange]);

  const options: Highcharts.Options = {
    title: {
      text: 'Stock vs Demand Trend',
      style: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
      },
    },
    subtitle: {
      text: `Last ${dateRange} days`,
      style: {
        color: '#6B7280',
      },
    },
    xAxis: {
      categories: chartData.categories,
      title: {
        text: 'Date',
        style: { color: '#6B7280' },
      },
      labels: {
        style: { color: '#6B7280' },
      },
    },
    yAxis: {
      title: {
        text: 'Quantity',
        style: { color: '#6B7280' },
      },
      labels: {
        style: { color: '#6B7280' },
      },
      gridLineColor: '#F3F4F6',
    },
    series: [
      {
        name: 'Stock',
        type: 'line',
        data: chartData.stockData,
        color: '#3B82F6',
        lineWidth: 3,
        marker: {
          radius: 4,
          fillColor: '#3B82F6',
        },
      },
      {
        name: 'Demand',
        type: 'line',
        data: chartData.demandData,
        color: '#10B981',
        lineWidth: 3,
        marker: {
          radius: 4,
          fillColor: '#10B981',
        },
      },
    ],
    legend: {
      align: 'right',
      verticalAlign: 'top',
      layout: 'horizontal',
      itemStyle: {
        color: '#374151',
        fontWeight: '500',
      },
    },
    plotOptions: {
      line: {
        animation: {
          duration: 1000,
        },
        marker: {
          hover: {
            enabled: true,
            radiusPlus: 2,
          },
        },
      },
    },
    tooltip: {
      shared: true,
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderRadius: 8,
      shadow: true,
      style: {
        color: '#374151',
      },
    },
    chart: {
      backgroundColor: 'white',
      borderRadius: 8,
      height: 400,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StockDemandChart;