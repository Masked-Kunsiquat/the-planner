import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, Expense } from '../data/db';
import { VehicleAnalyticsService } from '../services/VehicleAnalyticsService';
import ExpenseModal from '../components/ExpenseModal';
import { Button, Card, Badge } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(undefined);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalGallons: 0,
    avgMpg: 0,
    bestMpg: 0,
    worstMpg: 0,
    totalFullTankFillups: 0,
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const allExpenses = await db.expenses.toArray();
        // Sort by date (newest first)
        allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(allExpenses);
        
        // Calculate general expense stats
        const gasExpenses = allExpenses.filter(e => e.type === 'gas');
        const totalSpent = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalGallons = gasExpenses.reduce((sum, expense) => sum + (expense.gallons || 0), 0);
        
        // Use VehicleAnalyticsService for MPG calculations
        const mpgReport = await VehicleAnalyticsService.calculateDetailedMPG();
        
        setStats({
          totalSpent,
          totalGallons,
          avgMpg: mpgReport.averageMPG,
          bestMpg: mpgReport.bestMPG,
          worstMpg: mpgReport.worstMPG,
          totalFullTankFillups: mpgReport.totalFullTankFillups,
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
        return <Badge color="success">Gas</Badge>;
      case 'maintenance':
        return <Badge color="info">Maintenance</Badge>;
      default:
        return <Badge color="gray">Other</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Expenses</h1>
        <div className="flex space-x-2">
          <Button as={Link} to="/" color="gray">
            <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">TOTAL SPENT</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</div>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">TOTAL GALLONS</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalGallons.toFixed(2)}</div>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">AVG MPG</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.avgMpg > 0 ? stats.avgMpg.toFixed(1) : 'N/A'}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">BEST MPG</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.bestMpg > 0 ? stats.bestMpg.toFixed(1) : 'N/A'}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">WORST MPG</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.worstMpg > 0 ? stats.worstMpg.toFixed(1) : 'N/A'}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">FULL TANK FILLUPS</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalFullTankFillups}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getExpenseTypeLabel(expense.type)}
                      {expense.type === 'gas' && expense.isFull && (
                        <Badge color="warning" className="ml-2">Full Tank</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
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
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEditExpense(expense)}
                          size="xs"
                          color="info"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteExpense(expense.id!)}
                          size="xs"
                          color="failure"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
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
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No expenses recorded yet</p>
            <Button
              onClick={() => {
                setCurrentExpense(undefined);
                setIsModalOpen(true);
              }}
              color="blue"
            >
              <HiOutlinePlus className="mr-2 h-5 w-5" />
              Add Your First Expense
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Add Button (Fixed) */}
      {expenses.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={() => {
              setCurrentExpense(undefined);
              setIsModalOpen(true);
            }}
            color="blue"
            className="rounded-full w-14 h-14 flex items-center justify-center"
          >
            <HiOutlinePlus className="h-6 w-6" />
          </Button>
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