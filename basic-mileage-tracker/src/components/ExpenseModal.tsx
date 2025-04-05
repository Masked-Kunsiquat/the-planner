// src/components/ExpenseModal.tsx (Refactored with Flowbite Modal)
import React, { useState, useEffect, useCallback } from 'react';
import { Expense } from '../data/db';
import {
    Button,
    Label,
    TextInput,
    Textarea,
    Select,
    Checkbox,
    Spinner,
    Modal, // Import Modal components
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'flowbite-react';

interface ExpenseModalProps {
    // Keep the same props as before
    show: boolean; // Renamed from isModalOpen for clarity with Flowbite's 'show' prop
    onClose: () => void;
    onAddExpense: (expense: Expense | Omit<Expense, 'id'>) => void;
    expenseToEdit?: Expense | undefined;
    isSaving?: boolean;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
    show, // Use the 'show' prop
    onClose,
    onAddExpense,
    expenseToEdit,
    isSaving = false
}) => {
    // --- State Hooks --- (Keep as before)
    const [type, setType] = useState<'gas' | 'maintenance' | 'other'>('gas');
    const [amount, setAmount] = useState(0);
    const [odometer, setOdometer] = useState(0);
    const [gallons, setGallons] = useState(0);
    const [pricePerGallon, setPricePerGallon] = useState(0);
    const [location, setLocation] = useState('');
    const [isFull, setIsFull] = useState(false);
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Initialize date

    // --- Effect to sync state with expenseToEdit ---
    // Use an effect to reset/populate state when expenseToEdit changes or modal opens
    useEffect(() => {
        if (show) {
            setType(expenseToEdit?.type || 'gas');
            setAmount(expenseToEdit?.amount || 0);
            setOdometer(expenseToEdit?.odometer || 0);
            setGallons(expenseToEdit?.gallons || 0);
            setPricePerGallon(expenseToEdit?.pricePerGallon || 0);
            setLocation(expenseToEdit?.location || '');
            setIsFull(expenseToEdit?.isFull || false);
            setNotes(expenseToEdit?.notes || '');
            setDate(expenseToEdit?.date ? expenseToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0]);
        }
        // We don't necessarily need to clear state on close here,
        // as the inputs will just re-populate when shown again.
        // Clear state happens in the parent component (`handleCloseModal`) if needed.

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expenseToEdit, show]); // Rerun when the modal is shown or the editing target changes


    // --- useEffect for Price Per Gallon --- (Keep as before)
    useEffect(() => {
      if (type === 'gas' && gallons > 0 && amount > 0) {
        const calculatedPricePerGallon = amount / gallons;
        setPricePerGallon(Number(calculatedPricePerGallon.toFixed(3)));
      } else if (type !== 'gas') {
        setPricePerGallon(0); // Clear if not gas type
      }
    }, [amount, gallons, type]);

    // --- handleSubmit wrapped in useCallback for stability ---
    const handleSubmit = useCallback((e?: React.FormEvent) => { // Make event optional as it might be called via onClick
        if (e) e.preventDefault(); // Prevent default only if called from form event
        if (isSaving) return;

        const expenseData: Expense | Omit<Expense, 'id'> = {
            ...(expenseToEdit?.id && { id: expenseToEdit.id }), // Include id only if editing
            date: new Date(date).toISOString(),
            type,
            amount: parseFloat(amount.toString()) || 0,
            odometer: parseInt(odometer.toString(), 10) || 0,
            notes,
            ...(type === 'gas' ? {
                gallons: parseFloat(gallons.toString()) > 0 ? parseFloat(gallons.toString()) : undefined,
                pricePerGallon: parseFloat(pricePerGallon.toString()) > 0 ? parseFloat(pricePerGallon.toString()) : undefined,
                location: location || undefined,
                isFull
            } : {}),
        };
        onAddExpense(expenseData);
     // Add dependencies for useCallback
    }, [isSaving, expenseToEdit, date, type, amount, odometer, notes, gallons, pricePerGallon, location, isFull, onAddExpense]);


    // --- Render Logic using Flowbite Modal ---
    return (
        // Use Flowbite Modal component
        <Modal show={show} size="md" onClose={onClose} dismissible>
            {/* Modal Header */}
            <ModalHeader>
                {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
            </ModalHeader>

            {/* Modal Body - Contains the Form */}
            <ModalBody>
                {/* We can place the form tag here, but buttons in footer won't trigger submit automatically */}
                {/* Option 1: Form inside ModalBody */}
                 <form id="expense-form" onSubmit={handleSubmit} className="space-y-4"> {/* Add ID to form */}
                    {/* --- Date Input --- */}
                    <div>
                        <div className="mb-2 block">
                             <Label htmlFor="date">Date</Label>
                        </div>
                        <TextInput id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required disabled={isSaving} />
                    </div>
                    {/* --- Expense Type --- */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="expenseType">Expense Type</Label>
                        </div>
                        <Select id="expenseType" value={type} onChange={(e) => setType(e.target.value as 'gas' | 'maintenance' | 'other')} required disabled={isSaving}>
                            <option value="gas">Gas</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="other">Other</option>
                        </Select>
                    </div>
                    {/* --- Amount --- */}
                     <div>
                         <div className="mb-2 block">
                           <Label htmlFor="amount">Amount ($)</Label>
                         </div>
                         <TextInput id="amount" type="number" step="0.01" min="0" value={amount.toString()} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} required disabled={isSaving} />
                       </div>
                     {/* --- Odometer --- */}
                     <div>
                       <div className="mb-2 block">
                         <Label htmlFor="odometer">Odometer Reading</Label>
                       </div>
                       <TextInput id="odometer" type="number" min="0" value={odometer.toString()} onChange={(e) => setOdometer(parseInt(e.target.value, 10) || 0)} required disabled={isSaving} />
                     </div>
                    {/* --- Gas Specific Fields --- */}
                    {type === 'gas' && (
                        <>
                            {/* Gallons */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="gallons">Gallons</Label>
                                </div>
                                <TextInput id="gallons" type="number" step="0.001" min="0" value={gallons.toString()} onChange={(e) => setGallons(parseFloat(e.target.value) || 0)} required={type === 'gas'} disabled={isSaving} />
                            </div>
                            {/* Location */}
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="location">Location (Optional)</Label>
                                </div>
                                <TextInput id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} disabled={isSaving} />
                            </div>
                             {/* Full Tank Checkbox */}
                             <div className="flex items-center gap-2">
                                <Checkbox id="isFull" checked={isFull} onChange={() => setIsFull(!isFull)} disabled={isSaving} />
                                <Label htmlFor="isFull">Full Tank</Label>
                              </div>
                             {/* Calculated Price Per Gallon */}
                             {gallons > 0 && amount > 0 && ( <div className="text-sm text-gray-600 dark:text-gray-400 mt-1"> Calculated Price per gallon: ${pricePerGallon.toFixed(3)} </div> )}
                        </>
                    )}
                    {/* --- Notes --- */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                        </div>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} disabled={isSaving} />
                    </div>
                </form> {/* End of form */}
            </ModalBody>

            {/* Modal Footer - Contains Action Buttons */}
            <ModalFooter>
                {/* Cancel Button */}
                <Button color="gray" onClick={onClose} disabled={isSaving}>
                    Cancel
                </Button>
                {/* Submit Button */}
                 <Button
                    color="blue"
                    // Option 1: Trigger the form's submit handler via form ID
                    form="expense-form" // Associate button with the form
                    type="submit"      // Use standard form submission trigger
                    disabled={isSaving}
                >
                   {/* Conditional rendering for loading state */}
                    {isSaving ? (
                        <>
                            <Spinner aria-label="Saving" size="sm" />
                            <span className="pl-3">Saving...</span>
                        </>
                    ) : (
                        expenseToEdit ? 'Update Expense' : 'Add Expense'
                    )}
                 </Button>
                 {/* Option 2: Trigger submit via onClick (If Option 1 doesn't work well) */}
                 {/* <Button color="blue" onClick={handleSubmit} disabled={isSaving}> ... </Button> */}
            </ModalFooter>
        </Modal> // End of Flowbite Modal
    );
};

export default ExpenseModal;