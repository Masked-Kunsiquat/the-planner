import React from 'react';

interface Trip {
  date: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  purpose: string;
  notes: string;
}

interface TripListProps {
  trips: Trip[];
  onDeleteTrip: (index: number) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onDeleteTrip }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Trip List</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Distance</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Notes</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{new Date(trip.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{trip.distance.toFixed(1)} miles</td>
              <td className="border px-4 py-2">{trip.purpose}</td>
              <td className="border px-4 py-2">{trip.notes}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onDeleteTrip(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripList;