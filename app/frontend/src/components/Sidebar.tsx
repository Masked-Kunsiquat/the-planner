import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineMap, HiOutlineCog, HiOutlineTicket } from "react-icons/hi";
import { MdOutlineHotel, MdOutlineDirectionsCar } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();

  return (
    <FlowbiteSidebar className="w-64 h-screen bg-gray-800 text-white fixed">
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item as="div" className="p-4 text-xl font-bold">
            Trip Planner
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/"}>
            <Link to="/" className="flex items-center gap-2">
              <HiOutlineHome className="w-5 h-5" />
              Dashboard
            </Link>
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/trips"}>
            <Link to="/trips" className="flex items-center gap-2">
              <HiOutlineMap className="w-5 h-5" />
              Trips
            </Link>
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/lodging"}>
            <Link to="/lodging" className="flex items-center gap-2">
              <MdOutlineHotel className="w-5 h-5" />
              Lodging
            </Link>
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/activities"}>
            <Link to="/activities" className="flex items-center gap-2">
              <HiOutlineTicket className="w-5 h-5" />
              Activities
            </Link>
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/transportation"}>
            <Link to="/transportation" className="flex items-center gap-2">
              <MdOutlineDirectionsCar className="w-5 h-5" />
              Transportation
            </Link>
          </FlowbiteSidebar.Item>

          <FlowbiteSidebar.Item as="div" active={location.pathname === "/settings"}>
            <Link to="/settings" className="flex items-center gap-2">
              <HiOutlineCog className="w-5 h-5" />
              Settings
            </Link>
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
};

export default Sidebar;
