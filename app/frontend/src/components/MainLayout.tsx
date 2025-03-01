import { Navbar } from "flowbite-react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import DarkModeToggle from "./DarkModeToggle";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar /> {/* ✅ Sidebar added */}
      <div className="flex-1 flex flex-col">
        <Navbar fluid rounded>
          <Navbar.Brand>
            <Link to="/">Trip Planner</Link>
          </Navbar.Brand>
          <DarkModeToggle />
        </Navbar>
        <main className="p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
