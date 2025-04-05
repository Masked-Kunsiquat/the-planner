import React from 'react';
import { Expense } from '../data/db'; // Assuming db types are accessible here
import { Button, Badge } from 'flowbite-react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

// Helper function to get badge based on type (kept within this component)
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

// Define the props the table component will accept
interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  return (
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
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                {new Date(exp.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center space-x-2">
                   {getExpenseTypeLabel(exp.type)}
                   {exp.type === 'gas' && exp.isFull && (
                     <Badge color="warning">
                       Full Tank
                     </Badge>
                   )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                ${exp.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {exp.odometer ?? 'N/A'} {/* Handle potential null odometer */}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate"> {/* Limit details width */}
                {exp.type === 'gas' && exp.gallons && exp.gallons > 0
                  ? `${exp.gallons.toFixed(3)} gal @ $${(exp.amount / exp.gallons).toFixed(3)}/gal`
                  : exp.notes || 'No details'} {/* Show fallback text */}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  {/* Use the passed-in prop functions */}
                  <Button onClick={() => onEdit(exp)} size="xs" color="info">
                    <HiOutlinePencil className="h-4 w-4" />
                  </Button>
                  {/* Ensure exp.id is not null before calling onDelete */}
                  <Button onClick={() => exp.id && onDelete(exp.id)} size="xs" color="failure" disabled={!exp.id}>
                    <HiOutlineTrash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;