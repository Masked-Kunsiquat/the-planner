// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { db, Trip, Expense } from '../data/db';
import { VehicleAnalyticsService } from '../services/VehicleAnalyticsService';

// Interface for the statistics object
export interface DashboardStats {
    totalTrips: number;
    totalMiles: number;
    avgMiles: number;
    totalExpenses: number;
    fuelExpenses: number;
    maintenanceExpenses: number;
    costPerMile: number;
    averageMPG: number;
    totalGallonsFilled: number;
    averagePricePerGallon: number;
}

// Initial state for stats
const initialStats: DashboardStats = {
    totalTrips: 0,
    totalMiles: 0,
    avgMiles: 0,
    totalExpenses: 0,
    fuelExpenses: 0,
    maintenanceExpenses: 0,
    costPerMile: 0,
    averageMPG: 0,
    totalGallonsFilled: 0,
    averagePricePerGallon: 0,
};

export function useDashboardData() {
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch all data and calculate stats
    const fetchDataAndCalculateStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Parallel fetching
            const [allTrips, allExpenses, mpgReport, fuelCostReport] = await Promise.all([
                db.trips.orderBy('date').reverse().toArray(), // Fetch trips sorted descending by date
                db.expenses.toArray(),
                VehicleAnalyticsService.calculateDetailedMPG(),
                VehicleAnalyticsService.calculateFuelCosts()
            ]);

            // --- Calculations ---
            const totalMiles = allTrips.reduce((sum, trip) => sum + trip.distance, 0);
            const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const fuelExpenses = allExpenses
                .filter(expense => expense.type === 'gas')
                .reduce((sum, expense) => sum + expense.amount, 0);
            const maintenanceExpenses = allExpenses
                .filter(expense => expense.type === 'maintenance')
                .reduce((sum, expense) => sum + expense.amount, 0);

            // Use fuel expenses for cost per mile calculation
            const costPerMile = totalMiles > 0 ? fuelExpenses / totalMiles : 0;

            // Update state
            setStats({
                totalTrips: allTrips.length,
                totalMiles: totalMiles,
                avgMiles: allTrips.length > 0 ? totalMiles / allTrips.length : 0,
                totalExpenses: totalExpenses,
                fuelExpenses: fuelExpenses,
                maintenanceExpenses: maintenanceExpenses,
                costPerMile: costPerMile,
                averageMPG: mpgReport.averageMPG,
                totalGallonsFilled: fuelCostReport.totalGallonsFilled,
                averagePricePerGallon: fuelCostReport.averagePricePerGallon,
            });

            // Set recent trips (already sorted from query)
            setRecentTrips(allTrips.slice(0, 5));

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data.');
            // Reset states on error
            setStats(initialStats);
            setRecentTrips([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this useCallback memoizes the function once

    // Initial fetch on mount
    useEffect(() => {
        fetchDataAndCalculateStats();
    }, [fetchDataAndCalculateStats]); // Depend on the memoized fetch function

    // Expose stats, recent trips, loading/error state, and a refresh function
    return {
        stats,
        recentTrips,
        isLoading,
        error,
        refreshData: fetchDataAndCalculateStats // Expose the function to allow manual refresh
    };
}