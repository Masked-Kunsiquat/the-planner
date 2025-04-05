// src/components/StatsDashboard.tsx
import React from 'react';
import { Card } from 'flowbite-react';
import { HiOutlineArrowCircleRight, HiOutlineDocumentReport } from 'react-icons/hi';
import { TripStats } from '../db';

interface StatsDashboardProps {
  stats: TripStats;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Miles</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{stats.totalMiles.toFixed(1)}</p>
          </div>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 text-blue-500 dark:text-blue-300">
            <HiOutlineArrowCircleRight className="h-6 w-6" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{stats.totalTrips}</p>
          </div>
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 text-green-500 dark:text-green-300">
            <HiOutlineDocumentReport className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsDashboard;