import React, { useState, useEffect, useCallback } from 'react';
import { Trip, db } from '../data/db';
import {
    Button,
    Label,
    TextInput,
    Textarea,
    Modal, // Import Modal components
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'flowbite-react';

interface TripModalProps {
    show: boolean; // Use 'show' prop for visibility control
    onClose: () => void;
    onAddTrip: (trip: Trip | Omit<Trip, 'id'>) => void; // Allow adding without ID
    tripToEdit?: Trip;
}

const TripModal: React.FC<TripModalProps> = ({ show, onClose, onAddTrip, tripToEdit }) => {
    // --- State Hooks ---
    const [startOdometer, setStartOdometer] = useState(0);
    const [endOdometer, setEndOdometer] = useState(0);
    const [purpose, setPurpose] = useState('');
    const [notes, setNotes] = useState('');
    const [distance, setDistance] = useState(0);
    const [isLoadingLastOdometer, setIsLoadingLastOdometer] = useState(false); // State for loading indicator

    // --- Effect to Sync State & Fetch Last Odometer ---
    useEffect(() => {
        if (show) {
            if (tripToEdit) {
                // Populate state from tripToEdit
                setStartOdometer(tripToEdit.startOdometer);
                setEndOdometer(tripToEdit.endOdometer);
                setPurpose(tripToEdit.purpose);
                setNotes(tripToEdit.notes || '');
                setDistance(tripToEdit.distance); // Distance is already calculated in tripToEdit
                setIsLoadingLastOdometer(false); // Not loading if editing
            } else {
                // Reset state for adding a new trip
                setEndOdometer(0);
                setPurpose('');
                setNotes('');
                setDistance(0);

                // Fetch the most recent trip's end odometer for the new start odometer
                const fetchLastTrip = async () => {
                    setIsLoadingLastOdometer(true);
                    try {
                        // Simulate loading for demo if needed: await new Promise(resolve => setTimeout(resolve, 1000));
                        const lastTrip = await db.trips.orderBy('date').last();
                        setStartOdometer(lastTrip?.endOdometer || 0); // Default to 0 if no last trip
                    } catch (error) {
                        console.error('Error fetching last trip:', error);
                        setStartOdometer(0); // Default to 0 on error
                    } finally {
                       setIsLoadingLastOdometer(false);
                    }
                };
                fetchLastTrip();
            }
        }
        // No cleanup needed on hide, parent handles clearing tripToEdit if necessary
    }, [show, tripToEdit]); // Rerun when modal shown or edit target changes

    // --- Effect to Calculate Distance ---
    useEffect(() => {
        // Only calculate if not editing (use pre-calculated distance when editing)
        // or if editing and the user modifies odometer values
        if (startOdometer >= 0 && endOdometer > 0) {
            const calculatedDistance = Math.max(0, endOdometer - startOdometer);
            // Round to one decimal place, or adjust as needed
            setDistance(Number(calculatedDistance.toFixed(1)));
        } else {
             setDistance(0); // Reset if inputs are invalid/zero
        }
    }, [startOdometer, endOdometer]);

    // --- Submit Handler ---
    const handleSubmit = useCallback((e?: React.FormEvent) => {
        if(e) e.preventDefault();

        // Basic validation
        if (endOdometer <= startOdometer) {
             alert("End odometer must be greater than start odometer.");
             return;
        }
         if (!purpose.trim()) { // Check trimmed purpose
             alert("Please enter a purpose for the trip.");
             return;
         }


        const tripData: Trip | Omit<Trip, 'id'> = {
            ...(tripToEdit?.id && { id: tripToEdit.id }), // Conditionally add ID if editing
            date: tripToEdit?.date || new Date().toISOString(), // Use existing date if editing
            startOdometer,
            endOdometer,
            distance, // Use calculated distance state
            purpose: purpose.trim(), // Trim purpose before saving
            notes: notes.trim(), // Trim notes before saving
        };
        onAddTrip(tripData);
    }, [tripToEdit, startOdometer, endOdometer, distance, purpose, notes, onAddTrip]); // Add dependencies


    // --- Render Logic using Flowbite Modal ---
    return (
        <Modal show={show} size="md" onClose={onClose} dismissible>
            <ModalHeader>
                {tripToEdit ? 'Edit Trip' : 'Add New Trip'}
            </ModalHeader>

            <ModalBody>
                <form id="trip-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Start Odometer */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="startOdometer">Start Odometer</Label>
                        </div>
                        <TextInput
                            id="startOdometer"
                            type="number"
                            value={startOdometer.toString()}
                            onChange={(e) => setStartOdometer(parseInt(e.target.value, 10) || 0)}
                            required
                            min="0"
                            // REMOVED isProcessing prop
                            disabled={isLoadingLastOdometer && !tripToEdit} // Disable input while loading last odometer
                        />
                         {isLoadingLastOdometer && !tripToEdit && (
                             <p className="text-xs text-gray-500 mt-1">Loading last odometer reading...</p>
                         )}
                    </div>

                    {/* End Odometer */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="endOdometer">End Odometer</Label>
                        </div>
                        <TextInput
                            id="endOdometer"
                            type="number"
                            value={endOdometer.toString()}
                            onChange={(e) => setEndOdometer(parseInt(e.target.value, 10) || 0)}
                            required
                            // Ensure end > start dynamically based on startOdometer state
                            min={startOdometer >= 0 ? startOdometer + 1 : 1}
                        />
                        {/* Show validation message only if end odometer is entered and invalid */}
                        {endOdometer > 0 && endOdometer <= startOdometer && (
                             <p className="text-xs text-red-500 mt-1">End odometer must be greater than start.</p>
                         )}
                    </div>

                    {/* Distance Display */}
                    <div>
                        <div className="mb-2 block">
                            <Label>Distance (calculated)</Label>
                        </div>
                        {/* Use a TextInput styled as readonly for better consistency/accessibility */}
                        <TextInput
                           id="distanceDisplay"
                           type="text"
                           value={`${(typeof distance === 'number' && !isNaN(distance)) ? distance.toFixed(1) : '0.0'} miles`}
                           readOnly
                           // Add appropriate styling for readonly state if needed via className or theme
                           className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    {/* Purpose */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="purpose">Purpose</Label>
                        </div>
                        <TextInput
                            id="purpose"
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                            maxLength={100} // Optional: Add max length
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                        </div>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color="gray" onClick={onClose}>
                    Cancel
                </Button>
                 <Button
                    color="blue"
                    form="trip-form" // Link to form in ModalBody
                    type="submit"
                    // Currently no isSaving state passed from Dashboard
                >
                    {tripToEdit ? 'Update Trip' : 'Add Trip'}
                 </Button>
            </ModalFooter>
        </Modal>
    );
};

export default TripModal;