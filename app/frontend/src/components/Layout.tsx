// src/components/Layout.tsx
import React from "react";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* ✅ Navbar is always visible */}
      <Navbar />

      {/* ✅ Page Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
