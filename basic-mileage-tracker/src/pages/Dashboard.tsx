// src/pages/Dashboard.tsx (Button color changed)
import React, { useState } from 'react';
import { db, Trip, Expense } from '../data/db';
import TripModal from '../components/TripModal';
import ExpenseModal from '../components/ExpenseModal';
import StatCard from '../components/StatCard'; // Import StatCard
// Corrected path assuming RecentTripsTable is directly in components
import RecentTripsTable from '../components/trips/RecentTripsTable'; // Make sure path is correct
import { useDashboardData } from '../hooks/useDashboardData';
import { Button, Spinner, Alert } from 'flowbite-react';
import {
    HiOutlinePlus,
    HiOutlineCalendar,
    HiOutlineMap,
    HiOutlineClipboardList,
    HiOutlineCash,
    HiOutlineBeaker,
    HiOutlineDocumentText,
    HiOutlineTruck,
    HiOutlineChartBar,
    HiOutlineExclamationCircle
} from 'react-icons/hi';


const Dashboard: React.FC = () => {
    // --- State for Modals ---
    const [isTripModalOpen, setIsTripModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    // --- Use the custom hook ---
    const { stats, recentTrips, isLoading, error, refreshData } = useDashboardData();

    // --- Add Handlers ---
    const handleAddTrip = async (tripData: Trip | Omit<Trip, 'id'>) => {
        try {
            await db.trips.add(tripData as Trip);
            refreshData();
            setIsTripModalOpen(false);
        } catch (err) {
            console.error("Error adding trip:", err);
            alert(`Failed to add trip: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleAddExpense = async (expenseData: Expense | Omit<Expense, 'id'>) => {
        try {
            await db.expenses.add(expenseData as Expense);
            refreshData();
            setIsExpenseModalOpen(false);
        } catch (err) {
            console.error('Error adding expense:', err);
            alert(`Failed to add expense: ${err instanceof Error ? err.message : 'Check console/setup.'}`);
        }
    };

    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Mileage Tracker</h1>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <Spinner size="xl" aria-label="Loading dashboard data..." />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">Loading data...</span>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                 <Alert color="failure" icon={HiOutlineExclamationCircle} className="mb-6">
                    <span className="font-medium">Error!</span> {error}. Please try refreshing the page or check the console.
                 </Alert>
            )}

            {/* Main Content */}
            {!isLoading && !error && (
                <>
                    {/* Stats Grid - Simplified to direct 3x3 on large screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {/* All StatCards are direct children of the grid */}
                        <StatCard
                            icon={HiOutlineCalendar}
                            title="TOTAL TRIPS"
                            value={stats.totalTrips}
                            link="/trips"
                        />
                        <StatCard
                            icon={HiOutlineMap}
                            title="TOTAL MILES"
                            value={stats.totalMiles.toFixed(1)}
                        />
                        <StatCard
                            icon={HiOutlineClipboardList}
                            title="AVG MILES / TRIP"
                            value={stats.avgMiles.toFixed(1)}
                        />
                        <StatCard
                            icon={HiOutlineCash}
                            title="TOTAL EXPENSES"
                            value={`$${stats.totalExpenses.toFixed(2)}`}
                            link="/expenses"
                        />
                        <StatCard
                            icon={HiOutlineBeaker} // Consider MdOutlineLocalGasStation
                            title="FUEL EXPENSES"
                            value={`$${stats.fuelExpenses.toFixed(2)}`}
                        />
                        <StatCard
                            icon={HiOutlineDocumentText} // Consider FaTools
                            title="MAINT. EXPENSES"
                            value={`$${stats.maintenanceExpenses.toFixed(2)}`}
                        />
                        <StatCard
                            icon={HiOutlineTruck} // Consider FaGasPump
                            title="FUEL COST / MILE"
                            value={stats.costPerMile > 0 ? `$${stats.costPerMile.toFixed(3)}` : 'N/A'}
                        />
                        <StatCard
                            icon={HiOutlineChartBar}
                            title="AVG MPG"
                            value={stats.averageMPG > 0 ? stats.averageMPG.toFixed(1) : 'N/A'}
                        />
                        <StatCard
                            icon={HiOutlineBeaker} // Consider FaMoneyBillWave
                            title="AVG PRICE / GAL"
                            value={stats.averagePricePerGallon > 0 ? `$${stats.averagePricePerGallon.toFixed(3)}` : 'N/A'}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Button
                            onClick={() => setIsTripModalOpen(true)}
                            color="blue" // Keep blue
                            size="lg"
                        >
                            <HiOutlinePlus className="mr-2 h-5 w-5" />
                            Add New Trip
                        </Button>
                        <Button
                            onClick={() => setIsExpenseModalOpen(true)}
                            color="blue" // <<<< CHANGED HERE from "success"
                            size="lg"
                        >
                            <HiOutlinePlus className="mr-2 h-5 w-5" />
                            Add Expense
                        </Button>
                    </div>

                    {/* Recent Trips Table */}
                    <RecentTripsTable trips={recentTrips} />
                </>
            )}

            {/* Modals */}
             <TripModal
               show={isTripModalOpen}
               onClose={() => setIsTripModalOpen(false)}
               onAddTrip={handleAddTrip}
             />
             <ExpenseModal
               show={isExpenseModalOpen}
               onClose={() => setIsExpenseModalOpen(false)}
               onAddExpense={handleAddExpense}
             />

        </div> // End of container div
    );
};

export default Dashboard;