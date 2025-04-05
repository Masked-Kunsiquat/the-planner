import React, { useState } from 'react';
import { Expense } from '../data/db';

interface ExpenseModalProps {
  onClose: () => void;
  onAddExpense: (expense: Expense) => void;
  expenseToEdit?: Expense;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ onClose, onAddExpense, expenseToEdit }) => {
  const [type, setType] = useState<'gas' | 'maintenance' | 'other'>(expenseToEdit?.type || 'gas');
  const [amount, setAmount] = useState(expenseToEdit?.amount || 0);
  const [odometer, setOdometer] = useState(expenseToEdit?.odometer || 0);
  const [gallons, setGallons] = useState(expenseToEdit?.gallons || 0);
  const [notes, setNotes] = useState(expenseToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: expenseToEdit?.id,
      date: expenseToEdit?.date || new Date().toISOString(),
      type,
      amount,
      odometer,
      gallons: type === 'gas' ? gallons : undefined,
      notes,
    };
    onAddExpense(expense);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Expense Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType('gas')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  type === 'gas'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                Gas
              </button>
              <button
                type="button"
                onClick={() => setType('maintenance')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  type === 'maintenance'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                Maintenance
              </button>
              <button
                type="button"
                onClick={() => setType('other')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  type === 'other'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                Other
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="odometer" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Odometer Reading
            </label>
            <input
              type="number"
              id="odometer"
              value={odometer}
              onChange={(e) => setOdometer(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {type === 'gas' && (
            <div className="mb-4">
              <label htmlFor="gallons" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Gallons
              </label>
              <input
                type="number"
                id="gallons"
                step="0.001"
                value={gallons}
                onChange={(e) => setGallons(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              
              {gallons > 0 && amount > 0 && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Price per gallon: ${(amount / gallons).toFixed(3)}
                </div>
              )}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;