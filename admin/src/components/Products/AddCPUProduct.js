import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

const AddCPUProduct = () => {
  const navigate = useNavigate();
  const [cpuData, setCpuData] = useState({
    name: '',
    category: 'cpu',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      cpu: {
        manufacturer: '',
        model: '',
        cores: '',
        threads: '',
        baseClock: '',
        boostClock: '',
        socket: '',
        cache: '',
      },
    },
  });

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    }
    fetchBrands();
  }, [navigate]);

  const fetchBrands = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCpuData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setCpuData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        cpu: {
          ...prevData.specifications.cpu,
          [name]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/productsin', cpuData);
      toast.success('CPU Product added successfully!');
      setCpuData({
        name: '',
        category: 'cpu',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          cpu: {
            manufacturer: '',
            model: '',
            cores: '',
            threads: '',
            baseClock: '',
            boostClock: '',
            socket: '',
            cache: '',
          },
        },
      });
    } catch (error) {
      console.error('Error adding CPU product:', error);
      toast.error('Failed to add CPU product.');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer /> {/* Add the ToastContainer */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add CPU Product</h1>
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
                  value={cpuData[field]}
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
                value={cpuData.brand}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            {['manufacturer', 'model', 'cores', 'threads', 'baseClock', 'boostClock', 'socket', 'cache'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={cpuData.specifications[spec]}
                  onChange={handleSpecificationChange}
                  placeholder={`Enter ${spec}`}
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add CPU Product
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddCPUProduct;
