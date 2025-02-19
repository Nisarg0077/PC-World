import React, { useState, useMemo, useEffect } from "react";
import fetchProducts from "../components/Back_ShopNow";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterPanel from "./FilterPanel";

const ShopNow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [cartLoading, setCartLoading] = useState({});
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    price: 1000000,
    brand: "",
    cores: "",
    vram: "",
    memory: "",
    type: "",
    size: "",
    capacity: "",
    motherboardBrand: "",
    socket: "",
    formFactor: "",
    memorySlots: "",
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("ClientUser");
    if (storedUser) setUser(JSON.parse(storedUser));

    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setCategories([...new Set(data.map((p) => p.category))]);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
        const {
            category,
            price,
            brand,
            cores,
            vram,
            memory,
            size,
            capacity,
            motherboardBrand,
            socket,
            formFactor,
            memorySlots,
            storagetype,
            wattage,  
            efficiency, 
            modularity
        } = filters;

        const productMotherboard = product.specifications?.motherboard || {};
        const productGpu = product.specifications?.gpu || {};
        const productCpu = product.specifications?.cpu || {};
        const productStorage = product.specifications?.storage || {}; // Ensure storage exists
        const productPsu = product.specifications?.psu || {};

        const memorySlotsMatch =
            !memorySlots ||
            (Array.isArray(productMotherboard?.memorySlots)
                ? productMotherboard.memorySlots.map(String).includes(memorySlots)
                : String(productMotherboard?.memorySlots) === memorySlots);

        return (
            (search ? product.name.toLowerCase().includes(search.toLowerCase()) : true) &&
            (!category || product.category === category) &&
            product.price <= price &&
            (!brand || product.brand === brand) &&
            (!cores || String(productCpu?.cores) === String(cores)) &&
            (!vram || String(productGpu?.vram) === String(vram)) &&
            (!memory || product.memory === memory) &&
            (!size || product.size === size) &&
            (!capacity || String(productStorage?.capacity) === String(capacity)) && // Ensure storage capacity filter
            (!motherboardBrand || productMotherboard?.manufacturer === motherboardBrand) &&
            (!socket || productMotherboard?.socket === socket) &&
            (!formFactor || productMotherboard?.formFactor === formFactor) &&
            memorySlotsMatch &&
            (category === "storage"
                ? !storagetype || String(productStorage?.type) === String(storagetype) // Apply storage type filter only to storage category
                : true) && // Ignore storage type for other categories
            (!wattage || String(productPsu?.wattage) === String(wattage)) &&
            (!efficiency || productPsu?.efficiency === efficiency) &&
            (!modularity || productPsu?.modularity === modularity)
        );
    });
}, [search, products, filters]);

  

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
        imageUrl: product.image || product.imageUrl.replace("http://localhost:5000/images/", ""),
      });
      toast.success("Product added to cart successfully!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product.");
    } finally {
      setCartLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  if (loading) {
    return <div className="text-center animate-pulse">Loading Products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen p-4">
      <FilterPanel categories={categories} products={products} onFilterChange={handleFilterChange} />

      <section className="flex-1 py-6 px-4">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search product"
            className="border border-gray-400 p-2 w-full max-w-md rounded-md"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Shop Our Best Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg p-4 text-center flex flex-col items-center justify-between w-full"
              >
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-contain rounded-md"
                />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  ₹{Number(product.price).toLocaleString()}
                </p>

                <div className="p-1 flex flex-col sm:flex-row justify-between gap-2 w-full">
                  <button
                    className={`px-4 py-2 rounded-md transition w-full sm:w-1/2 text-sm text-white ${
                      cartLoading[product._id]
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={cartLoading[product._id]}
                  >
                    {cartLoading[product._id] ? "Adding..." : "Add to Cart"}
                  </button>
                  <Link
                    to={`/viewProduct?pid=${product._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center text-sm w-full sm:w-1/2"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No products found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopNow;