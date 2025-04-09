import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRAMProduct = () => {
  const navigate = useNavigate();

  const [ramData, setRamData] = useState({
    name: '',
    category: 'ram',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      ram: {
        type: '',
        speed: '',
        capacity: '',
        modules: '',
        casLatency: '',
      },
    },
  });

  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null); // Store selected image file

  useEffect(() => {
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    }
    fetchBrands();
  }, [navigate]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/brands');
      setBrands(response.data);
    } catch (error) {
      toast.error('Failed to fetch brands');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setRamData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        ram: {
          ...prevData.specifications.ram,
          [name]: value,
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
      let imageUrl = '';

      // Upload image if a file is selected
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.imageUrl; // Get the image URL after upload
      }

      // Add the image URL to the product data
      const finalRamData = { ...ramData, imageUrl };

      // Send the product data to the backend
      await axios.post('http://localhost:5000/api/productsin', finalRamData);
      toast.success('RAM Product added successfully!');

      // Reset the form
      setRamData({
        name: '',
        category: 'ram',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          ram: {
            type: '',
            speed: '',
            capacity: '',
            modules: '',
            casLatency: '',
          },
        },
      });
      setImage(null); // Reset image input
      navigate('/products');
    } catch (error) {
      toast.error('Failed to add RAM product.');
    }
  };

  const handleBack = () => {
    navigate(`/products`);
  }


  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add RAM Product</h1>
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
                  value={ramData[field]}
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
                value={ramData.brand}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {['type', 'speed', 'capacity', 'modules', 'casLatency'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={ramData.specifications.ram[spec]}
                  onChange={handleSpecificationChange}
                  placeholder={`Enter ${spec}`}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

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
              Add RAM Product
            </button>
            <button
      type="button"
      onClick={handleBack}
      className="bg-gray-300 ml-4 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
    >
      Back
    </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddRAMProduct;
