import React, { useState } from "react";
import 'font-awesome/css/font-awesome.min.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <div
        className={`bg-gray-900 h-screen text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}
      >
        <button
          onClick={toggleSidebar}
          className="p-4 focus:outline-none hover:bg-gray-700 w-full"
        >
          {isSidebarOpen ? (
            <i className="fa-solid fa-arrow-left"></i>
          ) : (
            <i className="fa-solid fa-arrow-right"></i>
          )}
        </button>

        <nav className="mt-4 space-y-2">
          <a
            href="/"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fas ${isSidebarOpen ? "fa-tachometer-alt" : "fa-chart-bar"}`}></i>
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </a>
          <a
            href="/users"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fas ${isSidebarOpen ? "fa-users" : "fa-user-friends"}`}></i>
            {isSidebarOpen && <span className="ml-3">Users</span>}
          </a>
          <a
            href="/categories"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fs ${isSidebarOpen ? "fa-solid fa-layer-group" : "fa-solid fa-layer-group"}`}></i>
            {/* <i class="fa-brands fa-product-hunt"></i> */}
            {isSidebarOpen && <span className="ml-3">Category Management</span>}
          </a>
          <a
            href="/brands"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fs ${isSidebarOpen ? "fa-solid fa-layer-group" : "fa-solid fa-layer-group"}`}></i>
            {/* <i class="fa-brands fa-product-hunt"></i> */}
            {isSidebarOpen && <span className="ml-3">Brands Management</span>}
          </a>
          <a
            href="/products"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fs ${isSidebarOpen ? "fa-brands fa-product-hunt" : "fa-brands fa-product-hunt"}`}></i>
            {/* <i class="fa-brands fa-product-hunt"></i> */}
            {isSidebarOpen && <span className="ml-3">Products Management</span>}
          </a>
          <a
            href="/settings"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fas ${isSidebarOpen ? "fa-cogs" : "fa-cog"}`}></i>
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </a>
          {/* <a
            href="/reports"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fas ${isSidebarOpen ? "fa-chart-line" : "fa-bar-chart"}`}></i>
            {isSidebarOpen && <span className="ml-3">Reports</span>}
          </a>
          
          <a
            href="/logout"
            className="flex items-center p-4 hover:bg-gray-700 rounded-md transition duration-200"
          >
            <i className={`fas ${isSidebarOpen ? "fa-sign-out-alt" : "fa-door-open"}`}></i>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </a> */}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
