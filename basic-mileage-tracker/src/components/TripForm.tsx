import React, { useState } from 'react';

interface Trip {
  date: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  purpose: string;
  notes: string;
}

interface TripFormProps {
  onAddTrip: (trip: Trip) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onAddTrip }) => {
  const [startOdometer, setStartOdometer] = useState(0);
  const [endOdometer, setEndOdometer] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distance = endOdometer - startOdometer;
    const trip: Trip = {
      date: new Date().toISOString(),
      startOdometer,
      endOdometer,
      distance,
      purpose,
      notes,
    };
    onAddTrip(trip);
    setStartOdometer(0);
    setEndOdometer(0);
    setPurpose('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="startOdometer" className="block text-gray-700 font-bold mb-2">
          Start Odometer
        </label>
        <input
          type="number"
          id="startOdometer"
          value={startOdometer}
          onChange={(e) => setStartOdometer(parseInt(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endOdometer" className="block text-gray-700 font-bold mb-2">
          End Odometer
        </label>
        <input
          type="number"
          id="endOdometer"
          value={endOdometer}
          onChange={(e) => setEndOdometer(parseInt(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="purpose" className="block text-gray-700 font-bold mb-2">
          Purpose
        </label>
        <input
          type="text"
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="notes" className="block text-gray-700 font-bold mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Trip
        </button>
      </div>
    </form>
  );
};

export default TripForm;