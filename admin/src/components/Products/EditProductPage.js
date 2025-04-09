import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams  } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const [brands, setBrands] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    specifications: {},
  });
  
  const [specifications, setSpecifications] = useState({
    cpuCooler: {
      coolerType: "",
      fanSize: "",
      rpm: "",
      compatibility: "",
      dimensions: "",
      weight: "",
    },
  });
  
  

  const [image, setImage] = useState(null);
  const availablePorts = ['HDMI', 'DisplayPort', 'USB-C', 'DVI', 'VGA'];

  const queryParams = new URLSearchParams(location.search);
  const pid = queryParams.get("pid");
  const prevPage = queryParams.get("page");
//  console.log(prevPage);
 
  useEffect(() => {
    if (!pid) {
      toast.error("Product ID is missing");
      navigate("/products");
      return;
    }
  
    const AdminUser = sessionStorage.getItem("AdminUser");
    if (!AdminUser) {
      navigate("/login");
      return;
    }
  
    axios
      .get(`http://localhost:5000/api/product/${pid}`)
      .then((res) => {
        const fetchedData = res.data;
        
        // Ensure powerSupply exists in specifications
         setProductData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data");
      });
  
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/brands");
        setBrands(response.data);
      } catch (error) {
        toast.error("Failed to fetch brands");
      }
    };
    fetchBrands();
  }, [pid, navigate]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
      
    }));
  };


  const handleSpecificationChange = (e) => {
    const { name, type, checked, value } = e.target;
    const category = productData.category?.toLowerCase();
  
    if (!category) return;
  
    setProductData((prevData) => {
      let updatedSpecifications = { ...prevData.specifications };
  
      if (category === "prebuilt") {
        updatedSpecifications["preBuilt"] = {
          ...(updatedSpecifications["preBuilt"] || {}),
          [name]: type === "checkbox" ? checked : value,
        };
      } else if (category === "pc case") {
        updatedSpecifications["pcCase"] = {
          ...(updatedSpecifications["pcCase"] || {}),
          [name]: type === "checkbox" ? checked : value,
        };
      } else if (category === "cpu cooler") {
        updatedSpecifications["cpuCooler"] = {
          ...(updatedSpecifications["cpuCooler"] || {}),
          [name]: type === "checkbox" ? checked : value,
        };
      } else {
        // General case
        updatedSpecifications[category] = {
          ...(updatedSpecifications[category] || {}),
          [name]: type === "checkbox" ? checked : value,
        };
      }
  
      return {
        ...prevData,
        specifications: updatedSpecifications,
      };
    });
  };
  






const handleConnectorChange = (e) => {
  const options = [...e.target.selectedOptions].map((option) => option.value);

  setProductData((prevData) => {
    // Destructure existing specifications
    let updatedSpecifications = { ...prevData.specifications };

   

    // Only update PSU specifications if the product is a PSU
    if (prevData.category === "PSU") {
      updatedSpecifications = {
        ...updatedSpecifications,
        psu: {
          ...updatedSpecifications.psu,
          connectors: options,
        },
      };
    } else {
      // Remove `psu` if it's incorrectly added to other products
      delete updatedSpecifications.psu;
    }

    return {
      ...prevData,
      specifications: updatedSpecifications,
    };
  });
};


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = productData.imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        

        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      // const finalProductData = { ...productData, imageUrl };
      const cleanSpecifications = Object.entries(productData.specifications).reduce(
        (acc, [key, value]) => {
          if (Object.keys(value).length > 0) {
            acc[key] = value;
          }
          return acc;
        }, {}
      );
  
      const finalProductData = { 
        ...productData, 
        specifications: cleanSpecifications,
        imageUrl 
      };

      await axios.post(`http://localhost:5000/api/product/${pid}`, finalProductData);
      // console.log("Data", finalProductData);
      alert("Product updated successfully!");
      navigate(`/products?page=${prevPage}`);
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };
  const handleBack = () => {
    navigate(`/products?page=${prevPage}`);
  }
  const renderSpecificationFields = () => {
    const { category, specifications } = productData;
    if (!specifications || !category) return null;
    
    
    switch (category) {
      case "cpu":
        return (
          <>
            {["manufacturer", "model", "cores", "threads", "baseClock", "boostClock", "socket", "cache"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input type="text" id={field} name={field} value={specifications.cpu?.[field] || ""} onChange={handleSpecificationChange} className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </>
        );

      case "gpu":
        return (
          <>
            {["manufacturer", "model", "vram", "vramType", "coreClock", "memoryClock", "interface"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input type="text" id={field} name={field} value={specifications.gpu?.[field] || ""} onChange={handleSpecificationChange} className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </>
        );

      case "ram":
        return (
          <>
            {["type", "speed", "capacity", "modules", "casLatency"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input type="text" id={field} name={field} value={specifications.ram?.[field] || ""} onChange={handleSpecificationChange} className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </>
        );

      case "storage":
        return (
          <>
            {["type", "interface", "capacity", "speed"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input type="text" id={field} name={field} value={specifications.storage?.[field] || ""} onChange={handleSpecificationChange} className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </>
        );
      case "motherboard":
        return (
          <>
            {/* {["type", "interface", "capacity", "rpm"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input type="text" id={field} name={field} value={specifications.storage?.[field] || ""} onChange={handleSpecificationChange} className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))} */}
            {['manufacturer', 'socket', 'chipset', 'formFactor', 'memorySlots', 'storageInterfaces'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={specifications.motherboard[spec]}
                  onChange={handleSpecificationChange}
                  placeholder={`Enter ${spec}`}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </>
        );
        case "psu":
          return (
            <>
              <div>
                <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={productData.brand || ""}
                  onChange={handleChange}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </div>

        {/* Ensure powerSupply exists before accessing */}
        {["wattage", "efficiencyRating"].map((spec) => (
          <div key={spec}>
            <label htmlFor={spec} className="block font-medium mb-2">
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </label>
            <input
              type="text"
              id={spec}
              name={spec}
              value={specifications?.psu?.[spec] || ""}
              onChange={handleSpecificationChange}
              placeholder={`Enter ${spec}`}
              required
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Modular PSU */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="modular"
            name="modular"
            checked={!!specifications?.psu?.modular} // Ensure it's always a boolean
            onChange={(e) =>
              handleSpecificationChange({
                target: { name: "modular", value: e.target.checked },
              })
            }
            className="mr-2"
          />
          <label htmlFor="modular" className="font-medium">Modular PSU</label>
        </div>

        {/* Connectors */}
        <div>
          <label className="block font-medium mb-2">Connectors</label>
          <select multiple onChange={handleConnectorChange} className="border rounded px-4 py-2 w-full">
            {["24-pin ATX", "8-pin CPU", "6+2-pin PCIe", "SATA", "Molex"].map((conn) => (
              <option key={conn} value={conn}>
                {conn}
              </option>
            ))}
          </select>
        </div>
      </>
  );
  case "keyboard":
  return (
    <>
      {["switchType", "layout", "keyCount"].map((spec) => (
        <div key={spec}>
          <label htmlFor={spec} className="block font-medium mb-2">
            {spec.charAt(0).toUpperCase() + spec.slice(1)}
          </label>
          <input
            type={spec === "keyCount" ? "number" : "text"}
            id={spec}
            name={spec}
            value={specifications.keyboard[spec] || ""}
            onChange={handleSpecificationChange}
            placeholder={`Enter ${spec}`}
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <div className="mt-2 flex items-center space-x-2">
        <input
          type="checkbox"
          id="backlit"
          name="backlit"
          checked={!!specifications?.keyboard?.backlit} // Ensure it's always a boolean
            onChange={(e) =>
              handleSpecificationChange({
                target: { name: "backlit", value: e.target.checked },
              })
            }
          className="h-5 w-5 text-blue-600"
        />
        <label htmlFor="backlit" className="font-medium">
          Backlit
        </label>
      </div>
    </>
  );
  case "mouse":
    return(
      <>
        {['dpi', 'buttons', 'weight'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="number"
                  id={spec}
                  name={spec}
                  value={specifications.mouse[spec]}
                  onChange={handleSpecificationChange}
                  placeholder={`Enter ${spec}`}
                  required={spec !== 'weight'}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label htmlFor="sensorType" className="block font-medium mb-2">Sensor Type</label>
              <select
                id="sensorType"
                name="sensorType"
                value={specifications.mouse.sensorType}
                onChange={handleSpecificationChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sensor Type</option>
                <option value="Optical">Optical</option>
                <option value="Laser">Laser</option>
                <option value="Trackball">Trackball</option>
              </select>
            </div>

            <div>
              <label htmlFor="connectivity" className="block font-medium mb-2">Connectivity</label>
              <select
                id="connectivity"
                name="connectivity"
                value={specifications.mouse.connectivity}
                onChange={handleSpecificationChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Connectivity</option>
                <option value="Wired">Wired</option>
                <option value="Wireless">Wireless</option>
                <option value="Bluetooth">Bluetooth</option>
              </select>
            </div>
      </>
    );
    case "monitor":
      return(
        <>
           <div>
                            <label htmlFor="screenSize" className="block font-medium mb-2">Screen Size (in inches)</label>
                            <input
                                type="text"
                                id="screenSize"
                                name="screenSize"
                                value={specifications.monitor.screenSize}
                                onChange={handleSpecificationChange}
                                placeholder="Enter screen size"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="resolution" className="block font-medium mb-2">Resolution</label>
                            <input
                                type="text"
                                id="resolution"
                                name="resolution"
                                value={specifications.monitor.resolution}
                                onChange={handleSpecificationChange}
                                placeholder="Enter resolution (e.g. 1920x1080)"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="refreshRate" className="block font-medium mb-2">Refresh Rate (Hz)</label>
                            <input
                                type="number"
                                id="refreshRate"
                                name="refreshRate"
                                value={specifications.monitor.refreshRate}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="panelType" className="block font-medium mb-2">Panel Type</label>
                            <input
                                type="text"
                                id="panelType"
                                name="panelType"
                                value={specifications.monitor.panelType}
                                onChange={handleSpecificationChange}
                                placeholder="Enter panel type (e.g. IPS, TN, VA)"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="responseTime" className="block font-medium mb-2">Response Time (ms)</label>
                            <input
                                type="number"
                                id="responseTime"
                                name="responseTime"
                                value={specifications.monitor.responseTime}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="hdrSupport" className="block font-medium mb-2">HDR Support</label>
                            <select
                                id="hdrSupport"
                                name="hdrSupport"
                                value={specifications.monitor.hdrSupport}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="adaptiveSync" className="block font-medium mb-2">Adaptive Sync</label>
                            <select
                                id="adaptiveSync"
                                name="adaptiveSync"
                                value={specifications.monitor.adaptiveSync}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="None">None</option>
                                <option value="G-Sync">G-Sync</option>
                                <option value="FreeSync">FreeSync</option>
                            </select>
                        </div>

                        <div>
                        <label className="block font-medium mb-2">Ports</label>
                        {availablePorts.map((port) => (
                            <div key={port} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={port}
                                    name="ports"
                                    value={port}
                                    checked={Array.isArray(specifications.monitor.ports) && specifications.monitor.ports.includes(port)}
                                    onChange={handleSpecificationChange}
                                    className="mr-2"
                                />
                                <label htmlFor={port}>{port}</label>
                            </div>
                        ))}
                    </div>
        </>
      );

      case 'PC Case':
    return (
        <>
        <div>
             {[
                'formFactor', 
                'material', 
                'dimensions', 
                'weight', 
                'fanSupport', 
                'radiatorSupport', 
                'gpuClearance', 
                'cpuCoolerClearance', 
                'psuSupport'
              ].map((spec) => (
                <div key={spec}>
                  <label htmlFor={spec} className="block font-medium mb-2">
                    {spec.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={['weight', 'gpuClearance', 'cpuCoolerClearance'].includes(spec) ? 'number' : 'text'}
                    id={spec}
                    name={spec}
                    value={specifications.pcCase[spec]}
                    onChange={handleSpecificationChange}
                    placeholder={`Enter ${spec.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    required
                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step={spec === 'weight' ? 0.1 : 1}
                  />
                </div>
              ))}
            </div>
        </>
    );
  

    case "cpu cooler":
  return (
    <>
      <div>
        <label htmlFor="coolerType" className="block font-medium mb-2">Cooler Type</label>
        <select
          id="coolerType"
          name="coolerType"
          value={specifications.cpuCooler?.coolerType || ""}
          onChange={handleSpecificationChange}
          required
          className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Cooler Type</option>
          <option value="Air">Air Cooler</option>
          <option value="Liquid">Liquid Cooler</option>
        </select>
      </div>

      {['fanSize', 'rpm', 'compatibility', 'dimensions', 'weight'].map((spec) => (
        <div key={spec}>
          <label htmlFor={spec} className="block font-medium mb-2">
            {spec.charAt(0).toUpperCase() + spec.slice(1)}
          </label>
          <input
            type="text"
            id={spec}
            name={spec}
            value={specifications.cpuCooler?.[spec] || ""}
            onChange={handleSpecificationChange}
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>
      ))}
    </>
  );

  case "preBuilt":
  return (
    <>
      {["cpu", "gpu", "ram", "storage", "motherboard", "psu", "case"].map((spec) => (
        <div key={spec}>
          <label htmlFor={spec} className="block font-medium mb-2">
            {spec.charAt(0).toUpperCase() + spec.slice(1)}
          </label>
          <input
            type="text"
            id={spec}
            name={spec}
            value={specifications["preBuilt"]?.[spec] || ""}
            onChange={handleSpecificationChange}
            placeholder={`Enter ${spec}`}
            className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </>
  );

      default:
        return null;
    }


   
  };

  return (
    <div className="h-screen flex flex-col">
       <ToastContainer />
 
       <div className="flex flex-1">
         
           <Sidebar />
         <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
           <div className="flex justify-between px-4 mb-2">
           <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
           <button className="bg-green-500 py-0 px-3 text-white rounded-md" onClick={handleBack}>Back</button>
           </div>
           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
             {['name', 'model', 'description', 'price', 'stock'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={productData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Render dynamic specification fields based on category */}
            {renderSpecificationFields()}

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-4">
    <button
      type="button"
      onClick={handleBack}
      className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
    >
      Back
    </button>
    
    <button
      type="submit"
      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
    >
      Save Changes
    </button>
  </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProductPage;
