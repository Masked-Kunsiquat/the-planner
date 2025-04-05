// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { HiMoon, HiSun } from 'react-icons/hi';

interface LayoutProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
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
                {isDarkMode ? <HiSun className="h-6 w-6" /> : <HiMoon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Mileage Tracker App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};