import React, { useState, useEffect } from 'react';
import { db, Trip, Expense } from '../data/db';
import { VehicleAnalyticsService } from '../services/VehicleAnalyticsService';
import { Link } from 'react-router-dom';
import TripModal from '../components/TripModal';
import ExpenseModal from '../components/ExpenseModal';
import { Card, Button } from 'flowbite-react';
import { 
  HiOutlinePlus, 
  HiOutlineCalendar, 
  HiOutlineMap, 
  HiOutlineClipboardList, 
  HiOutlineCash, 
  HiOutlineBeaker,
  HiOutlineDocumentText,
  HiOutlineTruck,
  HiOutlineChartBar
} from 'react-icons/hi';

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalMiles: 0,
    avgMiles: 0,
    totalExpenses: 0,
    fuelExpenses: 0,
    maintenanceExpenses: 0,
    costPerMile: 0,
    averageMPG: 0,
    totalGallonsFilled: 0,
    averagePricePerGallon: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trips
        const allTrips = await db.trips.toArray();
        
        // Fetch expenses
        const allExpenses = await db.expenses.toArray();
        
        // Calculate trip-related stats
        const totalMiles = allTrips.reduce((sum, trip) => sum + trip.distance, 0);
        const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const fuelExpenses = allExpenses
          .filter(expense => expense.type === 'gas')
          .reduce((sum, expense) => sum + expense.amount, 0);
        const maintenanceExpenses = allExpenses
          .filter(expense => expense.type === 'maintenance')
          .reduce((sum, expense) => sum + expense.amount, 0);
        
        // Calculate cost per mile
        const costPerMile = totalMiles > 0 ? fuelExpenses / totalMiles : 0;

        // Calculate MPG
        const mpgReport = await VehicleAnalyticsService.calculateDetailedMPG();
        
        // Calculate Fuel Costs
        const fuelCostReport = await VehicleAnalyticsService.calculateFuelCosts();

        setTrips(allTrips);
        setExpenses(allExpenses);
        setStats({
          totalTrips: allTrips.length,
          totalMiles: totalMiles,
          avgMiles: allTrips.length > 0 ? totalMiles / allTrips.length : 0,
          totalExpenses: totalExpenses,
          fuelExpenses: fuelExpenses,
          maintenanceExpenses: maintenanceExpenses,
          costPerMile: costPerMile,
          averageMPG: mpgReport.averageMPG,
          totalGallonsFilled: fuelCostReport.totalGallonsFilled,
          averagePricePerGallon: fuelCostReport.averagePricePerGallon,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleAddTrip = async (trip: Trip) => {
    await db.trips.add(trip);
    setTrips([...trips, trip]);
    setIsModalOpen(false);
  };
  
  const handleAddExpense = async (expense: Expense) => {
    try {
      await db.expenses.add(expense);
      setExpenses([...expenses, expense]);
      setIsExpenseModalOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. The expense tracking feature may need to be set up first.');
    }
  };

  // Stat card component for consistent styling
  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    link, 
    linkText 
  }: { 
    icon: React.ElementType, 
    title: string, 
    value: string | number, 
    link?: string, 
    linkText?: string 
  }) => (
    <Card>
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        </div>
        <div className="flex items-baseline">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          {link && (
            <Link to={link} className="ml-auto text-blue-500 hover:text-blue-700 text-sm">
              {linkText || 'View All'}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Mileage Tracker</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 overflow-x-auto">
        <div className="grid gap-4">
          <StatCard 
            icon={HiOutlineCalendar}
            title="TOTAL TRIPS"
            value={stats.totalTrips}
            link="/trips"
          />
          <StatCard 
            icon={HiOutlineMap}
            title="TOTAL MILES"
            value={stats.totalMiles.toFixed(1)}
          />
          <StatCard 
            icon={HiOutlineClipboardList}
            title="AVG MILES"
            value={stats.avgMiles.toFixed(1)}
          />
        </div>
        <div className="grid gap-4">
          <StatCard 
            icon={HiOutlineCash}
            title="TOTAL EXPENSES"
            value={`$${stats.totalExpenses.toFixed(2)}`}
            link="/expenses"
          />
          <StatCard 
            icon={HiOutlineBeaker}
            title="FUEL EXPENSES"
            value={`$${stats.fuelExpenses.toFixed(2)}`}
          />
          <StatCard 
            icon={HiOutlineDocumentText}
            title="MAINT. EXPENSES"
            value={`$${stats.maintenanceExpenses.toFixed(2)}`}
          />
        </div>
        <div className="grid gap-4">
          <StatCard 
            icon={HiOutlineTruck}
            title="COST PER MILE"
            value={stats.totalMiles > 0 
              ? `$${stats.costPerMile.toFixed(2)}` 
              : 'N/A'}
          />
          <StatCard 
            icon={HiOutlineChartBar}
            title="AVG MPG"
            value={stats.averageMPG > 0 
              ? stats.averageMPG.toFixed(1)
              : 'N/A'}
          />
          <StatCard 
            icon={HiOutlineBeaker}
            title="AVG PRICE/GAL"
            value={`$${stats.averagePricePerGallon.toFixed(3)}`}
          />
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button 
          onClick={() => setIsModalOpen(true)}
          color="blue"
        >
          <HiOutlinePlus className="mr-2 h-5 w-5" />
          Add New Trip
        </Button>
        
        <Button 
          onClick={() => setIsExpenseModalOpen(true)}
          color="green"
        >
          <HiOutlinePlus className="mr-2 h-5 w-5" />
          Add Expense
        </Button>
      </div>
      
      {/* Recent Trips */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Trips</h2>
          <Link to="/trips" className="text-blue-500 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {trips.slice(0, 5).map((trip, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(trip.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trip.distance.toFixed(1)} miles
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {trip.purpose}
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No trips recorded yet. Add your first trip!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Trip Modal */}
      {isModalOpen && (
        <TripModal 
          onClose={() => setIsModalOpen(false)} 
          onAddTrip={handleAddTrip} 
        />
      )}
      
      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          onClose={() => setIsExpenseModalOpen(false)}
          onAddExpense={handleAddExpense}
        />
      )}
    </div>
  );
};

export default Dashboard;