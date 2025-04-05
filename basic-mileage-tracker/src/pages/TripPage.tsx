import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, Trip } from '../data/db';
import TripModal from '../components/TripModal';
import { Button, Card, Spinner } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlineDownload, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Trips</h1>
        <div className="flex space-x-2">
          <Button as={Link} to="/" color="gray">
            <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button
            onClick={exportToCSV}
            disabled={isExporting || trips.length === 0}
            color="success"
          >
            {isExporting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Exporting...
              </>
            ) : (
              <>
                <HiOutlineDownload className="mr-2 h-5 w-5" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        {trips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Distance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Odometer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {trip.distance.toFixed(1)} miles
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {trip.startOdometer} → {trip.endOdometer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {trip.purpose}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {trip.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEditTrip(trip)}
                          size="xs"
                          color="info"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTrip(trip.id!)}
                          size="xs"
                          color="failure"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
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
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No trips recorded yet</p>
            <Button
              onClick={() => {
                setCurrentTrip(undefined);
                setIsModalOpen(true);
              }}
              color="blue"
            >
              <HiOutlinePlus className="mr-2 h-5 w-5" />
              Add Your First Trip
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Add Button (Fixed) */}
      {trips.length > 0 && (
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={() => {
              setCurrentTrip(undefined);
              setIsModalOpen(true);
            }}
            color="blue"
            className="rounded-full w-14 h-14 flex items-center justify-center"
          >
            <HiOutlinePlus className="h-6 w-6" />
          </Button>
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