import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";
import accessoriesImage from "../images/sc.svg";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User dropdown toggle state
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  
  useEffect(() => {
    const clientUser = sessionStorage.getItem("ClientUser");

    try {
      setUser(JSON.parse(clientUser)); // Parse session data into user object
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle user dropdown visibility
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-80 transition">
          PC-World
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center text-white text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-300 transition duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition duration-200">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition duration-200">
              Services
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-yellow-300 transition duration-200">
              Contact
            </Link>
          </li>
          <li className="flex">

          <Link to="/cart" className="hover:text-yellow-300 transition duration-200 ">
            
              <i className="fa fa-shopping-cart fa-lg text-white hover:text-yellow-300 transition duration-200"></i>
          </Link>


          </li>



  


          {/* User Dropdown */}
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="ml-4">
                <div className="w-9 h-9 rounded-full border-2 border-blue-500 flex items-center justify-center bg-gray-200">
                  <span className="text-lg font-bold text-gray-600">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 bg-white text-gray-800 rounded-md shadow-xl w-48 z-10">
                  <Link
                    to="/userProfile"
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
                className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-green-500 transition duration-200"
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
          isOpen ? " opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="md:hidden text-center flex-row items-start justify-center align-middle py-4 space-y-3 bg-gradient-to-r from-blue-600 to-purple-600">
          <li>
            <Link
              to="/"
              className="block py-2 text-white hover:text-gray-200 transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 text-white hover:text-gray-200 transition duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 text-white hover:text-gray-200 transition duration-200"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="block py-2 text-white hover:text-gray-200 transition duration-200"
            >
              Contact
            </Link>
          </li>
          <li>
          <Link to="/cart" className="hover:text-yellow-300 transition duration-200 ">
            
            <i className="fa fa-shopping-cart fa-lg text-white hover:text-yellow-300 transition duration-200"></i>
        </Link>
          </li>
          {user ? (
            <div className="relative px-5">
              
                  <Link
                    to="/userProfile"
                    className="block px-4 py-2 text-white hover:text-gray-200 transition duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("ClientUser");
                      navigate("/login");
                    }}
                    className="block rounded w-full text-white bg-red-600 text-center px-4 py-2 hover:bg-red-100 hover:text-red-600 transition duration-200"
                  >
                    Logout
                  </button>
                
            </div>
          ) : (
            <li>
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-green-500 transition duration-200"
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
