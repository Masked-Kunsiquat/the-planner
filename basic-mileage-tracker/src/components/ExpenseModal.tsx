import React, { useState, useEffect } from 'react';
import { Expense } from '../data/db';
import { Button, Label, TextInput, Textarea, Select, Checkbox } from 'flowbite-react';

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
  const [pricePerGallon, setPricePerGallon] = useState(expenseToEdit?.pricePerGallon || 0);
  const [location, setLocation] = useState(expenseToEdit?.location || '');
  const [isFull, setIsFull] = useState(expenseToEdit?.isFull || false);
  const [notes, setNotes] = useState(expenseToEdit?.notes || '');
  const [date, setDate] = useState(expenseToEdit?.date ? expenseToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0]);

  // Automatically calculate price per gallon when amount or gallons change
  useEffect(() => {
    if (type === 'gas' && gallons > 0 && amount > 0) {
      const calculatedPricePerGallon = amount / gallons;
      setPricePerGallon(Number(calculatedPricePerGallon.toFixed(3)));
    }
  }, [amount, gallons, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: expenseToEdit?.id,
      date: new Date(date).toISOString(),
      type,
      amount,
      odometer,
      // Only include gas-specific fields for gas expenses
      ...(type === 'gas' ? { 
        gallons: gallons > 0 ? gallons : undefined,
        pricePerGallon: pricePerGallon > 0 ? pricePerGallon : undefined,
        location,
        isFull 
      } : {}),
      notes,
    };
    onAddExpense(expense);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
  <div className="mb-2 block">
    <Label htmlFor="date">Date</Label>
  </div>
  <TextInput
    id="date"
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    required
  />
</div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="expenseType">Expense Type</Label>
            </div>
            <Select 
              id="expenseType" 
              value={type}
              onChange={(e) => setType(e.target.value as 'gas' | 'maintenance' | 'other')}
              required
            >
              <option value="gas">Gas</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </Select>
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="amount">Amount ($)</Label>
            </div>
            <TextInput
              id="amount"
              type="number"
              step="0.01"
              value={amount.toString()}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="odometer">Odometer Reading</Label>
            </div>
            <TextInput
              id="odometer"
              type="number"
              value={odometer.toString()}
              onChange={(e) => setOdometer(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          {type === 'gas' && (
            <>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="gallons">Gallons</Label>
                </div>
                <TextInput
                  id="gallons"
                  type="number"
                  step="0.001"
                  value={gallons.toString()}
                  onChange={(e) => setGallons(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="location">Location (Optional)</Label>
                </div>
                <TextInput
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFull"
                  checked={isFull}
                  onChange={() => setIsFull(!isFull)}
                />
                <Label htmlFor="isFull">Full Tank</Label>
              </div>
              
              {gallons > 0 && amount > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Price per gallon: ${pricePerGallon.toFixed(3)}
                </div>
              )}
            </>
          )}
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="notes">Notes</Label>
            </div>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSubmit}>
              {expenseToEdit ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;