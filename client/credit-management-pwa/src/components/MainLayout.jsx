import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Content Area */}
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 mt-16 overflow-y-auto">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
