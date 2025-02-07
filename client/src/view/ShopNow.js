import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import fetchProducts from "../components/Back_ShopNow";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopNow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user from sessionStorage
    const storedUser = sessionStorage.getItem("ClientUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch products
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilterData(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Search filtering (Auto-update)
  useEffect(() => {
    if (search) {
      setFilterData(products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFilterData(products);
    }
  }, [search, products]);

  // Function to add a product to the cart
  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartData = {
      customer: user.id,  // Ensure this is `user.id`
      product: product._id, // Directly passing product ID
      name: product.name,
      price: product.price,
      quantity: 1,
    };

    console.log("Adding to cart:", cartData); // Debugging request data

    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", cartData);
      console.log("Cart response:", response.data);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error.response?.data || error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <section className="py-12 px-6">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search product"
            className="border border-black p-2"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Shop Our Best Products
        </h2>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center col-span-3">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600 col-span-3">{error}</p>
          ) : filterData.length > 0 ? (
            filterData.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center justify-between"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-contain rounded-md"
                />
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <Link
                  to={`/viewProduct?pid=${product._id}`}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  View Product
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3">No products found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopNow;
