// src/components/Layout.tsx

import { DarkThemeToggle } from "flowbite-react";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      {/* Dark theme toggle for the entire app */}
      <div className="p-4">
        <DarkThemeToggle />
      </div>

      {/* Main content wrapped in a container */}
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
};

export default Layout;
