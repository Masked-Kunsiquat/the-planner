import { Navbar, Tabs } from "flowbite-react";
import { Outlet, Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar fluid rounded>
                <Navbar.Brand>
                    <Link to="/">Trip Planner</Link>
                </Navbar.Brand>
                <Tabs>
                    <Tabs.Item>
                        <Link to="/trips">Trips</Link>
                    </Tabs.Item>

                    <Tabs.Item>
                        <Link to="/activities">Activities</Link>
                    </Tabs.Item>
                    
                    <Tabs.Item>
                        <Link to="/settings">Settings</Link>
                    </Tabs.Item>
                </Tabs>
                <DarkModeToggle />
            </Navbar>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};
export default MainLayout;