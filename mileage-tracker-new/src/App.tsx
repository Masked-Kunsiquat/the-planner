// src/App.tsx
import { useState, useEffect } from 'react';
import { Button, Spinner, DarkThemeToggle } from 'flowbite-react';
import { HiPlus, HiOutlineDocumentDownload } from 'react-icons/hi';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import StatsDashboard from './components/StatsDashboard';
import { getAllTrips, getStats, exportAsCSV, Trip, TripStats } from './db';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<TripStats>({ totalMiles: 0, totalTrips: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load trips and stats on mount
  useEffect(() => {
    loadTrips();
  }, []);

  // Load trips and stats from IndexedDB
  const loadTrips = async () => {
    try {
      setIsLoading(true);
      
      // Get all trips
      const allTrips = await getAllTrips();
      
      // Sort by date (most recent first)
      allTrips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTrips(allTrips);
      
      // Get statistics
      const statistics = await getStats();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading trips:', error);
      alert('Error loading trip data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Generate CSV content
      const csvContent = await exportAsCSV();
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mileage-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 py-8 dark:bg-gray-900">
      <div className="absolute inset-0 size-full">
        <div className="relative h-full w-full select-none">
          <img
            className="absolute right-0 min-w-dvh dark:hidden"
            alt="Pattern Light"
            src="/pattern-light.svg"
          />
          <img
            className="absolute right-0 hidden min-w-dvh dark:block"
            alt="Pattern Dark"
            src="/pattern-dark.svg"
          />
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <DarkThemeToggle />
      </div>

      <div className="relative flex w-full max-w-2xl flex-col items-center justify-center gap-8 pt-12">
        <div className="relative flex flex-col items-center gap-2">
          <h1 className="relative text-center text-3xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
            Mileage Tracker
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Track your business miles for tax purposes
          </p>
        </div>

        <div className="w-full">
          <StatsDashboard stats={stats} />
        </div>

        {!isFormOpen ? (
          <div className="flex justify-between w-full mb-6">
            <Button color="blue" onClick={() => setIsFormOpen(true)}>
              <HiPlus className="mr-2 h-5 w-5" />
              Add Trip
            </Button>
            <Button 
              color="green" 
              onClick={handleExportData}
              disabled={trips.length === 0}
            >
              <HiOutlineDocumentDownload className="mr-2 h-5 w-5" />
              Export
            </Button>
          </div>
        ) : (
          <div className="w-full mb-6">
            <TripForm 
              onTripAdded={() => { loadTrips(); setIsFormOpen(false); }} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        )}

        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-200">Trip History</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <TripList trips={trips} onTripDeleted={loadTrips} />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;