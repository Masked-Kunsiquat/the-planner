import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripPage';
import ExpensesPage from './pages/ExpensesPage';
import { db } from './data/db';
import { HiMoon, HiSun } from 'react-icons/hi';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || 
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Initialize database
    db.open();
    
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Router>
        {/* Header with dark mode toggle */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mileage Tracker</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <HiSun className="h-6 w-6" />
                  ) : (
                    <HiMoon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Mileage Tracker App &copy; {new Date().getFullYear()}</p>
        </footer>
      </Router>
    </div>
  );
};

export default App;