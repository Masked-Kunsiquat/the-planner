import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Welcome to Your Dashboard!
      </h2>

      <div className="mt-4">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is a placeholder page. You are authenticated and can access your
          dashboard.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Card 1 */}
        <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Account Overview
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            View and manage your account settings and preferences.
          </p>
        </div>

        {/* Placeholder Card 2 */}
        <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Notifications
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Check your latest notifications and alerts.
          </p>
        </div>

        {/* Placeholder Card 3 */}
        <div className="p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Activity Feed
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Stay updated with the latest activity on your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
