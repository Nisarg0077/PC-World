

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { useCart } from "../components/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // User dropdown toggle
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { state, fetchCart } = useCart();
  const { cartCount } = useCart();

  useEffect(() => {
    const clientUser = sessionStorage.getItem("clientUser");
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
      <div className="container mx-auto flex items-center justify-between px-4 py-1">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:bg-violet-700 p-2 rounded-md hover:text-yellow-300 transition">
          PC-World
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 items-center text-white text-lg">
          {["Home", "Shop Now", "About Us", "Contact Us"].map((item, index) => (
            <li key={index} className="hover:bg-violet-700 h-fit p-2 rounded-md">
              <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className="hover:text-yellow-300 transition duration-200 font-semibold">
                {item}
              </Link>
            </li>
          ))}

<li className="hover:bg-violet-700 h-fit p-2 rounded-md bg-red-500 bg-opacity-80">
              <Link to='/custompc' className="hover:text-yellow-300  transition duration-200 font-semibold">
              Custom PC
              </Link>
            </li>

          {/* Cart Icon */}
          {user && (
            <li className="relative hover:bg-violet-700 h-fit p-2 rounded-md">
              <Link to="/cart" className="flex items-center hover:text-yellow-300 transition duration-200">
                <i className="fa fa-shopping-cart fa-lg text-white"></i>
                <span className="ml-2 font-bold bg-red-500 text-white text-sm px-2 py-1 rounded-full">{cartCount}</span>
              </Link>
            </li>
          )}

          {/* User Dropdown */}
          {user ? (
         <div className="relative group">
         <button onClick={toggleDropdown} className="focus:outline-none" onBlur={() => setIsDropdownOpen(false)}>
           {user.profilePicture ? (
             <img
               src={`http://localhost:5000/images/${user.profilePicture}`}
               alt="Profile"
               className="w-10 h-10 object-contain rounded-full border-2 border-blue-500 bg-gray-200"
             />
           ) : (
             <div className="w-10 h-10 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200">
               <span className="text-md font-bold text-gray-600">
                 {user?.firstName?.charAt(0).toUpperCase()}
               </span>
             </div>
           )}
         </button>
       
         {/* Tooltip */}
         <span className="absolute -left-2/3 transform -translate-x-1/2 top-10 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           {user.firstName + " " + user.lastName}
         </span>
       


              {/* Animated Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 rounded-md shadow-xl w-48 z-10"
                  >
                    <div className="bg-white text-gray-800 rounded-md">
                      <Link to="/userProfile" className="block px-4 py-2 hover:bg-gray-100 transition">Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 transition">Orders</Link>
                      <button
                        onClick={() => {
                          sessionStorage.removeItem("clientUser");
                          setIsDropdownOpen(false);
                          navigate("/");
                          window.location.reload();
                        }}
                        className="block w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-t-none rounded-md transition"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <li>
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded font-bold mr-1 hover:bg-white hover:text-green-500 transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-yellow-500 transition">
                 Register
                  </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-2">
        <div className="mr-3">
        {user && (
            
            <Link to="/cart" className="flex items-center hover:text-yellow-300 transition duration-200">
              <i className="fa fa-shopping-cart fa-lg text-white"></i>
              <span className="ml-2 font-bold bg-red-500 text-white text-sm px-2 py-1 rounded-full">{cartCount}</span>
            </Link>

        )}
        </div>
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <ul className="text-center flex flex-col py-4 space-y-3">
              {["Home", "Shop Now", "About", "Contact"].map((item, index) => (
                <li key={index}>
                  <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`} className="block py-2 text-white hover:text-gray-200 transition">
                    {item}
                  </Link>
                </li>
              ))}

              {/* User Dropdown for Mobile */}
              {user ? (
                <div className="text-center">
                  <Link to="/userProfile" className="block px-4 py-2 text-white hover:text-gray-200 transition">
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("clientUser");
                      setIsDropdownOpen(false);
                      navigate("/");
                      window.location.reload();
                    }}
                    className="block w-full text-white bg-red-600 px-4 py-2 hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <li>
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded font-bold mr-1 hover:bg-white hover:text-green-500 transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-yellow-500 transition">
                 Register
                  </Link>
            </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
