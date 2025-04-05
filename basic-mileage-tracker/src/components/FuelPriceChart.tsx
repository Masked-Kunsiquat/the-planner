import React, { useEffect, useState } from 'react';
 import ApexCharts from 'apexcharts';
 import { db, Expense } from '../data/db';
 import { format,subMonths, subWeeks } from 'date-fns';
 

 // Utility function to group expenses by a given unit
 const groupExpensesBy = (
  expenses: Expense[],
  unit: 'month' | 'year' | 'day'
 ): { [key: string]: number[] } => {
  const grouped: { [key: string]: number[] } = {};
  expenses.forEach((expense) => {
   let groupKey: string;
   if (unit === 'year') {
    groupKey = format(new Date(expense.date), 'yyyy');
   } else if (unit === 'month') {
    groupKey = format(new Date(expense.date), 'yyyy-MM');
   } else {
    groupKey = expense.date; // Keep original date for 'day'
   }
   if (!grouped[groupKey]) {
    grouped[groupKey] = [];
   }
   grouped[groupKey].push(expense.amount / (expense.gallons || 1));
  });
  return grouped;
 };
 

 const FuelPriceChart: React.FC = () => {
  const [chartId] = useState(`fuel-price-chart-${Math.random().toString(36).substring(2, 9)}`);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ categories: string[]; pricePerGallon: number[] }>({
   categories: [],
   pricePerGallon: [],
  });
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [aggregateUnit, setAggregateUnit] = useState<'month' | 'year' | 'day'>('month');
 

  useEffect(() => {
  const fetchData = async () => {
   setLoading(true);
   setError(null);
 

   try {
    const allExpenses = await db.expenses.toArray();
    let filteredExpenses = allExpenses.filter(
     (e): e is Expense => e.type === 'gas' && e.gallons != null && e.gallons > 0 && e.amount != null
    );
 

    // Apply date filtering
    let startDate: Date | undefined;
    if (filterPeriod === 'week') {
     startDate = subWeeks(new Date(), 1);
    } else if (filterPeriod === 'month') {
     startDate = subMonths(new Date(), 1);
    }
 

    if (startDate) {
     filteredExpenses = filteredExpenses.filter(
      (e) => new Date(e.date) >= startDate!
     );
    }
 

    const gasExpenses = filteredExpenses.sort(
     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
 

    if (gasExpenses.length === 0) {
     setChartData({ categories: [], pricePerGallon: [] });
    } else {
     // Aggregate the data
     const groupedExpenses = groupExpensesBy(gasExpenses, aggregateUnit);
     const categories: string[] = Object.keys(groupedExpenses).sort();
     const pricePerGallon: number[] = categories.map(key => {
      const prices = groupedExpenses[key];
      const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      return parseFloat(avg.toFixed(2));
     });
 

     setChartData({ categories, pricePerGallon });
    }
   } catch (err) {
    console.error('Error fetching fuel price data:', err);
    setError('Failed to fetch fuel price data.');
   } finally {
    setLoading(false);
   }
  };
 

  fetchData();
  }, [filterPeriod, aggregateUnit]);
 

  useEffect(() => {
  if (chartData.categories.length > 0 && chartData.pricePerGallon.length > 0) {
   const xAxisFormat = aggregateUnit === 'year'
    ? 'yyyy'
    : aggregateUnit === 'month'
     ? 'MMM yyyy'
     : 'MMM dd, yyyy';
 

   const options: ApexCharts.ApexOptions = {
    xaxis: {
     categories: chartData.categories.map(cat => format(new Date(cat), xAxisFormat)),
     labels: {
      show: true,
      style: {
       fontFamily: 'Inter, sans-serif',
       cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
      },
     },
     axisBorder: { show: false },
     axisTicks: { show: false },
    },
    yaxis: {
     labels: {
      style: {
       fontFamily: 'Inter, sans-serif',
       cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
      },
      formatter: (value) => `$${value}`,
     },
    },
    series: [
     {
      name: 'Price/Gal',
      data: chartData.pricePerGallon,
      color: '#1A56DB',
     },
    ],
    chart: {
     height: '100%',
     width: '100%',
     type: 'area',
     fontFamily: 'Inter, sans-serif',
     toolbar: { show: false },
    },
    tooltip: {
     enabled: true,
     x: { show: false },
    },
    fill: {
     type: 'gradient',
     gradient: {
      opacityFrom: 0.55,
      opacityTo: 0,
      shade: '#1C64F2',
      gradientToColors: ['#1C64F2'],
     },
    },
    dataLabels: { enabled: false },
    stroke: { width: 4 },
    grid: { show: false },
    legend: { show: false },
   };
 

   const chartEl = document.getElementById(chartId);
   if (chartEl && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(chartEl, options);
    chart.render();
    return () => chart.destroy();
   }
  }
  }, [chartData, chartId, aggregateUnit]);
 

  if (loading) {
  return (
   <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center">
    Loading...
   </div>
  );
  }
 

  if (error) {
  return (
   <div className="w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-center">
    {error}
   </div>
  );
  }
 

  return (
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
   <div className="flex justify-between mb-5">
    <div className="grid gap-4 grid-cols-1">
     <div>
     <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
      Fuel Price
     </h5>
     <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
      {chartData.pricePerGallon.length > 0
       ? `$${chartData.pricePerGallon[chartData.pricePerGallon.length - 1]}`
       : 'N/A'}
     </p>
     </div>
    </div>
    <div>
     <button
      id="filterDropdownButton"
      data-dropdown-toggle="filterDropdown"
      data-dropdown-placement="bottom"
      type="button"
      className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      onClick={() => document.getElementById('filterDropdown')?.classList.toggle('hidden')}
     >
      {filterPeriod === 'week' && 'Last Week'}
      {filterPeriod === 'month' && 'Last Month'}
      {filterPeriod === 'all' && 'All Time'}
      <svg
       className="w-2.5 h-2.5 ms-2.5"
       aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 10 6"
      >
       <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 4 4 4-4"
       />
      </svg>
     </button>
     <div
      id="filterDropdown"
      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
     >
      <ul
       className="py-2 text-sm text-gray-700 dark:text-gray-200"
       aria-labelledby="filterDropdownButton"
      >
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setFilterPeriod('week');
          document.getElementById('filterDropdown')?.classList.toggle('hidden');
         }}
        >
         Last Week
        </button>
       </li>
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setFilterPeriod('month');
          document.getElementById('filterDropdown')?.classList.toggle('hidden');
         }}
        >
         Last Month
        </button>
       </li>
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setFilterPeriod('all');
          document.getElementById('filterDropdown')?.classList.toggle('hidden');
         }}
        >
         All Time
        </button>
       </li>
      </ul>
     </div>
    </div>
    <div>
     <button
      id="aggregateDropdownButton"
      data-dropdown-toggle="aggregateDropdown"
      data-dropdown-placement="bottom"
      type="button"
      className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      onClick={() => document.getElementById('aggregateDropdown')?.classList.toggle('hidden')}
     >
      {aggregateUnit === 'day' && 'Daily'}
      {aggregateUnit === 'month' && 'Monthly'}
      {aggregateUnit === 'year' && 'Yearly'}
      <svg
       className="w-2.5 h-2.5 ms-2.5"
       aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 10 6"
      >
       <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 4 4 4-4"
       />
      </svg>
     </button>
     <div
      id="aggregateDropdown"
      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
     >
      <ul
       className="py-2 text-sm text-gray-700 dark:text-gray-200"
       aria-labelledby="aggregateDropdownButton"
      >
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setAggregateUnit('day');
          document.getElementById('aggregateDropdown')?.classList.toggle('hidden');
         }}
        >
         Daily
        </button>
       </li>
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setAggregateUnit('month');
          document.getElementById('aggregateDropdown')?.classList.toggle('hidden');
         }}
        >
         Monthly
        </button>
       </li>
       <li>
        <button
         className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
         onClick={() => {
          setAggregateUnit('year');
          document.getElementById('aggregateDropdown')?.classList.toggle('hidden');
         }}
        >
         Yearly
        </button>
       </li>
      </ul>
     </div>
    </div>
   </div>
   <div id={chartId} className="h-64" />
  </div>
  );
 };
 

 export default FuelPriceChart;