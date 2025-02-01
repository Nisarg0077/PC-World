import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const clientUser = sessionStorage.getItem("ClientUser");

    // if (!clientUser) {
    //   navigate("/login");
    //   return;
    // }

    try {
      setUser(JSON.parse(clientUser)); // Parse session data
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-white">
          PC-World 
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-white">
          <li>
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition">
              Services
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition">
              Contact
            </Link>
          </li>

          {/* User Dropdown */}
          {user ? (
            <div className="sm:flex sm:space-x-6 relative">
              <button onClick={toggleDropdown} className="ml-2">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center bg-gray-200">
                  <span className="text-md font-bold text-gray-600">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-10 bg-white text-gray-800 rounded-md shadow-lg w-48 z-10">
                  <Link
                    to="/adminProfile"
                    className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("ClientUser");
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-green-500 p-2 rounded font-bold hover:text-green-500 hover:font-bold hover:bg-white transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-14 left-0 w-full bg-white transition-all ${
          isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="md:hidden text-center py-4 space-y-3 bg-gradient-to-r from-blue-600 to-purple-600">
          <li>
            <Link to="/" className="block py-2 text-white hover:text-gray-200 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="#" className="block py-2 text-white hover:text-gray-200 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className="block py-2 text-white hover:text-gray-200 transition">
              Services
            </Link>
          </li>
          <li>
            <Link to="#" className="block py-2 text-white hover:text-gray-200 transition">
              Contact
            </Link>
          </li>

          {user ? (
            <div className="relative flex flex-col items-center">
              <button onClick={toggleDropdown}>
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center bg-gray-200">
                  <span className="text-md font-bold text-gray-600">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white text-gray-800 rounded-md shadow-lg w-48 z-10">
                  <Link
                    to="/adminProfile"
                    className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("ClientUser");
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-green-500 p-2 rounded font-bold hover:text-green-500 hover:font-bold hover:bg-white transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
