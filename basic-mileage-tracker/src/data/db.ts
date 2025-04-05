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

export class MileageTrackerDB extends Dexie {
  trips!: Table<Trip>;

  constructor() {
    super('MileageTrackerDB');
    this.version(1).stores({
      trips: '++id, date, distance',
    });
  }
}

export const db = new MileageTrackerDB();