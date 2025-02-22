import React, { useState, useEffect, useMemo } from "react";

const FilterPanel = ({ categories, category, products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: category || "",
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
    ramCapacity: "",
    speed: "",
    storageCapacity: "",
    storageInterface: "", // Renamed from 'interface'
    rpm: "",
    type: "",
    size: "",
    motherboardBrand: "",
    socket: "",
    formFactor: "",
    memorySlots: "",
    wattage: "",
    efficiencyRating: "",
    modularity: "",
  });

  const [maxProductPrice, setMaxProductPrice] = useState(1000000);

  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => Number(p.price)));
      setMaxProductPrice(highestPrice);
      setFilters((prevFilters) => ({ ...prevFilters, price: highestPrice }));
    }
  }, [products]);

  const handleFilterChange = (filterName, value) => {
    let updatedFilters = { ...filters, [filterName]: value };

    if (filterName === "category") {
      updatedFilters = {
        category: value,
        price: maxProductPrice,
        brand: "",
        cores: "",
        threads: "",
        baseClock: "",
        boostClock: "",
        cache: "",
        vram: "",
        vramType: "",
        memory: "",
        ramCapacity: "",
        speed: "",
        storageCapacity: "",
        storageInterface: "", // Reset storageInterface filter
        rpm: "",
        type: "",
        size: "",
        motherboardBrand: "",
        socket: "",
        formFactor: "",
        memorySlots: "",
        wattage: "",
        efficiencyRating: "",
        modularity: "",
      };
    }

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Get unique values for a specific key in the current category
  const getUniqueValues = (category, key) => {
    const uniqueValues = new Set();
    products.forEach((product) => {
      if (product.category !== category) return;
      if (key === "brand") {
        if (product.brand) uniqueValues.add(product.brand);
      } else {
        const categorySpecs = product.specifications?.[category];
        if (categorySpecs && categorySpecs[key] !== undefined) {
          uniqueValues.add(categorySpecs[key]);
        }
      }
    });
    return Array.from(uniqueValues).filter((value) => value !== undefined);
  };

  // Get unique socket values for both CPU and Motherboard
  const getUniqueSockets = () => {
    const sockets = new Set();
    products.forEach((product) => {
      if (product.category === "cpu" && product.specifications?.cpu?.socket) {
        sockets.add(product.specifications.cpu.socket);
      } else if (
        product.category === "motherboard" &&
        product.specifications?.motherboard?.socket
      ) {
        sockets.add(product.specifications.motherboard.socket);
      }
    });
    return Array.from(sockets).filter((value) => value !== undefined);
  };

  // Get unique capacity values for RAM and Storage
  const getUniqueCapacity = (category) => {
    const capacity = new Set();
    products.forEach((product) => {
      if (product.category === category && product.specifications?.[category]?.capacity) {
        capacity.add(product.specifications[category].capacity);
      }
    });
    return Array.from(capacity).filter((value) => value !== undefined);
  };

  // Memoized unique values
  const uniqueBrands = useMemo(() => getUniqueValues(filters.category, "brand"), [filters.category, products]);
  const uniqueSockets = useMemo(() => getUniqueSockets(), [products]);
  const uniqueRamCapacities = useMemo(() => getUniqueCapacity("ram"), [products]);
  const uniqueStorageCapacities = useMemo(() => getUniqueCapacity("storage"), [products]);

  // Reusable FilterSelect component
  const FilterSelect = ({ label, value, options, onChange }) => (
    <>
      <label className="block mt-4 text-sm font-medium">{label}</label>
      <select
        className="w-full border p-2 rounded-md"
        value={value}
        onChange={onChange}
      >
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <div className="bg-white p-4 shadow-md rounded-lg m-2 w-2/12">
      <h3 className="text-lg font-semibold mb-2">Filter Products</h3>

      {/* Category Filter */}
      <label className="block mb-2 text-sm font-medium">Category</label>
      <select
        className="w-full border p-2 rounded-md"
        value={filters.category}
        onChange={(e) => handleFilterChange("category", e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Filter */}
      <label className="block mt-4 mb-2 text-sm font-medium">
        Max Price: ₹{filters.price}
      </label>
      <input
        type="range"
        min="100"
        max={maxProductPrice}
        value={filters.price}
        onChange={(e) => handleFilterChange("price", Number(e.target.value))}
        className="w-full"
      />

      {/* Brand Filter */}
      {filters.category && (
        <FilterSelect
          label="Brand"
          value={filters.brand}
          options={uniqueBrands}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
        />
      )}

      {/* Socket Filter */}
      {(filters.category === "cpu" || filters.category === "motherboard") && (
        <FilterSelect
          label="Socket"
          value={filters.socket}
          options={uniqueSockets}
          onChange={(e) => handleFilterChange("socket", e.target.value)}
        />
      )}

      {/* Capacity Filter for RAM */}
      {filters.category === "ram" && (
  <FilterSelect
    label="Capacity (GB)"
    value={filters.ramCapacity}
    options={uniqueRamCapacities.map((capacity) => `${capacity} GB`)} // Append "GB" to each value
    onChange={(e) => {
      const value = e.target.value.replace(" GB", ""); // Remove "GB" before updating state
      handleFilterChange("ramCapacity", value);
    }}
  />
)}

{/* Capacity Filter for Storage */}
{filters.category === "storage" && (
  <FilterSelect
    label="Capacity (GB)"
    value={filters.storageCapacity}
    options={uniqueStorageCapacities.map((capacity) => `${capacity} GB`)} // Append "GB" to each value
    onChange={(e) => {
      const value = e.target.value.replace(" GB", ""); // Remove "GB" before updating state
      handleFilterChange("storageCapacity", value);
    }}
  />
)}

      {/* CPU Filters */}
      {filters.category === "cpu" && (
        <>
          <FilterSelect
            label="Cores"
            value={filters.cores}
            options={getUniqueValues("cpu", "cores")}
            onChange={(e) => handleFilterChange("cores", e.target.value)}
          />
          <FilterSelect
            label="Threads"
            value={filters.threads}
            options={getUniqueValues("cpu", "threads")}
            onChange={(e) => handleFilterChange("threads", e.target.value)}
          />
          <FilterSelect
            label="Base Clock (MHz)"
            value={filters.baseClock}
            options={getUniqueValues("cpu", "baseClock")}
            onChange={(e) => handleFilterChange("baseClock", e.target.value)}
          />
          <FilterSelect
            label="Boost Clock (GHz)"
            value={filters.boostClock}
            options={getUniqueValues("cpu", "boostClock")}
            onChange={(e) => handleFilterChange("boostClock", e.target.value)}
          />
          <FilterSelect
            label="Cache (MB)"
            value={filters.cache}
            options={getUniqueValues("cpu", "cache")}
            onChange={(e) => handleFilterChange("cache", e.target.value)}
          />
        </>
      )}

      {/* GPU Filters */}
      {filters.category === "gpu" && (
        <>
          <FilterSelect
            label="VRAM"
            value={filters.vram}
            options={getUniqueValues("gpu", "vram")}
            onChange={(e) => handleFilterChange("vram", e.target.value)}
          />
          <FilterSelect
            label="VRAM Type"
            value={filters.vramType}
            options={getUniqueValues("gpu", "vramType")}
            onChange={(e) => handleFilterChange("vramType", e.target.value)}
          />
        </>
      )}

      {/* RAM Filters */}
      {filters.category === "ram" && (
        <FilterSelect
          label="Memory Speed"
          value={filters.speed}
          options={getUniqueValues("ram", "speed")}
          onChange={(e) => handleFilterChange("speed", e.target.value)}
        />
      )}

      {/* Motherboard Filters */}
      {filters.category === "motherboard" && (
        <FilterSelect
          label="Form Factor"
          value={filters.formFactor}
          options={getUniqueValues("motherboard", "formFactor")}
          onChange={(e) => handleFilterChange("formFactor", e.target.value)}
        />
      )}

      {/* Storage Filters */}
      {filters.category === "storage" && (
        <>
          <FilterSelect
            label="Storage Type"
            value={filters.type}
            options={getUniqueValues("storage", "type")}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          />
          <FilterSelect
            label="Storage Speed"
            value={filters.rpm}
            options={getUniqueValues("storage", "rpm")}
            onChange={(e) => handleFilterChange("rpm", e.target.value)}
          />
          <FilterSelect
            label="Interface"
            value={filters.storageInterface}
            options={getUniqueValues("storage", "interface")}
            onChange={(e) => handleFilterChange("storageInterface", e.target.value)}
          />
        </>
      )}

      {/* PSU Filters */}
      {filters.category === "psu" && (
        <>
          <FilterSelect
            label="Wattage"
            value={filters.wattage}
            options={getUniqueValues("psu", "wattage")}
            onChange={(e) => handleFilterChange("wattage", e.target.value)}
          />
          <FilterSelect
            label="Efficiency Rating"
            value={filters.efficiencyRating}
            options={getUniqueValues("psu", "efficiencyRating")}
            onChange={(e) => handleFilterChange("efficiencyRating", e.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default FilterPanel;