import React, { useState, useEffect, useMemo } from "react";

const FilterPanel = ({ categories, category, products, filteredParams, onFilterChange }) => {
  console.log('from Filter Panel', filteredParams);
  
  const [filters, setFilters] = useState({
    category: filteredParams.category || category || "",
    price: Number(filteredParams.price) || 1000000,
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
    backlit: typeof filteredParams.backlit === "boolean" ? filteredParams.backlit : false, // ✅ Fixed Boolean Handling
    dpi: filteredParams.dpi || "",
    buttons: filteredParams.buttons || "",
    weight: filteredParams.weight || "",
    sensorType: filteredParams.sensorType || "",
    connectivity: filteredParams.connectivity || "",
    screenSize: filteredParams.screenSize || "",
    resolution: filteredParams.resolution || "",
    refreshRate: filteredParams.refreshRate || "",
    panelType: filteredParams.panelType || "",
    responseTime: filteredParams.responseTime || "",
    hdrSupport: filteredParams.hdrSupport === "true" ? true : filteredParams.hdrSupport === "false" ? false : false, // ✅ Ensure proper Boolean conversion
    adaptiveSync: filteredParams.adaptiveSync || "",
    ports: Array.isArray(filteredParams.ports) ? filteredParams.ports : [],
    coolerType: filteredParams.coolerType || "",
    fanSize: filteredParams.fanSize || "",
    coolerRpm: filteredParams.coolerRpm || "",
    compatibility: Array.isArray(filteredParams.compatibility) ? filteredParams.compatibility : [],
    caseFormFactor: filteredParams.caseFormFactor || "", // ✅ Form Factor (ATX, MicroATX, etc.)
    casePsuSupport: filteredParams.casePsuSupport || "", // ✅ PSU Support (Yes/No)
    caseSize: filteredParams.caseSize || "",
});

const [maxProductPrice, setMaxProductPrice] = useState(1000000);

  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => Number(p.price)));
      setMaxProductPrice(highestPrice);
      setFilters((prevFilters) => ({ ...prevFilters, price: Number(filteredParams.price) || highestPrice }));
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
        switchType:  "",
        layout: "",
        keyCount: "",
        backlit:false,
        dpi: "",
        buttons: "",
        weight: "",
        sensorType: "",
        connectivity: "",
        screenSize: "",
        resolution: "",
        refreshRate: "",
        panelType: "",
        responseTime: "",
        hdrSupport: false,
        adaptiveSync: "",
        ports: [],
        compatibility: [],
        
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
  const uniqueDPI = useMemo(() => getUniqueValues("mouse", "dpi"), [products]);
  const uniqueButtons = useMemo(() => getUniqueValues("mouse", "buttons"), [products]);
  const uniqueWeight = useMemo(() => getUniqueValues("mouse", "weight"), [products]);
  const uniqueSensorType = useMemo(() => getUniqueValues("mouse", "sensorType"), [products]);
  const uniqueConnectivity = useMemo(() => getUniqueValues("mouse", "connectivity"), [products]);
  const uniqueScreenSizes = useMemo(() => getUniqueValues("monitor", "screenSize"), [products]);
  const uniqueResolutions = useMemo(() => getUniqueValues("monitor", "resolution"), [products]);
  const uniqueRefreshRates = useMemo(() => getUniqueValues("monitor", "refreshRate"), [products]);
  const uniquePanelTypes = useMemo(() => getUniqueValues("monitor", "panelType"), [products]);
  const uniqueResponseTimes = useMemo(() => getUniqueValues("monitor", "responseTime"), [products]);
  const uniqueAdaptiveSync = useMemo(() => getUniqueValues("monitor", "adaptiveSync"), [products]);
  const availablePorts = ["HDMI", "DisplayPort", "USB-C", "DVI", "VGA"];

  const uniqueCpuBrands = useMemo(() => {
    const brands = new Set();
    
    products.forEach((product) => {
      const compatibilityString = product.specifications?.cpuCooler?.compatibility || "";
      const sockets = compatibilityString.split(",").map((s) => s.trim()); // ✅ Convert to array
  
      if (sockets.some((socket) => socket.startsWith("LGA"))) {
        brands.add("Intel"); // ✅ Detect Intel sockets
      }
      if (sockets.some((socket) => socket.startsWith("AM"))) {
        brands.add("AMD"); // ✅ Detect AMD sockets
      }
    });
  
    return Array.from(brands).sort(); // ✅ Return sorted list ["AMD", "Intel"]
  }, [products]);
  
  const uniqueCaseFormFactors = useMemo(() => {
    return [...new Set(products
      .filter((p) => p.category.toLowerCase() === "pc case" && p.specifications?.pcCase?.formFactor)
      .map((p) => p.specifications.pcCase.formFactor)
    )];
  }, [products]);
  
  
  
  // const uniqueCasePsuSupport = useMemo(() => {
  //   return ["Yes", "No"]; // ✅ Fixed values for PSU support
  // }, []);
  
  const uniqueCaseSizes = useMemo(() => {
    return [...new Set(products
      .filter((p) => p.category.toLowerCase() === "pc case" && p.specifications?.pcCase?.dimensions)
      .map((p) => p.specifications.pcCase.dimensions.trim()) // Normalize spacing
    )].sort(); // Sort for better UI
  }, [products]);
  
  
  
  
  

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
    <div className="bg-white p-4 shadow-md rounded-lg m-2 w-2/12 sm:w-11/12 md:w-2/12">
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

      {/* Keyboard Filters */}
{filters.category === "keyboard" && (
  <>
    <FilterSelect
      label="Switch Type"
      value={filters.switchType}
      options={getUniqueValues("keyboard", "switchType")}
      onChange={(e) => handleFilterChange("switchType", e.target.value)}
    />
    <FilterSelect
      label="Layout"
      value={filters.layout}
      options={getUniqueValues("keyboard", "layout")}
      onChange={(e) => handleFilterChange("layout", e.target.value)}
    />
    <FilterSelect
      label="Key Count"
      value={filters.keyCount}
      options={getUniqueValues("keyboard", "keyCount")}
      onChange={(e) => handleFilterChange("keyCount", e.target.value)}
    />

<div style={{ display: 'flex', alignItems: 'center' }}>
  <label style={{ marginRight: '10px' }}>Backlit:</label>
  <input
    type="checkbox"
    checked={filters.backlit}
    onChange={(e) => handleFilterChange("backlit", e.target.checked)}
  />
</div>
  </>
)}


{filters.category === "mouse" && (
        <>
          <FilterSelect
            label="DPI"
            value={filters.dpi}
            options={uniqueDPI}
            onChange={(e) => handleFilterChange("dpi", e.target.value)}
          />
          <FilterSelect
            label="Buttons"
            value={filters.buttons}
            options={uniqueButtons}
            onChange={(e) => handleFilterChange("buttons", e.target.value)}
          />
          <FilterSelect
            label="Weight"
            value={filters.weight}
            options={uniqueWeight}
            onChange={(e) => handleFilterChange("weight", e.target.value)}
          />
          <FilterSelect
            label="Sensor Type"
            value={filters.sensorType}
            options={uniqueSensorType}
            onChange={(e) => handleFilterChange("sensorType", e.target.value)}
          />
          <FilterSelect
            label="Connectivity"
            value={filters.connectivity}
            options={uniqueConnectivity}
            onChange={(e) => handleFilterChange("connectivity", e.target.value)}
          />
        </>
      )}

{filters.category === "monitor" && (
        <>
          <FilterSelect
            label="Screen Size"
            value={filters.screenSize}
            options={uniqueScreenSizes}
            onChange={(e) => handleFilterChange("screenSize", e.target.value)}
          />
          <FilterSelect
            label="Resolution"
            value={filters.resolution}
            options={uniqueResolutions}
            onChange={(e) => handleFilterChange("resolution", e.target.value)}
          />
          <FilterSelect
            label="Refresh Rate (Hz)"
            value={filters.refreshRate}
            options={uniqueRefreshRates}
            onChange={(e) => handleFilterChange("refreshRate", e.target.value)}
          />
          <FilterSelect
            label="Panel Type"
            value={filters.panelType}
            options={uniquePanelTypes}
            onChange={(e) => handleFilterChange("panelType", e.target.value)}
          />
          <FilterSelect
            label="Response Time (ms)"
            value={filters.responseTime}
            options={uniqueResponseTimes}
            onChange={(e) => handleFilterChange("responseTime", e.target.value)}
          />
          <FilterSelect
            label="Adaptive Sync"
            value={filters.adaptiveSync}
            options={uniqueAdaptiveSync}
            onChange={(e) => handleFilterChange("adaptiveSync", e.target.value)}
          />
        
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="hdrSupport"
              checked={filters.hdrSupport}
              onChange={(e) => handleFilterChange("hdrSupport", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hdrSupport" className="text-sm font-medium">
              HDR Support
            </label>
          </div>

          {/* Ports Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Ports</label>
            {availablePorts.map((port) => (
              <div key={port} className="flex items-center">
                <input
                  type="checkbox"
                  id={port}
                  name="ports"
                  value={port}
                  checked={filters.ports.includes(port)}
                  onChange={(e) => {
                    const selectedPorts = filters.ports.includes(port)
                      ? filters.ports.filter((p) => p !== port)
                      : [...filters.ports, port];
                    handleFilterChange("ports", selectedPorts);
                  }}
                  className="mr-2"
                />
                <label htmlFor={port}>{port}</label>
              </div>
            ))}
          </div>
        </>
      )}



{filters.category === "cpu cooler" && (() => {
  // ✅ Extract unique Fan Sizes & RPM values dynamically from products
  const uniqueFanSizes = [...new Set(products
    .filter((p) => p.category.toLowerCase() === "cpu cooler")
    .map((p) => p.specifications?.cpuCooler?.fanSize)
    .filter(Boolean)
  )].sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

  const uniqueRPMs = [...new Set(products
    .filter((p) => p.category.toLowerCase() === "cpu cooler")
    .map((p) => p.specifications?.cpuCooler?.rpm)
    .filter(Boolean)
  )].sort((a, b) => a - b);

  return (
    <>
      {/* Cooler Type */}
      <label className="block mt-4 text-sm font-medium">Cooler Type</label>
      <select
        className="w-full border p-2 rounded-md"
        value={filters.coolerType}
        onChange={(e) => handleFilterChange("coolerType", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Air">Air Cooler</option>
        <option value="Liquid">Liquid Cooler</option>
      </select>

      {/* Fan Size - Dynamic Dropdown */}
      <label className="block mt-4 text-sm font-medium">Fan Size (mm)</label>
      <select
        className="w-full border p-2 rounded-md"
        value={filters.fanSize}
        onChange={(e) => handleFilterChange("fanSize", e.target.value)}
      >
        <option value="">All Sizes</option>
        {uniqueFanSizes.length > 0 ? uniqueFanSizes.map((size) => (
          <option key={size} value={size}>{`${size}`}</option>
        )) : <option value="" disabled>No Sizes Available</option>}
      </select>

      {/* Fan Speed (RPM) - Dynamic Dropdown */}
      <label className="block mt-4 text-sm font-medium">Max Fan Speed (RPM)</label>
      <select
        className="w-full border p-2 rounded-md"
        value={filters.coolerRpm}
        onChange={(e) => handleFilterChange("coolerRpm", e.target.value)}
      >
        <option value="">All Speeds</option>
        {uniqueRPMs.length > 0 ? uniqueRPMs.map((rpm) => (
          <option key={rpm} value={rpm}>{`Up to ${rpm} RPM`}</option>
        )) : <option value="" disabled>No RPM Data</option>}
      </select>

      {/* Compatibility */}
      {/* <label className="block mt-4 text-sm font-medium">Compatible CPU Sockets</label>
      <input
        type="text"
        placeholder="E.g., LGA1700, AM5"
        className="w-full border p-2 rounded-md"
        value={filters.compatibility}
        onChange={(e) => handleFilterChange("compatibility", e.target.value)}
      /> */}
  
  <div className="block mt-4">
  <label className="text-sm font-medium">Compatible CPU Brands</label>
  <div className="flex items-center gap-4 mt-2">
    {["Intel", "AMD"].map((brand) => (
      <div key={brand} className="flex items-center">
        <input
          type="checkbox"
          id={brand}
          value={brand}
          checked={Array.isArray(filters.compatibility) && filters.compatibility.includes(brand)} // ✅ Safe check
          onChange={(e) => {
            let updatedBrands = Array.isArray(filters.compatibility) ? [...filters.compatibility] : []; // ✅ Ensure it's an array

            if (e.target.checked) {
              updatedBrands.push(brand);
            } else {
              updatedBrands = updatedBrands.filter((b) => b !== brand);
            }

            handleFilterChange("compatibility", updatedBrands);
          }}
          className="mr-2"
        />
        <label htmlFor={brand}>{brand}</label>
      </div>
    ))}
  </div>
  

</div>





    </>
  );
})()}

{filters.category === "PC Case" && (
  <>
    <FilterSelect
      label="Form Factor"
      value={filters.caseFormFactor}
      options={uniqueCaseFormFactors}
      onChange={(e) => handleFilterChange("caseFormFactor", e.target.value)}
    />

    <FilterSelect
      label="Case Size"
      value={filters.caseSize}
      options={uniqueCaseSizes}
      onChange={(e) => handleFilterChange("caseSize", e.target.value)}
    />
  </>
)}



    </div>
  );
};

export default FilterPanel;