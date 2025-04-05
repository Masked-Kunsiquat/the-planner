import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, Expense } from '../data/db';
import { VehicleAnalyticsService } from '../services/VehicleAnalyticsService';
import ExpenseModal from '../components/ExpenseModal';
import FuelPriceChart from '../components/FuelPriceChart';
import { Button, Card, Badge } from 'flowbite-react';
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
} from 'react-icons/hi';

// Reusable stat card
const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card>
    <div className="flex flex-col text-center">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  </Card>
);

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
        allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(allExpenses);

        const gasExpenses = allExpenses.filter(e => e.type === 'gas');
        const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalGallons = gasExpenses.reduce((sum, e) => sum + (e.gallons || 0), 0);
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
        await db.expenses.update(expense.id, expense);
        setExpenses(expenses.map(e => (e.id === expense.id ? expense : e)));
      } else {
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
        setExpenses(expenses.filter(exp => exp.id !== id));
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Expenses</h1>
        <Button as={Link} to="/" color="gray">
          <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
      </div>

      {/* Stat Cards + Fuel Chart */}
      <div className="w-full max-w-6xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          <StatCard title="TOTAL SPENT" value={`$${stats.totalSpent.toFixed(2)}`} />
          <StatCard title="TOTAL GALLONS" value={stats.totalGallons.toFixed(2)} />
          <StatCard title="AVG MPG" value={stats.avgMpg > 0 ? stats.avgMpg.toFixed(1) : 'N/A'} />
          <StatCard title="BEST MPG" value={stats.bestMpg > 0 ? stats.bestMpg.toFixed(1) : 'N/A'} />
          <StatCard title="WORST MPG" value={stats.worstMpg > 0 ? stats.worstMpg.toFixed(1) : 'N/A'} />
          <StatCard title="FULL TANK FILLUPS" value={stats.totalFullTankFillups} />
        </div>

        <div className="w-full max-w-4xl mx-auto mb-10">
          <Card>
            <FuelPriceChart />
          </Card>
        </div>
      </div>

      {/* Expense Table */}
      <Card>
        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Date', 'Type', 'Amount', 'Odometer', 'Details', 'Actions'].map(h => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                        h === 'Actions' ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getExpenseTypeLabel(exp.type)}
                      {exp.type === 'gas' && exp.isFull && (
                        <Badge color="warning" className="ml-2">
                          Full Tank
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      ${exp.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {exp.odometer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {exp.type === 'gas' && exp.gallons
                        ? `${exp.gallons.toFixed(3)} gal @ $${(exp.amount / exp.gallons).toFixed(3)}/gal`
                        : exp.notes}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => handleEditExpense(exp)} size="xs" color="info">
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteExpense(exp.id!)} size="xs" color="failure">
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
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
            </svg>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No expenses recorded yet</p>
            <Button onClick={() => {
              setCurrentExpense(undefined);
              setIsModalOpen(true);
            }} color="blue">
              <HiOutlinePlus className="mr-2 h-5 w-5" />
              Add Your First Expense
            </Button>
          </div>
        )}
      </Card>

      {/* Floating Add Button */}
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

      {/* Modal */}
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
