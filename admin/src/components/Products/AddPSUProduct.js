import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPSUProduct = () => {
  const navigate = useNavigate();
  const [psuData, setPSUData] = useState({
    name: "",
    category: "psu",
    brand: "",
    model: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    specifications: {
      psu: {
        brand: "",
        model: "",
        wattage: "",
        efficiencyRating: "",
        modular: false,
        connectors: [],
      },
    },
  });

  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null); // Image file state

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");
    if (!AdminUser) {
      navigate("/login");
    }
    fetchBrands();
  }, [navigate]);

  const fetchBrands = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/brands");
      setBrands(response.data);
    } catch (error) {
      toast.error("Failed to fetch brands");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPSUData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setPSUData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        psu: {
          ...prevData.specifications.psu,
          [name]: value,
        },
      },
    }));
  };

  const handleConnectorChange = (e) => {
    const options = [...e.target.selectedOptions].map((option) => option.value);
    setPSUData((prevData) => ({
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
    setImage(e.target.files[0]); // Store selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Upload image if a file is selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.imageUrl; // Get image URL from backend
      }

      // Add image URL to the product data
      const finalPSUData = { ...psuData, imageUrl };

      // Send the PSU data to the backend
      await axios.post("http://localhost:5000/api/productsin", finalPSUData);
      toast.success("PSU Product added successfully!");

      // Reset the form
      setPSUData({
        name: "",
        category: "psu",
        brand: "",
        model: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        specifications: {
          psu: {
            model: "",
            wattage: "",
            efficiencyRating: "",
            modular: false,
            connectors: [],
          },
        },
      });
      setImage(null);
    } catch (error) {
      toast.error("Failed to add PSU product.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add PSU Product</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {["name", "model", "description", "price", "stock"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={psuData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
              <select
                id="brand"
                name="brand"
                value={psuData.brand}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {["wattage", "efficiencyRating"].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={psuData.specifications.psu[spec]}
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
                checked={psuData.specifications.psu.modular}
                onChange={(e) =>
                  handleSpecificationChange({
                    target: { name: "modular", value: e.target.checked },
                  })
                }
                className="mr-2"
              />
              <label htmlFor="modular" className="font-medium">Modular PSU</label>
            </div>


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

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add PSU Product
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddPSUProduct;
