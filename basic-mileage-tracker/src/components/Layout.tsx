// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { DarkThemeToggle } from 'flowbite-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mileage Tracker</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <DarkThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>

      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Mileage Tracker App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};