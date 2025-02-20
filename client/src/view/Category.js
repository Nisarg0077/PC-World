import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
const Category = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const catname = queryParams.get("catname");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cartLoading, setCartLoading] = useState({});

  useEffect(() => {
    const storedUser = sessionStorage.getItem("ClientUser");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (!catname) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getproducts/${catname}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [catname]);

  const handleAddToCart = async (product) => {
    if (!user) return toast.error("Please log in to add items to the cart.");

    setCartLoading((prev) => ({ ...prev, [product._id]: true }));

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        customerId: user.id,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl || "",
      });

      toast.success("Product added to cart successfully!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product.");
    } finally {
      setCartLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{catname ? catname : "Products"}</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(({ _id, imageUrl, name, price }) => (
            <div key={_id} className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center justify-between w-full">
              <img 
                src={imageUrl || "/placeholder.jpg"} 
                alt={name} 
                className="w-full h-48 object-contain rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold">{name}</h3>
              <p className="text-gray-600 font-medium">₹{price?.toFixed(2) ?? 'N/A'}</p>

              {/* Buttons */}
              <div className="p-1 flex flex-col sm:flex-row justify-between gap-2 w-full">
                <button
                    className={`px-4 py-2 rounded-md transition w-full sm:w-1/2 text-sm text-white ${
                    cartLoading[_id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => handleAddToCart({ _id, name, price, imageUrl })}
                    disabled={cartLoading[_id]}
                >
                    {cartLoading[_id] ? "Adding..." : "Add to Cart"}
                </button>
                <Link
                    to={`/viewProduct?pid=${_id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center text-sm w-full sm:w-1/2"
                >
                    View Product
                </Link>
            </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No products found</p>
      )}
    </div>
  );
};

export default Category;
