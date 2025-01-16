import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");

    if (!AdminUser) {
      navigate("/login");
    } else {
      const parsedData = JSON.parse(AdminUser);
      setFirstname(parsedData.firstName || "First Name");
      setLastname(parsedData.lastName || "Last Name");
    }
  }, [navigate]);

  return (
    <nav className="bg-blue-900 text-white p-2 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Admin Title */}
          <a href="/" className="text-2xl font-semibold tracking-wider hover:text-gray-300">
            Admin Panel
          </a>
        </div>

        {/* Desktop Links */}
        <div className=" sm:flex sm:space-x-6">
          <div className="relative flex items-center">
            <h1 className="text-lg text-gray-200">Hello, {firstName} {lastName}!</h1>
            <button
        onClick={toggleDropdown}
        className="ml-2 p-3 w-12  rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
      >
        <i className="fa-solid fa-user text-md"></i>
      </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-32 bg-white text-gray-800 rounded-md shadow-lg w-48 z-10">
                <a
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                >
                  Profile
                </a>
                <a
                  href="/logout"
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
