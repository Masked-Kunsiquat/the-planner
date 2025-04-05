// src/components/RecentTripsTable.tsx
import React from 'react';
import { Trip } from '../../data/db';
import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';

interface RecentTripsTableProps {
    trips: Trip[];
}

const RecentTripsTable: React.FC<RecentTripsTableProps> = ({ trips }) => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Trips</h2>
                <Link to="/trips" className="text-blue-500 hover:text-blue-700">
                    View All
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {trips.length > 0 ? (
                            trips.map((trip) => ( // Use trip.id if available and unique, otherwise index is fallback
                                <tr key={trip.id ?? Math.random()} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {new Date(trip.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {trip.distance.toFixed(1)} miles
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 truncate max-w-xs"> {/* Added truncate */}
                                        {trip.purpose}
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No trips recorded yet. Add your first trip!
                                </td>
                             </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RecentTripsTable;