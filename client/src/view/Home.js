/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Navbar from "./Navbar";
import pcparts from "../images/all-parts.jpg";
import prebuilt from "../images/Pre-Built.jpg";
import accessories from "../images/accessories.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to PC-World</h1>
          <p className="mt-4 text-lg md:text-xl">Your one-stop shop for the latest PCs and accessories</p>
          <a
            href="#"
            className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            <Link to='/shopnow'> Shop Now</Link>
           
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* PC Parts */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <img src={pcparts} alt="PC Parts" className="w-full h-52 object-contain rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">PC Parts</h3>
            <p className="text-gray-600">All PC parts at one stop.</p>
            <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Learn More</a>
          </div>

          {/* Pre-Built PC */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <img src={prebuilt} alt="Pre-Built PC" className="w-full h-52 object-contain rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">Pre-Built PC</h3>
            <p className="text-gray-600">Ready-to-use PCs for every workflow.</p>
            <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Learn More</a>
          </div>

          {/* PC Accessories */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <img src={accessories} alt="Accessories" className="w-full h-52 object-contain rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">PC Accessories</h3>
            <p className="text-gray-600">Keyboards, mice, monitors, and more.</p>
            <a href="#" className="mt-4 inline-block text-blue-600 hover:underline">Learn More</a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-200 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose PC-World?</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          We offer the best PCs, laptops, and accessories at unbeatable prices. Our team of experts ensures you get the
          perfect setup for your needs.
        </p>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6">
        <h2 className="text-3xl font-bold">Ready to Upgrade?</h2>
        <p className="mt-2 text-lg">Find the best PC for your needs today.</p>
        <a
          href="#"
          className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Browse Products
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} PC-World. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;