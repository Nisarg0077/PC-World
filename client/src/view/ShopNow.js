import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import fetchProducts from "../components/Back_ShopNow";
import { Link } from "react-router-dom";

const ShopNow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");  // Search term state
  const [filterData, setFilterData] = useState([]); // Filtered data state

  useEffect(() => {
    const getProducts = async () => {
      try {

        const data = await fetchProducts();
        setProducts(data);
        setFilterData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Handle the filtering logic when the search button is clicked
  const handleSearch = () => {
    if (search) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) // Filter products based on search term
      );
      setFilterData(filtered);
    } else {
      setFilterData(products); // If no search term, display all products
      
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <section className="py-12 px-6">
        <div>
          <input
            type="text"
            name="srcProd"
            id="srcProd"
            placeholder="Search product"
            className="border border-black p-2"
            onChange={(e) => setSearch(e.target.value)} // Update search term as the user types
            value={search}
          />
          <button
            className="bg-blue-600 p-2 ml-2 text-white"
            onClick={handleSearch} // Trigger search when button is clicked
          >
            Search
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Shop Our Best Products
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center">
              <div className="spinner-border animate-spin border-4 border-t-4 border-blue-600 rounded-full w-8 h-8"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 col-span-3">{error}</p>
          ) : filterData.length > 0 ? (
            filterData.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center justify-between"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-contain rounded-md"
                />
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Add to Cart
                </button>
                <Link  to={`/viewProduct?pid=${product._id}`} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  View Products
                </Link>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopNow;
