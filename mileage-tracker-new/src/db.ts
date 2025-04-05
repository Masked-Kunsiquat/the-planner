// src/db.ts
import Dexie from 'dexie';

// Define the Trip interface
export interface Trip {
  id?: number;
  date: string;
  startOdometer: number;
  endOdometer: number;
  miles: number;
  purpose: string;
  notes?: string;
  timestamp?: number;
}

// Create a Dexie database class
class MileageTrackerDatabase extends Dexie {
  trips!: Dexie.Table<Trip, number>;
  
  constructor() {
    super('mileageTrackerDB');
    this.version(1).stores({
      trips: '++id, date, purpose, miles', // Primary key is id, with indexes on date, purpose, and miles
    });
  }
}

// Create and export the database instance
export const db = new MileageTrackerDatabase();

// Get all trips
export const getAllTrips = async (): Promise<Trip[]> => {
  return await db.trips.toArray();
};

// Add a new trip
export const addTrip = async (trip: Omit<Trip, 'id' | 'timestamp'>): Promise<number> => {
  return await db.trips.add({
    ...trip,
    date: trip.date || new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
};

// Delete a trip
export const deleteTrip = async (id: number): Promise<void> => {
  return await db.trips.delete(id);
};

// Get trips by date range
export const getTripsByDateRange = async (startDate: string, endDate: string): Promise<Trip[]> => {
  return await db.trips
    .where('date')
    .between(startDate, endDate)
    .toArray();
};

// Statistics interface
export interface TripStats {
  totalMiles: number;
  totalTrips: number;
}

// Get statistics
export const getStats = async (): Promise<TripStats> => {
  const trips = await getAllTrips();
  
  const totalMiles = trips.reduce((sum, trip) => sum + Number(trip.miles), 0);
  const totalTrips = trips.length;
  
  return {
    totalMiles,
    totalTrips,
  };
};

// Export data as CSV
export const exportAsCSV = async (): Promise<string> => {
  const trips = await getAllTrips();
  
  // Sort by date descending
  trips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const headers = ['Date', 'Start Odometer', 'End Odometer', 'Miles', 'Purpose', 'Notes'];
  const csvContent = [
    headers.join(','),
    ...trips.map(trip => [
      trip.date,
      trip.startOdometer,
      trip.endOdometer,
      trip.miles,
      `"${trip.purpose}"`,
      `"${trip.notes || ''}"`
    ].join(','))
  ].join('\n');
  
  return csvContent;
};