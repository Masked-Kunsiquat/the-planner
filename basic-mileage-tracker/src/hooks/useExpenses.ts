// src/hooks/useExpenses.ts
import { useState, useEffect, useCallback } from 'react';
import { db, Expense } from '../data/db';
import { VehicleAnalyticsService } from '../services/VehicleAnalyticsService';

export interface ExpenseStats {
  totalSpent: number;
  totalGallons: number;
  avgMpg: number;
  bestMpg: number;
  worstMpg: number;
  totalFullTankFillups: number;
}

const initialStats: ExpenseStats = {
  totalSpent: 0,
  totalGallons: 0,
  avgMpg: 0,
  bestMpg: 0,
  worstMpg: 0,
  totalFullTankFillups: 0,
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  // --- Recalculate Stats ---
  const recalculateStats = useCallback(async (currentExpenses: Expense[]) => {
    if (currentExpenses.length > 0) {
      const gasExpenses = currentExpenses.filter(e => e.type === 'gas' && e.gallons && e.gallons > 0);
      const totalSpent = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalGallons = gasExpenses.reduce((sum, e) => sum + (e.gallons || 0), 0);
      try {
        // Pass expenses if the service needs the full list for calculation
        const mpgReport = await VehicleAnalyticsService.calculateDetailedMPG(/* pass currentExpenses if needed */);
        setStats({ totalSpent, totalGallons, avgMpg: mpgReport.averageMPG, bestMpg: mpgReport.bestMPG, worstMpg: mpgReport.worstMPG, totalFullTankFillups: mpgReport.totalFullTankFillups });
      } catch (analyticsError) {
        console.error("Error calculating MPG report:", analyticsError);
        setStats(prev => ({ ...prev, totalSpent, totalGallons, avgMpg: 0, bestMpg: 0, worstMpg: 0, totalFullTankFillups: 0 }));
        // Optionally set an error state here if needed
      }
    } else {
      setStats(initialStats);
    }
  }, []); // Dependencies: VehicleAnalyticsService if it changes, but it's likely static

  // --- Fetch Expenses ---
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allExpenses = await db.expenses.orderBy('date').reverse().toArray();
      setExpenses(allExpenses);
      await recalculateStats(allExpenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses.');
      setExpenses([]);
      setStats(initialStats);
    } finally {
      setIsLoading(false);
    }
  }, [recalculateStats]); // Dependency: recalculateStats

  // Initial fetch effect
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]); // Dependency: fetchExpenses

  // --- Add Expense ---
  const addExpense = useCallback(async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
    setIsLoading(true);
    setError(null);
    try {
      const newId = await db.expenses.add(expenseData);
      const addedExpense = { ...expenseData, id: newId };
      const updatedExpenses = [addedExpense, ...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(updatedExpenses);
      await recalculateStats(updatedExpenses);
      setIsLoading(false);
      return addedExpense; // Return the added expense
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(`Failed to add expense: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      throw err; // Re-throw error so the component can handle it (e.g., show alert)
    }
  }, [expenses, recalculateStats]);

  // --- Update Expense ---
  const updateExpense = useCallback(async (expenseData: Expense): Promise<Expense> => {
    if (typeof expenseData.id !== 'number' || expenseData.id <= 0) {
      const err = new Error("Cannot update expense with invalid ID.");
      setError(err.message);
      throw err;
    }
    setIsLoading(true);
    setError(null);
    try {
      await db.expenses.update(expenseData.id, expenseData);
      const updatedExpenses = expenses
        .map(e => (e.id === expenseData.id ? expenseData : e))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(updatedExpenses);
      await recalculateStats(updatedExpenses);
      setIsLoading(false);
      return expenseData; // Return the updated expense
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(`Failed to update expense: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      throw err; // Re-throw error
    }
  }, [expenses, recalculateStats]);

  // --- Delete Expense ---
  const deleteExpense = useCallback(async (id: number): Promise<Expense[]> => {
    setIsLoading(true);
    setError(null);
    try {
      await db.expenses.delete(id);
      const remainingExpenses = expenses.filter(exp => exp.id !== id);
      setExpenses(remainingExpenses);
      await recalculateStats(remainingExpenses);
      setIsLoading(false);
      return remainingExpenses; // Return remaining expenses
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense.');
      setIsLoading(false);
      throw err; // Re-throw error
    }
  }, [expenses, recalculateStats]);

  return {
    expenses,
    stats,
    isLoading,
    error, // Expose error state
    addExpense,
    updateExpense,
    deleteExpense,
    // fetchExpenses is not usually needed externally if the hook handles initial load
  };
}