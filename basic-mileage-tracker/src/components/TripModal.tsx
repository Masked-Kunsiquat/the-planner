import React, { useState, useEffect } from 'react';
import { Trip, db } from '../data/db';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';

interface TripModalProps {
  onClose: () => void;
  onAddTrip: (trip: Trip) => void;
  tripToEdit?: Trip;
}

const TripModal: React.FC<TripModalProps> = ({ onClose, onAddTrip, tripToEdit }) => {
  const [startOdometer, setStartOdometer] = useState(tripToEdit?.startOdometer || 0);
  const [endOdometer, setEndOdometer] = useState(tripToEdit?.endOdometer || 0);
  const [purpose, setPurpose] = useState(tripToEdit?.purpose || '');
  const [notes, setNotes] = useState(tripToEdit?.notes || '');
  const [distance, setDistance] = useState(tripToEdit?.distance || 0);

  useEffect(() => {
    // Fetch the most recent trip to pre-fill start odometer when creating a new trip
    if (!tripToEdit) {
      const fetchLastTrip = async () => {
        try {
          const lastTrip = await db.trips
            .orderBy('date')
            .last();
          
          if (lastTrip) {
            setStartOdometer(lastTrip.endOdometer);
          }
        } catch (error) {
          console.error('Error fetching last trip:', error);
        }
      };

      fetchLastTrip();
    }
  }, [tripToEdit]);

  // Calculate distance when odometer values change
  useEffect(() => {
    const calculatedDistance = Math.max(0, endOdometer - startOdometer);
    setDistance(calculatedDistance);
  }, [startOdometer, endOdometer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trip: Trip = {
      id: tripToEdit?.id,
      date: tripToEdit?.date || new Date().toISOString(),
      startOdometer,
      endOdometer,
      distance,
      purpose,
      notes,
    };
    onAddTrip(trip);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {tripToEdit ? 'Edit Trip' : 'Add New Trip'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="startOdometer">Start Odometer</Label>
            </div>
            <TextInput
              id="startOdometer"
              type="number"
              value={startOdometer.toString()}
              onChange={(e) => setStartOdometer(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="endOdometer">End Odometer</Label>
            </div>
            <TextInput
              id="endOdometer"
              type="number"
              value={endOdometer.toString()}
              onChange={(e) => setEndOdometer(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label>Distance (calculated)</Label>
            </div>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {distance.toFixed(1)} miles
            </div>
          </div>
          
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
            />
          </div>
          
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
              {tripToEdit ? 'Update Trip' : 'Add Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;