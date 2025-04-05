import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, Trip } from '../data/db';
import TripModal from '../components/TripModal';

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const allTrips = await db.trips.toArray();
      // Sort by date (newest first)
      allTrips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTrips(allTrips);
    };
    fetchTrips();
  }, []);

  const handleAddTrip = async (trip: Trip) => {
    if (trip.id) {
      // Editing existing trip
      await db.trips.update(trip.id, trip);
      setTrips(trips.map(t => t.id === trip.id ? trip : t));
    } else {
      // Adding new trip
      const id = await db.trips.add(trip);
      setTrips([{ ...trip, id }, ...trips]);
    }
    setIsModalOpen(false);
    setCurrentTrip(undefined);
  };

  const handleDeleteTrip = async (id: number) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      await db.trips.delete(id);
      setTrips(trips.filter(trip => trip.id !== id));
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsModalOpen(true);
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Prepare CSV content
      const headers = ['Date', 'Start Odometer', 'End Odometer', 'Distance', 'Purpose', 'Notes'];
      const data = trips.map(trip => [
        new Date(trip.date).toLocaleDateString(),
        trip.startOdometer,
        trip.endOdometer,
        trip.distance,
        trip.purpose,
        trip.notes
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.map(cell => 
          typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
        ).join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `mileage-trips-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed, please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Trips</h1>
        <div className="flex space-x-2">
          <Link to="/" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Dashboard
          </Link>
          <button
            onClick={exportToCSV}
            disabled={isExporting || trips.length === 0}
            className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded inline-flex items-center ${(isExporting || trips.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {trips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Odometer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.distance.toFixed(1)} miles
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trip.startOdometer} → {trip.endOdometer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {trip.purpose}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {trip.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditTrip(trip)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No trips recorded yet.</p>
            <button
              onClick={() => {
                setCurrentTrip(undefined);
                setIsModalOpen(true);
              }}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Your First Trip
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Button (Fixed) */}
      {trips.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => {
              setCurrentTrip(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Trip Modal */}
      {isModalOpen && (
        <TripModal
          onClose={() => {
            setIsModalOpen(false);
            setCurrentTrip(undefined);
          }}
          onAddTrip={handleAddTrip}
          tripToEdit={currentTrip}
        />
      )}
    </div>
  );
};

export default TripsPage;