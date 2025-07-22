import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const SidebarLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
