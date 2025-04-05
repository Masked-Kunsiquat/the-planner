import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, Expense } from '../data/db';
import ExpenseModal from '../components/ExpenseModal';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(undefined);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalGallons: 0,
    avgMpg: 0,
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await db.expenses.toArray();
        // Sort by date (newest first)
        allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(allExpenses);
        
        // Calculate stats
        const gasExpenses = allExpenses.filter(e => e.type === 'gas');
        const totalSpent = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalGallons = gasExpenses.reduce((sum, expense) => sum + (expense.gallons || 0), 0);
        
        // Calculate MPG (requires odometer data from consecutive fill-ups)
        let avgMpg = 0;
        if (gasExpenses.length >= 2) {
          // Sort by odometer for MPG calculation
          const sortedByOdometer = [...gasExpenses].sort((a, b) => a.odometer - b.odometer);
          let totalMiles = 0;
          let totalGallonsForMpg = 0;
          
          for (let i = 1; i < sortedByOdometer.length; i++) {
            const miles = sortedByOdometer[i].odometer - sortedByOdometer[i - 1].odometer;
            const gallons = sortedByOdometer[i].gallons || 0;
            
            if (miles > 0 && gallons > 0) {
              totalMiles += miles;
              totalGallonsForMpg += gallons;
            }
          }
          
          if (totalGallonsForMpg > 0) {
            avgMpg = totalMiles / totalGallonsForMpg;
          }
        }
        
        setStats({
          totalSpent,
          totalGallons,
          avgMpg,
        });
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expense: Expense) => {
    try {
      if (expense.id) {
        // Editing existing expense
        await db.expenses.update(expense.id, expense);
        setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
      } else {
        // Adding new expense
        const id = await db.expenses.add(expense);
        setExpenses([{ ...expense, id }, ...expenses]);
      }
      setIsModalOpen(false);
      setCurrentExpense(undefined);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await db.expenses.delete(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'gas':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Gas
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            Maintenance
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            Other
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Vehicle Expenses</h1>
        <div className="flex space-x-2">
          <Link to="/" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">TOTAL SPENT</h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">TOTAL GALLONS</h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalGallons.toFixed(2)}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">AVG MPG</h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.avgMpg > 0 ? stats.avgMpg.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Odometer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getExpenseTypeLabel(expense.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {expense.odometer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {expense.type === 'gas' && expense.gallons ? (
                        <span>
                          {expense.gallons.toFixed(3)} gal @ ${(expense.amount / expense.gallons).toFixed(3)}/gal
                        </span>
                      ) : (
                        <span>{expense.notes}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id!)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
            <button
              onClick={() => {
                setCurrentExpense(undefined);
                setIsModalOpen(true);
              }}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Button (Fixed) */}
      {expenses.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => {
              setCurrentExpense(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Expense Modal */}
      {isModalOpen && (
        <ExpenseModal
          onClose={() => {
            setIsModalOpen(false);
            setCurrentExpense(undefined);
          }}
          onAddExpense={handleAddExpense}
          expenseToEdit={currentExpense}
        />
      )}
    </div>
  );
};

export default ExpensesPage;