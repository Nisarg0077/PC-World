import React, { useState, useMemo, useEffect } from "react";
import fetchProducts from "../components/Back_ShopNow";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const catname = queryParams.get("catname") || "";

  const [filters, setFilters] = useState({
    category: catname || "",
    price: 1000000,
    brand: "",
    cores: "",
    threads: "",
    baseClock: "",
    boostClock: "",
    cache: "",
    vram: "",
    vramType: "",
    memory: "",
    speed: "",
    type: "",
    size: "",
    storageCapacity: "",
    storageInterface: "",
    rpm: "",
    ramCapacity: "",
    motherboardBrand: "",
    socket: "",
    formFactor: "",
    memorySlots: "",
    wattage: "",
    efficiencyRating: "",
    modularity: "",
  });

  // Initialize user and fetch products
  useEffect(() => {
    const storedUser = sessionStorage.getItem("ClientUser");
    if (storedUser) setUser(JSON.parse(storedUser));

    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setCategories([...new Set(data.map((p) => p.category))]);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Update filters when category changes
  useEffect(() => {
    setFilters((prevFilters) => ({ ...prevFilters, category: catname }));
  }, [catname]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const {
        category,
        price,
        brand,
        cores,
        threads,
        baseClock,
        boostClock,
        cache,
        vram,
        vramType,
        memory,
        speed,
        type,
        size,
        storageCapacity,
        rpm,
        storageInterface,
        ramCapacity,
        motherboardBrand,
        socket,
        formFactor,
        memorySlots,
        wattage,
        efficiencyRating,
        modularity,
      } = filters;

      const productSpecs = product.specifications || {};
      const productCpu = productSpecs.cpu || {};
      const productGpu = productSpecs.gpu || {};
      const productMotherboard = productSpecs.motherboard || {};
      const productStorage = productSpecs.storage || {};
      const productPsu = productSpecs.psu || {};
      const productRam = productSpecs.ram || {};

      return (
        (search ? product.name.toLowerCase().includes(search.toLowerCase()) : true) &&
        (!category || product.category === category) &&
        product.price <= price &&
        (!brand || product.brand === brand) &&
        (!cores || String(productCpu.cores) === String(cores)) &&
        (!threads || String(productCpu.threads) === String(threads)) &&
        (!baseClock || String(productCpu.baseClock) === String(baseClock)) &&
        (!boostClock || String(productCpu.boostClock) === String(boostClock)) &&
        (!cache || String(productCpu.cache) === String(cache)) &&
        (!vram || String(productGpu.vram) === String(vram)) &&
        (!vramType || productGpu.vramType === vramType) &&
        (!memory || product.memory === memory) &&
        (!speed || productRam.speed === speed) &&
        (!type || String(productStorage.type) === String(type)) &&
        (!size || product.size === size) &&
        (!ramCapacity || (product.category === "ram" && String(productSpecs.ram?.capacity) === String(ramCapacity))) &&
        (!storageCapacity || (product.category === "storage" && String(productSpecs.storage?.capacity) === String(storageCapacity))) &&
        // (!Interface || productStorage.interface === Interface) &&
        (!filters.storageInterface || productStorage.interface === filters.storageInterface)&&
        (!rpm || String(productStorage.rpm) === String(rpm)) &&
        (!motherboardBrand || productMotherboard.manufacturer === motherboardBrand) &&
        (!socket ||
          (product.category === "cpu" && String(productCpu.socket) === String(socket)) ||
          (product.category === "motherboard" && String(productMotherboard.socket) === String(socket))) &&
        (!formFactor || productMotherboard.formFactor === formFactor) &&
        (!memorySlots || String(productMotherboard.memorySlots) === String(memorySlots)) &&
        (!wattage || String(productPsu.wattage) === String(wattage)) &&
        (!efficiencyRating || productPsu.efficiencyRating === efficiencyRating) &&
        (!modularity || productPsu.modularity === modularity)
      );
    });
  }, [search, products, filters]);

  // Add product to cart
  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setCartLoading((prev) => ({ ...prev, [product._id]: true }));
    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        customerId: user.id,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image || product.imageUrl,
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
      <FilterPanel
        categories={categories}
        category={filters.category}
        products={products}
        onFilterChange={handleFilterChange}
      />

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