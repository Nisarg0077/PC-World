/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import pcparts from "../images/all-parts.jpg";
import prebuilt from "../images/Pre-Built.jpg";
import accessories from "../images/accessories.jpg";
import cpu from '../images/pcparts/cpu.png';
import gpu from '../images/pcparts/gpu.png';
import motherboard from '../images/pcparts/motherboard.jpg';
import ram from '../images/pcparts/ram.png';
import storage from '../images/pcparts/ssd.png';
import psu from '../images/pcparts/psu.jpg';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const images = { cpu, ram, storage, motherboard, gpu, psu };

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="flex justify-center items-center  bg-gray-100 px-4">
      <div className="overflow-hidden w-5/12 whitespace-nowrap py-2 text-center">
        <motion.div
          className="inline-block text-md font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
        >
          Welcome to PC-World, Your one-stop shop for the latest PCs and accessories
        </motion.div>
      </div>
    </div>
      <div className="bg-gray-200 flex-col justify-center p-4">
        <section className="relative py-12 px-5 md:px-10 text-center w-full max-w-7xl mx-auto">
          <div className="absolute inset-0 bg-white blur-xl opacity-20 pointer-events-none"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 relative z-10">PC Parts</h2>

          {categories.length > 0 ? (
            <div className="relative overflow-visible">
              <Swiper
                 modules={[Pagination, Autoplay, Navigation]}
                 spaceBetween={15}
                 slidesPerView={1}
                 breakpoints={{
                   320: { slidesPerView: 1 },
                   480: { slidesPerView: 2 },
                   768: { slidesPerView: 2 },
                   1024: { slidesPerView: 3 },
                   1280: { slidesPerView: 4 },
                 }}
                 autoplay={{ delay: 2500, disableOnInteraction: false }}
                 pagination={{ clickable: true }}
                 navigation={{
                   nextEl: ".swiper-button-next",
                   prevEl: ".swiper-button-prev",
                 }}
                 className="mt-10 h-64 p-4 sm:p-6 md:p-10"
              >
                {categories.map((category, index) => {
                  const imageKey = category.name.toLowerCase().replace(/\s+/g, "");
                  const imageSrc = images[imageKey] || pcparts;

                  return (
                    <SwiperSlide key={index} className="flex justify-center items-center">
                      <Link to={`/shopnow?catname=${imageKey}`} className="w-full">
                        <div className="bg-white shadow-md rounded-xl p-4 md:p-5 h-48 w-44 md:w-48 flex flex-col items-center transition hover:scale-105 hover:shadow-lg">
                          <img
                            src={imageSrc}
                            alt={category.name}
                            className="w-full h-32 object-contain rounded-md mb-1"
                          />
                          <h3 className="text-lg font-semibold text-gray-700">
                            {category.name}
                          </h3>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Navigation Buttons */}
              <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 md:p-2 cursor-pointer transition-all shadow-md -translate-x-4 sm:-translate-x-8 md:-translate-x-12 lg:-translate-x-16">
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
        </div>
        <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 md:p-2 cursor-pointer transition-all shadow-md translate-x-4 sm:translate-x-8 md:translate-x-12 lg:translate-x-16">
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
        </div>
        
            </div>
          ) : (
            <p className="text-gray-600 mt-4 relative z-10">Loading categories...</p>
          )}
        </section>
          <div className="px-8">
            <Link
                to="/shopnow"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold  hover:opacity-75 rounded-lg shadow-lg transition"
              >
                <p>Shop Now</p>
              </Link>
          </div>      
      </div>


      {/* About Us Section */}
      <section className="py-16 bg-white text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose PC-World?</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          We offer the best PC parts, PCs and accessories at unbeatable prices. Our team ensures you get the
          perfect setup for your needs.
        </p>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6">
        <h2 className="text-3xl font-bold">Ready to Upgrade?</h2>
        <p className="mt-2 text-lg">Find the best PC for your needs today.</p>
        <Link
          to="/shopnow"
          className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Browse Products
        </Link>
      </section> */}

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} PC-World. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;