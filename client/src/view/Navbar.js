import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "../components/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User dropdown toggle
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { state, fetchCart } = useCart();
  const { cartCount } = useCart();

  useEffect(() => {
    const clientUser = sessionStorage.getItem("ClientUser");
    if (clientUser) {
      try {
        setUser(JSON.parse(clientUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id);
    }
  }, [user?.id, fetchCart]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 ">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-80 transition">
          PC-World
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center text-white text-lg">
          {["Home", "Shop Now", "About", "Services", "Contact"].map((item, index) => (
            <li key={index}>
              <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className="hover:text-yellow-300 transition duration-200">
                {item}
              </Link>
            </li>
          ))}

          {/* Cart Icon */}
          <li className="relative">
            <Link to="/cart" className="flex items-center hover:text-yellow-300 transition duration-200">
              <i className="fa fa-shopping-cart fa-lg text-white"></i>
              <span className="ml-2 font-bold bg-red-500 text-white text-sm px-2 py-1 rounded-full">{cartCount}</span>
            </Link>
          </li>

          {/* User Dropdown */}
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="ml-4 mt-2 focus:outline-none">
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
                <div className="absolute right-0 mt-3 bg-white text-gray-800 rounded-md shadow-xl w-48 z-10">
                  <Link to="/userProfile" className="block px-4 py-2 hover:bg-gray-100 transition">Profile</Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("ClientUser");
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <li>
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-green-500 transition">
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-2">
          
            <Link to="/cart" className="flex items-center justify-center hover:text-yellow-300 transition duration-200 mx-4">
              <i className="fa fa-shopping-cart fa-lg text-white"></i>
              <span className="ml-1 font-bold bg-red-500 text-white text-sm px-2 py-1 rounded-full">{cartCount}</span>
            </Link>
        
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all overflow-hidden ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="text-center flex flex-col py-4 space-y-3 bg-gradient-to-r from-blue-600 to-purple-600">
          {["Home", "Shop Now", "About", "Services", "Contact"].map((item, index) => (
            <li key={index}>
              <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className="block py-2 text-white hover:text-gray-200 transition">
                {item}
              </Link>
            </li>
          ))}
          
         

          {/* User Dropdown */}
          {user ? (
            <div className="text-center">
              <Link to="/userProfile" className="block px-4 py-2 text-white hover:text-gray-200 transition">
                Profile
              </Link>
              <button
                onClick={() => {
                  sessionStorage.removeItem("ClientUser");
                  navigate("/login");
                }}
                className="block w-full text-white bg-red-600 px-4 py-2 hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <li>
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-green-500 transition">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
