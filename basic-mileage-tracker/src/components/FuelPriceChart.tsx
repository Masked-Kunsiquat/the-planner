import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { db } from '../data/db'; // adjust path if needed

const FuelPriceChart: React.FC = () => {
  const [chartId] = useState(`labels-chart-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const fetchData = async () => {
      const allExpenses = await db.expenses.toArray();
      const gasExpenses = allExpenses
        .filter(e => e.type === 'gas' && e.gallons && e.gallons > 0 && e.amount)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const categories = gasExpenses.map(e =>
        new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      );

      const pricePerGallon = gasExpenses.map(e => parseFloat((e.amount / (e.gallons ?? 1)).toFixed(3)));

      const options: ApexCharts.ApexOptions = {
        xaxis: {
          categories,
          labels: {
            show: true,
            style: {
              fontFamily: 'Inter, sans-serif',
              cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            }
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: {
            style: {
              fontFamily: 'Inter, sans-serif',
              cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            },
            formatter: (value) => `$${value}`
          }
        },
        series: [
          {
            name: 'Price/Gal',
            data: pricePerGallon,
            color: '#1A56DB'
          }
        ],
        chart: {
          height: '100%',
          width: '100%',
          type: 'area',
          fontFamily: 'Inter, sans-serif',
          toolbar: { show: false }
        },
        tooltip: {
          enabled: true,
          x: { show: false }
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
            shade: '#1C64F2',
            gradientToColors: ['#1C64F2']
          }
        },
        dataLabels: { enabled: false },
        stroke: { width: 4 },
        grid: { show: false },
        legend: { show: false }
      };

      const chartEl = document.getElementById(chartId);
      if (chartEl && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(chartEl, options);
        chart.render();
        return () => chart.destroy();
      }
    };

    fetchData();
  }, [chartId]);

  return (
<div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <div className="mb-4">
    <h5 className="text-2xl font-bold text-gray-900 dark:text-white">Fuel Price Trends</h5>
    <p className="text-sm text-gray-500 dark:text-gray-400">Cost per gallon over time</p>
  </div>
  <div id={chartId} className="h-full" />
</div>

  );
};

export default FuelPriceChart;
