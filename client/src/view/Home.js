/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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


const Home = () => {

  const [categories, setCategories] = useState([]);


  const images = {cpu, ram, storage, motherboard, gpu, psu};

  

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  return (
    <div className="bg-gray-100">
            {/* Hero Section */}
            <section className="relative flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold">Welcome to PC-World</h1>
                    <p className="mt-4 text-lg md:text-xl">Your one-stop shop for the latest PCs and accessories</p>
                    <Link
                        to="/shopnow"
                        className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            <div className="bg-gray-200 flex justify-center">
                {/* Category Slider Section */}
                <section className="py-12 px-5 md:px-10 text-center w-full max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">PC Parts</h2>
                    {categories.length > 0 ? (
                        <div className="relative">
                            {/* Swiper Component */}
                            <Swiper
                                modules={[Pagination, Autoplay, Navigation]}
                                spaceBetween={15}
                                slidesPerView={1}
                                breakpoints={{
                                    400: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                    1280: { slidesPerView: 4 },
                                }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                pagination={{ clickable: true }}
                                navigation={{
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                }}
                                className="mt-8 h-64 p-10" // Reduced height here
                            >
                                {categories.map((category, index) => {
                                    const imageKey = category.name.toLowerCase().replace(/\s+/g, "");
                                    const imageSrc = images[imageKey] || pcparts;

                                    return (
                                        <SwiperSlide key={index} className="flex justify-center items-center">
                                            <Link to={`/category?catname=${imageKey}`} className="w-full">
                                                <div className="bg-white shadow-md rounded-xl p-4 md:p-5 h-48 w-44 md:w-48 flex flex-col items-center transition hover:scale-105 hover:shadow-lg">
                                                    <img
                                                        src={imageSrc}
                                                        alt={category.name}
                                                        className="w-full h-32 object-contain rounded-md mb-1" // Reduced image height
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

                            {/* ... (Navigation Buttons) */}
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-4">Loading categories...</p>
                    )}
                </section>
            </div>



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
          We offer the best PC parts, PCs and accessories at unbeatable prices. Our team of experts ensures you get the
          perfect setup for your needs.
        </p>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6">
        <h2 className="text-3xl font-bold">Ready to Upgrade?</h2>
        <p className="mt-2 text-lg">Find the best PC for your needs today.</p>
        <Link
          to="/shopnow"
          className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Browse Products
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} PC-World. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
