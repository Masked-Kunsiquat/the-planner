// src/services/VehicleAnalyticsService.tsx
import { db } from '../data/db';

interface MPGCalculation {
  startOdometer: number;
  endOdometer: number;
  gallons: number;
  mpg: number;
  date: string;
  isFull: boolean;
}

export class VehicleAnalyticsService {
  /**
   * Calculate detailed MPG with full tank considerations
   */
  static async calculateDetailedMPG() {
    try {
      console.log('Starting MPG calculation...');

      const gasExpenses = await db.expenses
        .where('type')
        .equals('gas')
        .toArray();

      console.log('Total gas expenses:', gasExpenses.length);

      // Sort expenses chronologically by date
      gasExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const validExpenses = gasExpenses.filter(
        (e) =>
          typeof e.gallons === 'number' &&
          e.gallons > 0 &&
          typeof e.odometer === 'number' &&
          e.odometer > 0
      );

      const mpgCalculations: MPGCalculation[] = [];
      let lastFull = null;
      let gallonsSinceLastFull = 0;

      for (const expense of validExpenses) {
        if (!lastFull) {
          if (expense.isFull) {
            lastFull = expense;
            gallonsSinceLastFull = 0;
          }
          continue;
        }

        gallonsSinceLastFull += expense.gallons || 0;

        if (expense.isFull) {
          const miles = expense.odometer - lastFull.odometer;
          const mpg = miles / gallonsSinceLastFull;

          console.log('MPG Debug:', {
            startOdometer: lastFull.odometer,
            endOdometer: expense.odometer,
            miles,
            gallonsSinceLastFull,
            mpg,
          });

          if (mpg > 5 && mpg < 50) {
            mpgCalculations.push({
              startOdometer: lastFull.odometer,
              endOdometer: expense.odometer,
              gallons: gallonsSinceLastFull,
              mpg,
              date: expense.date,
              isFull: true,
            });
          } else {
            console.log('Skipped MPG calculation: outside reasonable range.');
          }

          lastFull = expense;
          gallonsSinceLastFull = 0;
        }
      }

      const averageMPG =
        mpgCalculations.length > 0
          ? mpgCalculations.reduce((sum, m) => sum + m.mpg, 0) / mpgCalculations.length
          : 0;

      return {
        averageMPG,
        mpgCalculations,
        totalFullTankFillups: mpgCalculations.length,
        bestMPG:
          mpgCalculations.length > 0
            ? Math.max(...mpgCalculations.map((m) => m.mpg))
            : 0,
        worstMPG:
          mpgCalculations.length > 0
            ? Math.min(...mpgCalculations.map((m) => m.mpg))
            : 0,
      };
    } catch (error) {
      console.error('Error calculating MPG:', error);
      return {
        averageMPG: 0,
        mpgCalculations: [],
        totalFullTankFillups: 0,
        bestMPG: 0,
        worstMPG: 0,
      };
    }
  }

  /**
   * Calculate total fuel costs and related metrics
   */
  static async calculateFuelCosts() {
    try {
      const gasExpenses = await db.expenses
        .where('type')
        .equals('gas')
        .toArray();

      gasExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const totalFuelCost = gasExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalGallonsFilled = gasExpenses.reduce(
        (sum, e) => sum + (e.gallons || 0),
        0
      );

      const averagePricePerGallon =
        totalGallonsFilled > 0 ? totalFuelCost / totalGallonsFilled : 0;

      const mostExpensiveFillup =
        gasExpenses.length > 0
          ? gasExpenses.reduce((max, e) => (e.amount > max.amount ? e : max))
          : null;

      const leastExpensiveFillup =
        gasExpenses.length > 0
          ? gasExpenses.reduce((min, e) => (e.amount < min.amount ? e : min))
          : null;

      return {
        totalFuelCost,
        totalGallonsFilled,
        averagePricePerGallon,
        mostExpensiveFillup,
        leastExpensiveFillup,
        totalFillups: gasExpenses.length,
      };
    } catch (error) {
      console.error('Error calculating fuel costs:', error);
      return {
        totalFuelCost: 0,
        totalGallonsFilled: 0,
        averagePricePerGallon: 0,
        mostExpensiveFillup: null,
        leastExpensiveFillup: null,
        totalFillups: 0,
      };
    }
  }
}
