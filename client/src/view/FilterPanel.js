import React, { useState, useEffect } from "react";

const FilterPanel = ({ categories, products, onFilterChange }) => {
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
        socket: "",
        formFactor: "",
        wattage: "",  
        efficiency: "", 
        modularity: "" 
    });

    const [maxProductPrice, setMaxProductPrice] = useState(1000000);

    useEffect(() => {
        if (products.length > 0) {
            const highestPrice = Math.max(...products.map((p) => Number(p.price)));
            setMaxProductPrice(highestPrice);
            setFilters(prevFilters => ({ ...prevFilters, price: highestPrice }));
        }
    }, [products]);

    const handleFilterChange = (filterName, value) => {
      let updatedFilters = { ...filters, [filterName]: value };
  
      // Reset brand when category changes
      if (filterName === "category") {
          updatedFilters = { ...updatedFilters, brand: "" };
      }
  
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
  };
  

  const getUniqueValues = (category, key) => {
    const uniqueValues = new Set();
    console.log("Category:", category, "Key:", key, "Found Brands:", Array.from(uniqueValues));

    products.forEach((product) => {
        if (key === "brand") {
            uniqueValues.add(product.brand); // Directly use brand from product
        } else {
            // Access category-specific specifications
            const categorySpecs = product.specifications?.[category];
            if (categorySpecs && categorySpecs[key]) {
                uniqueValues.add(categorySpecs[key]);
            }
        }
    });

    return Array.from(uniqueValues);
};

  
  

    return (
        <div className="bg-white p-4 shadow-md rounded-lg m-2 w-2/12">
            <h3 className="text-lg font-semibold mb-2">Filter Products</h3>

            {/* Category Filter */}
            <label className="block mb-2 text-sm font-medium">Category</label>
            <select className="w-full border p-2 rounded-md" value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>{category.toUpperCase()}</option>
                ))}
            </select>

            {/* Price Filter */}
            <label className="block mt-4 mb-2 text-sm font-medium">Max Price: ₹{filters.price}</label>
            <input
                type="range"
                min="100"
                max={maxProductPrice}
                value={filters.price}
                onChange={(e) => handleFilterChange("price", Number(e.target.value))}
                className="w-full"
            />

            {/* Brand Filter */}
            {/* {filters.category && (
    <>
        <label className="block mt-4 text-sm font-medium">Brand</label>
        <select
            className="w-full border p-2 rounded-md"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
        >
            <option value="">All Brands</option>
            {getUniqueValues(filters.category, "manufacturer").map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
            ))}
        </select>
    </>
)} */}
{/* Brand Filter */}
{/* Brand Filter */}
{filters.category && (
    <>
        <label className="block mt-4 text-sm font-medium">Brand</label>
        <select
            className="w-full border p-2 rounded-md"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
        >
            <option value="">All Brands</option>
            {getUniqueValues(filters.category, "manufacturer").map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
            ))}
        </select>
    </>
)}



            {/* CPU Filters */}
            {filters.category === "cpu" && (
                <>
                    <label className="block mt-4 text-sm font-medium">Cores</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.cores}
                        onChange={(e) => handleFilterChange("cores", e.target.value)}
                    >
                        <option value="">All Cores</option>
                        {getUniqueValues("cpu", "cores").map((cores) => (
                            <option key={cores} value={cores}>{cores}</option>
                        ))}
                    </select>
                </>
            )}

            {/* GPU Filters */}
            {filters.category === "gpu" && (
                <>
                    <label className="block mt-4 text-sm font-medium">VRAM</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.vram}
                        onChange={(e) => handleFilterChange("vram", e.target.value)}
                    >
                        <option value="">All VRAM Sizes</option>
                        {getUniqueValues("gpu", "vram").map((vram) => (
                            <option key={vram} value={vram}>{vram}</option>
                        ))}
                    </select>
                </>
            )}

            {/* RAM Filters */}
            {filters.category === "ram" && (
                <>
                    <label className="block mt-4 text-sm font-medium">Type</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.type}
                        onChange={(e) => handleFilterChange("type", e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="DDR3">DDR3</option>
                        <option value="DDR4">DDR4</option>
                        <option value="DDR5">DDR5</option>
                    </select>

                    <label className="block mt-4 text-sm font-medium">Size</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.size}
                        onChange={(e) => handleFilterChange("size", e.target.value)}
                    >
                        <option value="">All Sizes</option>
                        <option value="8">8GB</option>
                        <option value="16">16GB</option>
                        <option value="32">32GB</option>
                    </select>
                </>
            )}

            {/* Storage Filters */}
            {filters.category === "storage" && (
                <>
                    <label className="block mt-4 text-sm font-medium">Type</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.type}
                        onChange={(e) => {
                            console.log("Storage Type Selected:", e.target.value);
                            handleFilterChange("type", e.target.value);
                        }}
                    >
                        <option value="">All Types</option>
                        {getUniqueValues("storage", "type").map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <label className="block mt-4 text-sm font-medium">Capacity</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.capacity}
                        onChange={(e) => {
                            console.log("Storage Capacity Selected:", e.target.value);
                            handleFilterChange("capacity", e.target.value);
                        }}
                    >
                        <option value="">All Capacities</option>
                        {getUniqueValues("storage", "capacity").map((capacity) => (
                            <option key={capacity} value={capacity}>{capacity}</option>
                        ))}
                    </select>
                </>
            )}

            {/* Motherboard Filters */}
            {filters.category === "motherboard" && (
                <>
                    <label className="block mt-4 text-sm font-medium">Socket</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.socket}
                        onChange={(e) => handleFilterChange("socket", e.target.value)}
                    >
                        <option value="">All Sockets</option>
                        {getUniqueValues("motherboard", "socket").map((socket) => (
                            <option key={socket} value={socket}>{socket}</option>
                        ))}
                    </select>

                    <label className="block mt-4 text-sm font-medium">Form Factor</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={filters.formFactor}
                        onChange={(e) => handleFilterChange("formFactor", e.target.value)}
                    >
                        <option value="">All Form Factors</option>
                        {getUniqueValues("motherboard", "formFactor").map((formFactor) => (
                            <option key={formFactor} value={formFactor}>{formFactor}</option>
                        ))}
                    </select>
                </>
            )}

            {/* PSU Filters */}
{filters.category === "psu" && (
    <>
        <label className="block mt-4 text-sm font-medium">Wattage</label>
        <select
            className="w-full border p-2 rounded-md"
            value={filters.wattage}
            onChange={(e) => handleFilterChange("wattage", e.target.value)}
        >
            <option value="">All Wattages</option>
            {getUniqueValues("psu", "wattage").map((wattage) => (
                <option key={wattage} value={wattage}>{wattage}W</option>
            ))}
        </select>

        <label className="block mt-4 text-sm font-medium">Efficiency Rating</label>
        <select
            className="w-full border p-2 rounded-md"
            value={filters.efficiencyRating}
            onChange={(e) => handleFilterChange("efficiencyRating", e.target.value)}
        >
            <option value="">All Ratings</option>
            {getUniqueValues("psu", "efficiencyRating").map((rating) => (
                <option key={rating} value={rating}>{rating}</option>
            ))}
        </select>

        <label className="block mt-4 text-sm font-medium">Modular</label>
        <select
            className="w-full border p-2 rounded-md"
            value={filters.modular}
            onChange={(e) => handleFilterChange("modular", e.target.value)}
        >
            <option value="">All Types</option>
            <option value="true">Modular</option>
            <option value="false">Non-Modular</option>
        </select>
    </>
)}

        </div>
    );
};

export default FilterPanel;
