// import { FaMicrochip, FaMemory, FaHdd, FaBolt, FaDesktop, FaTools, FaExclamationTriangle } from "react-icons/fa"
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

const CustomBuild = () => {
  const { brand } = useParams(); // Get "intel" or "amd" from URL
  const [cpus, setCpus] = useState([]);
  const [components, setComponents] = useState({
    motherboards: [],
    gpus: [],
    rams: [],
    psus: [],
    storages: [],
    cases: [],
  });

  console.log(cpus)

  const [selectedParts, setSelectedParts] = useState({
    cpu: "",
    motherboard: "",
    gpu: "",
    ram: "",
    psu: "",
    storage: "",
    case: "",
  });

  // console.log(selectedParts);
  // console.log(components);
  
console.log(brand)
  const navigate = useNavigate();

  // Fetch CPUs first
  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/cpu/${brand}`)
      .then(res => setCpus(res.data))
      .catch(err => console.error("Error fetching CPUs:", err));
  }, [brand]);

  useEffect(() => {
    if (selectedParts.cpu) {
      const socket = selectedParts.cpu.specifications?.cpu?.socket;
      console.log("Selected CPU Socket:", socket); // ✅ Debugging
  
      if (socket) {
        axios.get(`http://localhost:5000/api/products/motherboard/${socket}`)
          .then(res => {
            console.log("Fetched Motherboards:", res.data); // ✅ Debugging
            setComponents(prev => ({ ...prev, motherboards: res.data || [] }));
          })
          .catch(err => console.error("Error fetching motherboards:", err));
      }
    }
  }, [selectedParts.cpu]);



  useEffect(() => {
    axios.get("http://localhost:5000/api/products/gpu")
      .then(res => {
        console.log("Fetched GPUs:", res.data); // ✅ Debugging
        setComponents(prev => ({ ...prev, gpus: res.data }));
      })
      .catch(err => console.error("Error fetching GPUs:", err));
  }, []);
  

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/ram")
      .then(res => {
        console.log("Fetched RAMs:", res.data); // ✅ Debugging
        setComponents(prev => ({ ...prev, rams: res.data || [] }));
      })
      .catch(err => console.error("Error fetching RAMs:", err));
  }, []);


  useEffect(() => {
    axios.get("http://localhost:5000/api/products/storage")
      .then(res => {
        console.log("Fetched Storage Devices:", res.data); // ✅ Debugging
        if (!res.data || res.data.length === 0) {
          console.warn("No storage devices found in API response!");
        }
        setComponents(prev => ({ ...prev, storages: res.data || [] }));
      })
      .catch(err => console.error("Error fetching storage devices:", err));
  }, []);
  

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/case")
      .then(res => {
        console.log("Fetched PC Cases:", res.data); // ✅ Debugging
        if (!res.data || res.data.length === 0) {
          console.warn("No PC Cases found in API response!");
        }
        setComponents(prev => ({ ...prev, cases: res.data || [] }));
      })
      .catch(err => console.error("Error fetching PC Cases:", err));
  }, []);


  useEffect(() => {
    axios.get("http://localhost:5000/api/products/psu")
      .then(res => {
        console.log("Fetched PSUs:", res.data); // ✅ Debugging
        if (!res.data || res.data.length === 0) {
          console.warn("No PSUs found in API response!");
        }
        setComponents(prev => ({ ...prev, psus: res.data || [] }));
      })
      .catch(err => console.error("Error fetching PSUs:", err));
  }, []);
  
  
  
const handleSelect = (type, event) => {
    const selectedId = event.target.value;
    console.log(`Selected ${type} ID:`, selectedId);
    console.log(`Available ${type} options:`, components[type]); // ✅ Debugging
  
    let selectedItem;
    if (type === "cpu") {
      selectedItem = cpus.find(cpu => cpu._id === selectedId);
    } else if (type === "motherboard" && components.motherboards.length > 0) {  
      selectedItem = components.motherboards.find(mobo => mobo._id === selectedId);
    } else if (type === "gpu" && components.gpus.length > 0) {  
      selectedItem = components.gpus.find(gpu => gpu._id === selectedId);
    } else if (type === "ram" && components.rams.length > 0) {  
      selectedItem = components.rams.find(ram => ram._id === selectedId);
    } else if (type === "storage" && components.storages.length > 0) {  
      selectedItem = components.storages.find(storage => storage._id === selectedId);
    }  else if (type === "case" && components.cases.length > 0) {  // ✅ Fix: Changed "PC Case" to "case"
        selectedItem = components.cases.find(pcCase => pcCase._id === selectedId); 
    }  else if (type === "psu" && components.psus.length > 0) {  // ✅ Fix: Changed "PC Case" to "case"
        selectedItem = components.psus.find(psu => psu._id === selectedId); 
    } else if (components[type] && Array.isArray(components[type])) {
      selectedItem = components[type].find(item => item._id === selectedId);
    }
  
    if (!selectedItem) {
      console.error(`No ${type} found for ID:`, selectedId);
      return;
    }
  
    console.log(`Selected ${type}:`, selectedItem); // ✅ Debugging: Check selection
  
    setSelectedParts(prev => ({ ...prev, [type]: selectedItem }));
  };
  
  const handleCheckout = () => {
    const selectedProducts = Object.values(selectedParts).filter(part => part !== ""); // Remove empty selections
  
    if (selectedProducts.length === 0) {
      alert("Please select at least one component before proceeding to checkout.");
      return;
    }
  
    console.log("✅ Selected Products:", selectedProducts); // Debugging
  
    navigate('/checkout', {
        state: { 
          checkoutType: 'customBuild',
          selectedProducts: selectedProducts,
          isCustomBuild: true

        }
      });
  };
  
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">

    <button 
            onClick={() => navigate("/custompc")} 
            className="mb-6 px-5 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
            ← Back to Custom PC
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">{brand.toUpperCase()} Custom Build</h1>

      {/* CPU Selection */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your {brand.toUpperCase()} CPU</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("cpu", e)}>
    <option value="">Select CPU</option>
    {cpus
      .filter(cpu => cpu.stock > 0)
      .map(cpu => (
        <option key={cpu._id} value={cpu._id}>
          {cpu.name} - ₹{cpu.price}
        </option>
      ))
    }
  </select>
</div>


      {/* Motherboard Selection (Appears After CPU is Selected) */}
      {selectedParts.cpu && (
  <div className="mb-6">
    <h2 className="text-xl font-semibold">Select a Compatible Motherboard</h2>
    <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("motherboard", e)}>
      <option value="">Select Motherboard</option>
      {components.motherboards
        .filter((mobo) => mobo.stock > 0) // Only show in-stock motherboards
        .map((mobo) => (
          <option key={mobo._id} value={mobo._id}>
            {mobo.name} - ₹{mobo.price}
          </option>
        ))}
    </select>
  </div>
)}


      {/* GPU Selection */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your GPU</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("gpu", e)}>
    <option value="">Select GPU</option>
    {components.gpus
      .filter(gpu => gpu.stock > 0)
      .map(gpu => (
        <option key={gpu._id} value={gpu._id}>
          {gpu.name} - ₹{gpu.price}
        </option>
      ))
    }
  </select>
</div>


      {/* RAM Selection */}
      <div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your RAM</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("ram", e)}>
    <option value="">Select RAM</option>
    {components.rams
      .filter(ram => ram.stock > 0)
      .map(ram => (
        <option key={ram._id} value={ram._id}>
          {ram.name} - {ram.capacity}GB - ₹{ram.price}
        </option>
      ))
    }
  </select>
</div>

{/* Storage Selection */}
{/* Storage Selection */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your Storage</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("storage", e)}>
    <option value="">Select Storage</option>
    {components.storages.filter(storage => storage.stock > 0).length > 0 ? (
      components.storages
        .filter((storage) => storage.stock > 0)
        .map((storage) => (
          <option key={storage._id} value={storage._id}>
            {storage.name} - {storage.specifications?.storage?.capacity}GB - {storage.specifications?.storage?.type} - ₹{storage.price}
          </option>
        ))
    ) : (
      <option disabled>No Storage Available</option>
    )}
  </select>
</div>

{/* PSU Selection */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your Power Supply Unit (PSU)</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("psu", e)}>
    <option value="">Select PSU</option>
    {components.psus.filter(psu => psu.stock > 0).length > 0 ? (
      components.psus
        .filter((psu) => psu.stock > 0)
        .map((psu) => (
          <option key={psu._id} value={psu._id}>
            {psu.name} - {psu.wattage} - {psu.efficiency} - ₹{psu.price}
          </option>
        ))
    ) : (
      <option disabled>No PSUs Available</option>
    )}
  </select>
</div>

{/* PC Case Selection */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Select Your PC Case</h2>
  <select className="w-full p-2 border rounded-md" onChange={(e) => handleSelect("case", e)}>
    <option value="">Select PC Case</option>
    {components.cases.filter(pcCase => pcCase.stock > 0).length > 0 ? (
      components.cases
        .filter((pcCase) => pcCase.stock > 0)
        .map((pcCase) => (
          <option key={pcCase._id} value={pcCase._id}>
            {pcCase.name} - {pcCase.specifications?.case?.formFactor} - ₹{pcCase.price}
          </option>
        ))
    ) : (
      <option disabled>No PC Cases Available</option>
    )}
  </select>
</div>








<div className="mt-8 p-6 border border-gray-300 rounded-xl bg-white shadow-xl">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-3 text-center uppercase tracking-wide">Selected Components</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    
    {/* CPU */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">CPU</h3>
      <p className={`text-lg font-medium ${selectedParts.cpu ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.cpu ? selectedParts.cpu.name : "Not selected"}
      </p>
    </div>

    {/* Motherboard */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">Motherboard</h3>
      <p className={`text-lg font-medium ${selectedParts.motherboard ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.motherboard ? selectedParts.motherboard.name : "Not selected"}
      </p>
    </div>

    {/* GPU */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">GPU</h3>
      <p className={`text-lg font-medium ${selectedParts.gpu ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.gpu ? selectedParts.gpu.name : "Not selected"}
      </p>
    </div>

    {/* RAM */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">RAM</h3>
      <p className={`text-lg font-medium ${selectedParts.ram ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.ram ? selectedParts.ram.name : "Not selected"}
      </p>
    </div>

    {/* Storage */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">Storage</h3>
      <p className={`text-lg font-medium ${selectedParts.storage ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.storage ? selectedParts.storage.name : "Not selected"}
      </p>
    </div>

    {/* PSU */}
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">Power Supply (PSU)</h3>
      <p className={`text-lg font-medium ${selectedParts.psu ? "text-green-700" : "text-red-500"}`}>
        {selectedParts.psu ? selectedParts.psu.name : "Not selected"}
      </p>
    </div>

    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
  <h3 className="text-lg font-semibold text-gray-800">PC Case</h3>
  <p className={`text-lg font-medium ${selectedParts.case ? "text-green-700" : "text-red-500"}`}>
    {selectedParts.case ? selectedParts.case.name : "Not selected"}
  </p>
</div>

    

  </div>

  {/* Warning for missing parts */}
  {Object.values(selectedParts).includes("") && (
    <div className="mt-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold">⚠️ Some components are missing!</h3>
      <p className="text-md">Please select all parts for a complete build.</p>
    </div>
  )}
</div>


<button 
  onClick={handleCheckout} 
  className="mt-6 px-5 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition w-full"
>
  Proceed to Checkout
</button>



    </div>
  );
};

export default CustomBuild;
