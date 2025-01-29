/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to='/' className="text-2xl font-bold text-white">
          PC-World
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-white">
          <li><Link to='/' className="hover:text-yellow-300 transition">Home</Link></li>
          <li><Link to="#" className="hover:text-yellow-300 transition">About</Link></li>
          <li><Link to="#" className="hover:text-yellow-300 transition">Services</Link></li>
          <li><Link to="#" className="hover:text-yellow-300 transition">Contact</Link></li>
          <li><Link to="#" className="bg-green-500 p-2 rounded font-bold hover:text-green-500 hover:font-bold hover:bg-white transition">Login</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu with smooth animation */}
      <div
        className={`absolute top-14 left-0 w-full bg-white transition-all ${
          isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <ul className="md:hidden text-center py-4 space-y-3 bg-gradient-to-r from-blue-600 to-purple-600 ">
        <li><a href="#" className="block py-2 text-white hover:text-gray-200 transition">Home</a></li>
        <li><a href="#" className="block py-2 text-white hover:text-gray-200 transition">About</a></li>
        <li><a href="#" className="block py-2 text-white hover:text-gray-200 transition">Services</a></li>
        <li><a href="#" className="block py-2 text-white hover:text-gray-200 transition">Contact</a></li>
        <li><a href="#" className="bg-green-500 font-bold text-white p-2 rounded hover:text-green-500 hover:font-bold hover:bg-white transition">Login</a></li>
        </ul>

      </div>
    </nav>
  );
}
