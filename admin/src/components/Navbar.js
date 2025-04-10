import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");

    if (!AdminUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(AdminUser));
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  // console.log("User Profile Picture:", user.profilePicture); // Debugging log

  return (
    <nav className="bg-blue-900 text-white p-2 shadow-md sticky z-50 top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-semibold tracking-wider hover:text-gray-300">
            Admin Panel | PC-World
          </a>
        </div>

        <div className="sm:flex sm:space-x-6">
          <div className="relative flex items-center">
            <h1 className="text-lg text-gray-200">Hello, {user.firstName} {user.lastName}</h1>
            <button onClick={toggleDropdown} className="ml-2">
                {user.profilePicture ? (
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center bg-gray-200">
                  <img
                    src={`http://localhost:5000/images/${user.profilePicture}`} // Ensure the correct path
                    alt="Profile"
                    className="w-10 h-10 object-contain rounded-full"
                  />
              </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200">
                  <span className="text-md font-bold text-gray-600">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </span>
                  </div>
                )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-32 bg-white text-gray-800 rounded-md shadow-lg w-48 z-10">
                <a href="/adminProfile" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Profile</a>
                <a href="/logout" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;