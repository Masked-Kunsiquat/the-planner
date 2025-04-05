import React, { useState, useEffect } from 'react';
import { Trip } from '../data/db';

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

  // Calculate distance when odometer values change
  useEffect(() => {
    setDistance(endOdometer - startOdometer);
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
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{tripToEdit ? 'Edit Trip' : 'Add New Trip'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startOdometer" className="block text-gray-700 font-medium mb-2">
              Start Odometer
            </label>
            <input
              type="number"
              id="startOdometer"
              value={startOdometer}
              onChange={(e) => setStartOdometer(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="endOdometer" className="block text-gray-700 font-medium mb-2">
              End Odometer
            </label>
            <input
              type="number"
              id="endOdometer"
              value={endOdometer}
              onChange={(e) => setEndOdometer(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Distance (calculated)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {distance.toFixed(1)} miles
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="purpose" className="block text-gray-700 font-medium mb-2">
              Purpose
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {tripToEdit ? 'Update Trip' : 'Add Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;