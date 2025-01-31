import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles



const AddGPUProduct = () => {
  const navigate = useNavigate();

  const [gpuData, setGpuData] = useState({
    name: '',
    category: 'gpu',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      gpu: {
        manufacturer: '',
        model: '',
        vram: '',
        vramType: '',
        coreClock: '',
        memoryClock: '',
        interface: '',
      },
    },
  });

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");
    if (!AdminUser) {
      navigate("/login");
    }
    fetchBrands();
  }, [navigate]);

  const fetchBrands = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/brands');
      setBrands(response.data);
    } catch (error) {
    //   console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGpuData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setGpuData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        gpu: {
          ...prevData.specifications.gpu,
          [name]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/productsin', gpuData);
      toast.success('GPU Product added successfully!');
      setGpuData({
        name: '',
        category: 'gpu',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          gpu: {
            manufacturer: '',
            model: '',
            vram: '',
            vramType: '',
            coreClock: '',
            memoryClock: '',
            interface: '',
          },
        },
      });
    } catch (error) {
    //   console.error('Error adding GPU product:', error);
      toast.error('Failed to add GPU product.');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
            <ToastContainer /> 
          <h1 className="text-2xl font-bold mb-4">Add GPU Product</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {['name', 'model', 'description', 'price', 'stock', 'imageUrl'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={gpuData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div>
              <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
              <select
                id="brand"
                name="brand"
                value={gpuData.brand}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            {['manufacturer', 'model', 'vram', 'vramType', 'coreClock', 'memoryClock', 'interface'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={gpuData.specifications.gpu[spec]}
                  onChange={handleSpecificationChange}
                  placeholder={`Enter ${spec}`}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add GPU Product
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddGPUProduct;
