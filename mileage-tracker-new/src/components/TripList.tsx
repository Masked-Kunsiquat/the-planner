// src/components/TripList.tsx
import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { HiOutlineTrash } from 'react-icons/hi';
import { deleteTrip, Trip } from '../db';

interface TripListProps {
  trips: Trip[];
  onTripDeleted: () => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onTripDeleted }) => {
  const handleDeleteTrip = async (id: number) => {
    try {
      await deleteTrip(id);
      onTripDeleted();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Error deleting trip');
    }
  };

  if (trips.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No trips recorded yet</p>;
  }

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <Card key={trip.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-200">{trip.purpose}</h5>
                <Badge color="info">{trip.miles} miles</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{trip.date}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p>Start: {trip.startOdometer}</p>
                <p>End: {trip.endOdometer}</p>
              </div>
              {trip.notes && <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{trip.notes}</p>}
            </div>
            <button 
              onClick={() => handleDeleteTrip(trip.id as number)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <HiOutlineTrash className="h-5 w-5" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TripList;