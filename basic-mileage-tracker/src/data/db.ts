import Dexie, { Table } from 'dexie';

export interface Trip {
  id?: number;
  date: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  purpose: string;
  notes: string;
}

export interface Expense {
  id?: number;
  date: string;
  type: 'gas' | 'maintenance' | 'other';
  amount: number;
  odometer: number;
  gallons?: number; // Only for gas type
  notes: string;
}

export class MileageTrackerDB extends Dexie {
  trips!: Table<Trip>;
  expenses!: Table<Expense>;

  constructor() {
    super('MileageTrackerDB');
    this.version(1).stores({
      trips: '++id, date, distance',
    });
    
    // Add expenses table in version 2
    this.version(2).stores({
      expenses: '++id, date, type, amount',
    });
  }
}

export const db = new MileageTrackerDB();