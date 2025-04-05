// ExpensesPage.tsx (Refactored - April 5, 2025)
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Expense } from '../data/db'; // Keep Expense type import
import { useExpenses } from '../hooks/useExpenses'; // Import the hook
import StatCard from '../components/StatCard'; // Import extracted component
import ExpenseModal from '../components/ExpenseModal';
import FuelPriceChart from '../components/FuelPriceChart';
import ExpenseTable from '../components/ExpenseTable';
import { Button, Card, Pagination, Spinner } from 'flowbite-react'; // Added Spinner
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineCash,
  HiOutlineCalculator,
  HiOutlineChartPie,
  HiOutlineFire,
  HiOutlineBan,
} from 'react-icons/hi';
import { MdOutlineLocalGasStation } from 'react-icons/md';

const ITEMS_PER_PAGE = 10;

const ExpensesPage: React.FC = () => {
  // --- Use the custom hook for data logic ---
  const {
    expenses,
    stats,
    isLoading: isLoadingData, // Rename to avoid conflict if needed elsewhere
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  // --- State specific to this component (Modal, Pagination) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false); // Separate loading state for save/delete actions

  // --- Pagination Logic ---
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedExpenses = useMemo(() => {
    // Reset to page 1 if filters/data change results in fewer pages
     if (totalItems > 0 && currentPage > totalPages) {
       setCurrentPage(totalPages); // Or setCurrentPage(1) if preferred
     } else if (totalItems === 0) {
       setCurrentPage(1);
     }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    return expenses.slice(startIndex, endIndex);
  }, [expenses, currentPage, totalPages]); // Added totalPages dependency

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // --- Modal and Action Handlers ---
  const handleOpenAddModal = () => {
    setCurrentExpense(undefined);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentExpense(undefined);
  }, []);

  const handleSaveExpense = async (expenseData: Expense | Omit<Expense, 'id'>) => {
    setIsSaving(true);
    try {
      if ('id' in expenseData) {
        await updateExpense(expenseData as Expense);
      } else {
        await addExpense(expenseData as Omit<Expense, 'id'>);
      }
      handleCloseModal();
    } catch (err) {
        console.error('Failed to save expense:', err);
        // Show user feedback (e.g., alert or toast notification)
        alert(`Error saving expense: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setIsSaving(true); // Use isSaving for delete operation as well
      try {
        await deleteExpense(id);
        // Pagination adjustment is implicitly handled by useMemo recalculating paginatedExpenses
        // If the last item on the last page is deleted, useMemo's effect dependency `totalPages` will trigger adjustment
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert(`Error deleting expense: ${err instanceof Error ? err.message : 'Please try again.'}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // --- Loading & Empty State Components ---
  const LoadingIndicator: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-center items-center py-12 space-x-2 text-lg text-gray-500 dark:text-gray-400">
        <Spinner size="md" />
        <span>{text}</span>
    </div>
  );

  const EmptyState: React.FC = () => (
     <div className="flex flex-col items-center justify-center py-12">
       <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm-.375 5.25h.008v.008H3.75v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18V3H3z" />
       </svg>
       <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No expenses recorded yet</p>
       <Button onClick={handleOpenAddModal} color="blue">
         <HiOutlinePlus className="mr-2 h-5 w-5" />
         Add Your First Expense
       </Button>
     </div>
   );


  // --- RENDER LOGIC ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Expenses</h1>
        <Button as={Link} to="/" color="gray">
          <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
      </div>

      {/* Display Hook Error */}
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
          </div>
      )}

      {/* --- Stat Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={HiOutlineCash}
          title="TOTAL SPENT"
          value={isLoadingData ? '...' : `$${stats.totalSpent.toFixed(2)}`}
        />
        <StatCard
          icon={MdOutlineLocalGasStation}
          title="TOTAL GALLONS"
          value={isLoadingData ? '...' : stats.totalGallons.toFixed(2)}
        />
        <StatCard
          icon={HiOutlineCalculator}
          title="AVG MPG"
          value={isLoadingData ? '...' : (stats.avgMpg > 0 ? stats.avgMpg.toFixed(1) : 'N/A')}
        />
        <StatCard
          icon={HiOutlineChartPie}
          title="BEST MPG"
          value={isLoadingData ? '...' : (stats.bestMpg > 0 ? stats.bestMpg.toFixed(1) : 'N/A')}
        />
        <StatCard
          icon={HiOutlineBan}
          title="WORST MPG"
          value={isLoadingData ? '...' : (stats.worstMpg > 0 ? stats.worstMpg.toFixed(1) : 'N/A')}
        />
        <StatCard
          icon={HiOutlineFire}
          title="FULL FILLUPS"
          value={isLoadingData ? '...' : stats.totalFullTankFillups}
        />
      </div>

      {/* --- Fuel Chart --- */}
      <div className="w-full max-w-4xl mx-auto mb-10">
        <Card>
          {isLoadingData && <LoadingIndicator text="Loading chart data..." /> }
          {!isLoadingData && expenses.length === 0 && (
               <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                   No fuel data for chart.
               </div>
          )}
          {!isLoadingData && expenses.length > 0 && (
             <FuelPriceChart /* Pass necessary props if FuelPriceChart needs specific data */ />
          )}
        </Card>
      </div>

      {/* --- Expense Table Card --- */}
      <Card>
        {isLoadingData ? (
           <LoadingIndicator text="Loading expenses..." />
        ) : totalItems > 0 ? (
          <>
            {isSaving && <LoadingIndicator text="Saving changes..." /> } {/* Show saving indicator */}
            <div className={isSaving ? 'opacity-50 pointer-events-none' : ''}> {/* Optionally dim table during save */}
                <ExpenseTable
                  expenses={paginatedExpenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center text-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState /> // Use the EmptyState component
        )}
      </Card>

      {/* Floating Add Button */}
      {!isLoadingData && totalItems > 0 && (
        <div className="fixed bottom-8 right-8 z-20">
           <Button
            onClick={handleOpenAddModal}
            color="blue"
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            disabled={isSaving} // Disable while saving
          >
            <HiOutlinePlus className="h-6 w-6" />
            <span className="sr-only">Add Expense</span>
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ExpenseModal
          show={isModalOpen}
          onClose={handleCloseModal}
          onAddExpense={handleSaveExpense} // Changed prop name for clarity
          expenseToEdit={currentExpense}
          isSaving={isSaving} // Pass saving state to modal if needed (e.g., disable form)
        />
      )}
    </div>
  );
};

export default ExpensesPage;