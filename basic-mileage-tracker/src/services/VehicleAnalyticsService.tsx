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

      // Fetch all gas expenses
      const gasExpenses = await db.expenses
        .where('type').equals('gas')
        .toArray();

      console.log('Total gas expenses:', gasExpenses.length);
      
      // Detailed logging of each expense
      gasExpenses.forEach((expense, index) => {
        console.log(`Gas Expense ${index + 1} Details:`, {
          id: expense.id,
          date: expense.date,
          amount: expense.amount,
          gallons: expense.gallons,
          odometer: expense.odometer,
          isFull: expense.isFull,
          type: expense.type
        });
      });

      // Verify full tank condition
      const fullTankExpenses = gasExpenses.filter(expense => expense.isFull);
      console.log('Full tank expenses:', fullTankExpenses.length);

      // Validate data requirements for MPG calculation
      const validExpenses = gasExpenses.filter(expense => 
        expense.gallons !== undefined && 
        expense.gallons !== null && 
        expense.gallons > 0 &&
        expense.odometer !== undefined && 
        expense.odometer > 0
      );

      console.log('Valid gas expenses:', validExpenses.length);

      // Sort expenses by odometer to ensure chronological order
      validExpenses.sort((a, b) => a.odometer - b.odometer);

      const mpgCalculations: MPGCalculation[] = [];
      let lastFullTankExpense: typeof gasExpenses[0] | null = null;

      // Calculate MPG between consecutive full tank fill-ups
      for (let i = 0; i < validExpenses.length; i++) {
        const currentFillup = validExpenses[i];

        // If this is a full tank fill-up
        if (currentFillup.isFull) {
          if (lastFullTankExpense) {
            // Calculate miles driven since last full tank
            const milesDriven = currentFillup.odometer - lastFullTankExpense.odometer;
            const gallonsUsed = validExpenses
              .filter(expense => 
                expense.date >= lastFullTankExpense!.date && 
                expense.date <= currentFillup.date
              )
              .reduce((sum, expense) => sum + (expense.gallons || 0), 0);

            console.log('MPG Calculation Debug:', {
              startOdometer: lastFullTankExpense.odometer,
              endOdometer: currentFillup.odometer,
              milesDriven,
              gallonsUsed,
              startDate: lastFullTankExpense.date,
              endDate: currentFillup.date
            });

            const mpg = milesDriven / gallonsUsed;

            console.log('MPG Calculation:', {
              calculateMPG: mpg,
              condition1: mpg > 5,
              condition2: mpg < 50
            });

            // Only add if MPG seems reasonable (between 5 and 50)
            if (mpg > 5 && mpg < 50) {
              mpgCalculations.push({
                startOdometer: lastFullTankExpense.odometer,
                endOdometer: currentFillup.odometer,
                gallons: gallonsUsed,
                mpg: mpg,
                date: currentFillup.date,
                isFull: true
              });
            } else {
              console.log('MPG SKIPPED: Unreasonable MPG value');
            }
          }
          
          // Update last full tank expense
          lastFullTankExpense = currentFillup;
        }
      }

      console.log('MPG Calculations:', mpgCalculations);

      // Detailed MPG analysis
      const averageMPG = mpgCalculations.length > 0
        ? mpgCalculations.reduce((sum, calc) => sum + calc.mpg, 0) / mpgCalculations.length
        : 0;

      console.log('Average MPG:', averageMPG);

      return {
        averageMPG,
        mpgCalculations,
        totalFullTankFillups: mpgCalculations.length,
        bestMPG: mpgCalculations.length > 0 
          ? Math.max(...mpgCalculations.map(calc => calc.mpg))
          : 0,
        worstMPG: mpgCalculations.length > 0
          ? Math.min(...mpgCalculations.map(calc => calc.mpg))
          : 0
      };
    } catch (error) {
      console.error('Error calculating MPG:', error);
      return {
        averageMPG: 0,
        mpgCalculations: [],
        totalFullTankFillups: 0,
        bestMPG: 0,
        worstMPG: 0
      };
    }
  }

  /**
   * Calculate total fuel costs and related metrics
   */
  static async calculateFuelCosts() {
    try {
      const gasExpenses = await db.expenses
        .where('type').equals('gas')
        .toArray();

      // Sort expenses chronologically
      gasExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const totalFuelCost = gasExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalGallonsFilled = gasExpenses.reduce((sum, expense) => sum + (expense.gallons || 0), 0);
      
      // Calculate average price per gallon across all fill-ups
      const averagePricePerGallon = totalGallonsFilled > 0 
        ? totalFuelCost / totalGallonsFilled 
        : 0;

      // Identify most expensive and least expensive fill-ups
      const mostExpensiveFillup = gasExpenses.length > 0
        ? gasExpenses.reduce((max, expense) => 
            (expense.amount > max.amount) ? expense : max
          )
        : null;

      const leastExpensiveFillup = gasExpenses.length > 0
        ? gasExpenses.reduce((min, expense) => 
            (expense.amount < min.amount) ? expense : min
          )
        : null;

      return {
        totalFuelCost,
        totalGallonsFilled,
        averagePricePerGallon,
        mostExpensiveFillup,
        leastExpensiveFillup,
        totalFillups: gasExpenses.length
      };
    } catch (error) {
      console.error('Error calculating fuel costs:', error);
      return {
        totalFuelCost: 0,
        totalGallonsFilled: 0,
        averagePricePerGallon: 0,
        mostExpensiveFillup: null,
        leastExpensiveFillup: null,
        totalFillups: 0
      };
    }
  }
}