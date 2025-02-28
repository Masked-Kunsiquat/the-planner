import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // ✅ Get theme & toggle function

  return (
    <div className="w-full bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      {/* Left: Navigation Tabs */}
      <Tabs aria-label="Navigation Tabs" className="text-white"> {/* ✅ Removed `variant` */}
        <Tabs.Item active={location.pathname === "/dashboard"} title="Dashboard" icon={MdDashboard}>
          <Link to="/dashboard">Dashboard</Link>
        </Tabs.Item>
        <Tabs.Item active={location.pathname === "/profile"} title="Profile" icon={HiUserCircle}>
          <Link to="/profile">Profile</Link>
        </Tabs.Item>
        <Tabs.Item active={location.pathname === "/settings"} title="Settings" icon={HiAdjustments}>
          <Link to="/settings">Settings</Link>
        </Tabs.Item>
        <Tabs.Item active={location.pathname === "/contacts"} title="Contacts" icon={HiClipboardList}>
          <Link to="/contacts">Contacts</Link>
        </Tabs.Item>
      </Tabs>

      {/* Right: Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-all"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}
