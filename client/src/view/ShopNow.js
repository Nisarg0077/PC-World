/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import fetchProducts from "../components/Back_ShopNow";

const ShopNow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };
    
    getProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Shop Our Best Products</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center">
              <div className="spinner-border animate-spin border-4 border-t-4 border-blue-600 rounded-full w-8 h-8"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 col-span-3">{error}</p>
          ) : (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center justify-between "
              >
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-52 object-contain rounded-md"
                />
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopNow;
