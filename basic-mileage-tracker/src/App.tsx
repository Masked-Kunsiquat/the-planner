import React, { useState, useEffect } from 'react';
import './App.css';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import { db, Trip } from './data/db';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const allTrips = await db.trips.toArray();
      setTrips(allTrips);
    };
    fetchTrips();
  }, []);

  const handleAddTrip = async (trip: Trip) => {
    await db.trips.add(trip);
    setTrips([...trips, trip]);
  };

  const handleDeleteTrip = async (index: number) => {
    const tripToDelete = trips[index];
    await db.trips.delete(tripToDelete.id!);
    setTrips(trips.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Mileage Tracker</h1>
      <TripForm onAddTrip={handleAddTrip} />
      <TripList trips={trips} onDeleteTrip={handleDeleteTrip} />
    </div>
  );
};

export default App;