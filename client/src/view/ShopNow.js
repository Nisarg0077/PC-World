import React, { useState, useMemo, useEffect } from "react";
import fetchProducts from "../components/Back_ShopNow";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterPanel from "./FilterPanel";
import queryString from 'query-string';

const ShopNow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [cartLoading, setCartLoading] = useState({});
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const catname = queryParams.get("catname") || "";
  // const searchFromViewProducts = queryParams.get("search") || "";
  

  const filteredParams = {};
  queryParams.forEach((value, key) => {
    if (value.trim()) {
      filteredParams[key] = value;
    }
  });
  
  console.log("Filtered Params:", filteredParams);
  
  const [filters, setFilters] = useState(() => ({
    category: filteredParams.category || catname || "",
    price: parseInt(filteredParams.price) || 1000000,
    brand: filteredParams.brand || "",
    cores: filteredParams.cores || "",
    threads: filteredParams.threads || "",
    baseClock: filteredParams.baseClock || "",
    boostClock: filteredParams.boostClock || "",
    cache: filteredParams.cache || "",
    vram: filteredParams.vram || "",
    vramType: filteredParams.vramType || "",
    memory: filteredParams.memory || "",
    speed: filteredParams.speed || "",
    type: filteredParams.type || "",
    size: filteredParams.size || "",
    storageCapacity: filteredParams.storageCapacity || "",
    storageInterface: filteredParams.storageInterface || "",
    rpm: filteredParams.rpm || "",
    ramCapacity: filteredParams.ramCapacity || "",
    motherboardBrand: filteredParams.motherboardBrand || "",
    socket: filteredParams.socket || "",
    formFactor: filteredParams.formFactor || "",
    memorySlots: filteredParams.memorySlots || "",
    wattage: filteredParams.wattage || "",
    efficiencyRating: filteredParams.efficiencyRating || "",
    modularity: filteredParams.modularity || "",
    switchType: filteredParams.switchType || "",
    layout: filteredParams.layout || "",
    keyCount: filteredParams.keyCount || "",
    backlit: filteredParams.backlit === "true" || false,
    dpi: filteredParams.dpi || "",
    buttons: filteredParams.buttons || "",
    weight: filteredParams.weight || "",
    sensorType: filteredParams.sensorType || "",
    connectivity: filteredParams.connectivity || "",
    hdrSupport: filteredParams.hdrSupport === "true" ? true : filteredParams.hdrSupport === "false" ? false : false,
    compatibility: Array.isArray(filteredParams.compatibility) ? filteredParams.compatibility : [],
    caseFormFactor: filteredParams.caseFormFactor || "", // ✅ Form Factor (ATX, MicroATX, etc.)
    casePsuSupport: filteredParams.casePsuSupport || "", // ✅ PSU Support (Yes/No)
    caseSize: filteredParams.caseSize || "",
  }));
  
  // console.log("Filters State:", filters);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchFromViewProducts = queryParams.get("search") || "";
  
    setSearch(searchFromViewProducts);
    setSearchQuery(searchFromViewProducts); // Ensure the input field updates
  }, [location.search]);  // Run whenever the URL changes
  
  
  useEffect(() => {
    const filtersFromViewProduct = location.state?.filters;
    // console.log(filtersFromViewProduct)
    if (filtersFromViewProduct) {
      setFilters(filtersFromViewProduct);
      // setSearchQuery(searchFromViewProducts)
      // Optional: Clear the state after using it
      navigate({ ...location, state: null });
    }
  }, [location.state]);

  // Initialize user and fetch products
  useEffect(() => {
    const storedUser = sessionStorage.getItem("clientUser");
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

  useEffect(() => {
    setFilters((prevFilters) => ({ ...prevFilters, category: catname || filteredParams.category }));
  }, [catname]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      toast.info("Please enter a search term.");
      return;
    }
    setSearch(searchQuery);
  };
  
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
        switchType,
        layout,
        keyCount,
        backlit,
        dpi,        
        buttons,    
        weight,     
        sensorType, 
        connectivity,
        screenSize,     
        resolution,     
        refreshRate,    
        panelType,      
        responseTime,   
        hdrSupport,     
        adaptiveSync,   
        ports,
        coolerType,
        fanSize,
        coolerRpm,
        compatibility = [],
        caseFormFactor,
        casePsuSupport,
        caseSize
      } = filters;

      const productSpecs = product.specifications || {};
      const productCpu = productSpecs.cpu || {};
      const productGpu = productSpecs.gpu || {};
      const productMotherboard = productSpecs.motherboard || {};
      const productStorage = productSpecs.storage || {};
      const productPsu = productSpecs.psu || {};
      const productRam = productSpecs.ram || {};
      const productKeyboard = productSpecs.keyboard || {};
      const productMouse = productSpecs.mouse || {};
      const productMonitor = productSpecs.monitor || {};
      const productCooler = productSpecs.cpuCooler || {};

      const productCase = product.specifications?.pcCase || {};


      const compatibilityString = product.specifications?.cpuCooler?.compatibility || "";
      const sockets = compatibilityString ? compatibilityString.split(",").map((s) => s.trim()) : []; // ✅ Ensure sockets is always an array
  
      const isIntel = sockets.some((socket) => socket.startsWith("LGA"));
      const isAMD = sockets.some((socket) => socket.startsWith("AM"));
      

      return (
        (!search.trim() || product.name.toLowerCase().includes(search.toLowerCase())) && // ✅ Allow empty search
        (!category || product.category.toLowerCase() === category.toLowerCase()) &&
        (!price || product.price <= price) &&
        (!brand || product.brand?.toLowerCase() === brand.toLowerCase()) &&
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
        (!storageInterface || productStorage.interface === storageInterface) &&
        (!rpm || String(productStorage.rpm) === String(rpm)) &&
        (!motherboardBrand || productMotherboard.manufacturer === motherboardBrand) &&
        (!socket ||
          (product.category === "cpu" && String(productCpu.socket) === String(socket)) ||
          (product.category === "motherboard" && String(productMotherboard.socket) === String(socket))) &&
        (!formFactor || productMotherboard.formFactor === formFactor) &&
        (!memorySlots || String(productMotherboard.memorySlots) === String(memorySlots)) &&
        (!wattage || String(productPsu.wattage) === String(wattage)) &&
        (!efficiencyRating || productPsu.efficiencyRating === efficiencyRating) &&
        (!modularity || productPsu.modularity === modularity) &&
        (!switchType || String(productKeyboard.switchType) === String(switchType)) &&
        (!layout || String(productKeyboard.layout) === String(layout)) &&
        (!keyCount || String(productKeyboard.keyCount) === String(keyCount)) &&
        (backlit === false || productKeyboard.backlit === Boolean(backlit)) && // ✅ Proper Boolean Check
        (!dpi || String(productMouse.dpi) === String(dpi)) &&
        (!buttons || String(productMouse.buttons) === String(buttons)) &&
        (!weight || String(productMouse.weight) === String(weight)) &&
        (!sensorType || String(productMouse.sensorType) === String(sensorType)) &&
        (!connectivity || String(productMouse.connectivity) === String(connectivity)) &&
        (!screenSize || String(productMonitor.screenSize) === String(screenSize)) &&
        (!resolution || String(productMonitor.resolution) === String(resolution)) &&
        (!refreshRate || String(productMonitor.refreshRate) === String(refreshRate)) &&
        (!panelType || String(productMonitor.panelType) === String(panelType)) &&
        (!responseTime || String(productMonitor.responseTime) === String(responseTime)) &&
        (hdrSupport === false || productMonitor.hdrSupport === (typeof hdrSupport === 'boolean' ? hdrSupport : hdrSupport === 'true'))&& // ✅ Boolean Fix
        (!adaptiveSync || String(productMonitor.adaptiveSync) === String(adaptiveSync)) &&
        (!ports || ports.length === 0 || (Array.isArray(productMonitor.ports) && ports.every(port => productMonitor.ports.includes(port)))) &&
        (!coolerType || productCooler.coolerType?.toLowerCase() === coolerType.toLowerCase()) &&
        (!fanSize || String(productCooler.fanSize) === String(fanSize)) &&
        (!coolerRpm || String(productCooler.rpm) === String(coolerRpm)) &&
        (compatibility.length === 0 || 
          (compatibility.includes("Intel") && isIntel) || 
          (compatibility.includes("AMD") && isAMD)) &&
        (!caseFormFactor || productCase.formFactor?.toLowerCase() === caseFormFactor.toLowerCase())&&
        // (!caseSize || productCase.size?.toLowerCase() === caseSize.toLowerCase())
        (!caseSize || productCase.dimensions.trim() === caseSize.trim())


      );
    });
}, [search, products, filters]);

;

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
        filteredParams={filteredParams}
        onFilterChange={handleFilterChange}
      />

      <section className="flex-1 py-6 px-4">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search product"
            className="border border-gray-400 p-2 w-full max-w-md rounded-md"
            onChange={(e) => {
              setSearchQuery(e.target.value )
            }} // Update temporary search query
            value={searchQuery } // Bind to temporary search query
            aria-label="Search product"
          />
          <button
            className="bg-blue-600 p-2 px-4 mx-1 rounded-md text-white"
            onClick={handleSearch} // Trigger search on button click
            aria-label="Search"
          >
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Shop Our Best Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150"; // Fallback image
                  }}
                />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  ₹{Intl.NumberFormat('en-IN').format(product.price).toLocaleString()}
                </p>
                <div className="p-1 flex flex-col sm:flex-row justify-between gap-2 w-full">
                   <button
                     className={`px-2 py-2 rounded-md transition-all duration-200 w-full sm:w-1/2 text-sm font-semibold border-2 border-transparent ${
                       cartLoading[product._id]
                         ? "bg-gray-400 cursor-not-allowed text-white"
                         : "bg-purple-700 text-white hover:bg-white hover:text-purple-700 hover:border-purple-700"
                     }`}
                     onClick={() => handleAddToCart(product)}
                     disabled={cartLoading[product._id]}
                     aria-label="Add to cart"
                   >
                     {cartLoading[product._id] ? "Adding..." : "Add to Cart"}
                   </button>
                   <Link
                     to={{
                      pathname: `/viewProduct`,
                      search: `?pid=${product._id}&${queryString.stringify(filters)}&search=${search}`,
                      // state: { 
                      //   filteredData: JSON.stringify(filters),  // Pass the actual filters state
                      //   previousPath: location.pathname + location.search
                      // }
                    }}
                     className="px-2 py-2 rounded-md transition-all duration-200 w-full sm:w-1/2 text-sm font-semibold border-2 border-transparent bg-purple-700 text-white text-center hover:bg-white hover:text-purple-700 hover:border-purple-700"
                     aria-label="View product"
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