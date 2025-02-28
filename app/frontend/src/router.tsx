import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Trips from "./pages/Trips";
import Home from "./pages/Home";
import Activities from "./pages/Activites";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/trips", element: <Trips /> },
            { path: "/activities", element: <Activities /> },
            { path: "/settings", element: <Settings /> },
        ],
    },
]);

export default router;