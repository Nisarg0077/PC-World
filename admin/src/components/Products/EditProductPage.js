import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const [image, setImage] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const pid = queryParams.get("pid");
 
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
        if (!fetchedData.specifications.psu) {
          fetchedData.specifications.psu = {};
        }
  
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
    const { name, value } = e.target;
    const category = productData.category.toLowerCase();
    setProductData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [category]: {
          ...prevData.specifications[category],
          [name]: value,
        },
      },
    }));
  };

  const handleConnectorChange = (e) => {
    const options = [...e.target.selectedOptions].map((option) => option.value);
    setProductData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        psu: {
          ...prevData.specifications.psu,
          connectors: options,
        },
      },
    }));
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

      const finalProductData = { ...productData, imageUrl };

      await axios.post(`http://localhost:5000/api/product/${pid}`, finalProductData);
      console.log("Data", finalProductData);
      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  const renderSpecificationFields = () => {
    const { category, specifications } = productData;
    if (!specifications[category]) return null;
    console.log(category);
    console.log(specifications);
    
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
            {["type", "interface", "capacity", "rpm"].map((field) => (
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

  // case "psu": // Ensure powerSupply is handled correctly
  //     return Object.keys(specifications[category]).map((field) => (
  //       <div key={field}>
  //         <label htmlFor={field} className="block font-medium mb-2">
  //           {field.charAt(0).toUpperCase() + field.slice(1)}
  //         </label>
  //         <input
  //           type="text"
  //           id={field}
  //           name={field}
  //           value={specifications[category]?.[field] || ""}
  //           onChange={handleSpecificationChange}
  //           placeholder={`Enter ${field}`}
  //           className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         />
  //       </div>
  //     ));


        

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
       <ToastContainer />
 
       <div className="flex flex-1 overflow-hidden">
         
           <Sidebar />
         <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
           <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Save Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProductPage;
