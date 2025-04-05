import { db, Expense } from '../data/db';

interface MPGCalculation {
  startOdometer: number;
  endOdometer: number;
  gallons: number;
  mpg: number;
  date: string;
  isFull: boolean;
}

interface FuelCostAnalysis {
  totalFuelCost: number;
  totalGallonsFilled: number;
  averagePricePerGallon: number;
  mostExpensiveFillup: Expense | null;
  leastExpensiveFillup: Expense | null;
  totalFillups: number;
}

interface MPGReport {
  averageMPG: number;
  mpgCalculations: MPGCalculation[];
  totalFullTankFillups: number;
  bestMPG: number;
  worstMPG: number;
}

export class VehicleAnalyticsService {
  /**
   * Calculate detailed MPG with full tank considerations.
   *
   * This method calculates MPG by considering only full tank fill-ups to provide more accurate readings.
   * It also filters out potentially erroneous MPG values.
   *
   * @returns {Promise<MPGReport>} An object containing average MPG, individual MPG calculations,
   * total full tank fill-ups, best MPG, and worst MPG.
   */
  static async calculateDetailedMPG(): Promise<MPGReport> {
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
      let lastFull: Expense | null = null;
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

      const bestMPG =
        mpgCalculations.length > 0
          ? Math.max(...mpgCalculations.map((m) => m.mpg))
          : 0;

      const worstMPG =
        mpgCalculations.length > 0
          ? Math.min(...mpgCalculations.map((m) => m.mpg))
          : 0;

      return {
        averageMPG,
        mpgCalculations,
        totalFullTankFillups: mpgCalculations.length,
        bestMPG,
        worstMPG,
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
   * Calculate total fuel costs and related metrics.
   *
   * This method calculates the total fuel cost, total gallons filled, average price per gallon,
   * and identifies the most and least expensive fill-ups.
   *
   * @returns {Promise<FuelCostAnalysis>} An object containing fuel cost analysis results.
   */
  static async calculateFuelCosts(): Promise<FuelCostAnalysis> {
    try {
      const gasExpenses = await db.expenses
        .where('type')
        .equals('gas')
        .toArray();

      gasExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (gasExpenses.length === 0) {
        return {
          totalFuelCost: 0,
          totalGallonsFilled: 0,
          averagePricePerGallon: 0,
          mostExpensiveFillup: null,
          leastExpensiveFillup: null,
          totalFillups: 0,
        };
      }

      let totalFuelCost = 0;
      let totalGallonsFilled = 0;
      let mostExpensiveFillup = gasExpenses[0];
      let leastExpensiveFillup = gasExpenses[0];

      for (const expense of gasExpenses) {
        totalFuelCost += expense.amount;
        totalGallonsFilled += expense.gallons || 0;

        if (expense.amount > mostExpensiveFillup.amount) {
          mostExpensiveFillup = expense;
        }

        if (expense.amount < leastExpensiveFillup.amount) {
          leastExpensiveFillup = expense;
        }
      }

      const averagePricePerGallon =
        totalGallonsFilled > 0 ? totalFuelCost / totalGallonsFilled : 0;

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