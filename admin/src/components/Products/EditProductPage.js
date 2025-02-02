import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {},
  });

  const [image, setImage] = useState(null); // Store selected image file

  // Extract product ID (pid) from query params
  const queryParams = new URLSearchParams(location.search);
  const pid = queryParams.get('pid');

  useEffect(() => {
    if (!pid) {
      toast.error('Product ID is missing');
      navigate('/products');
    }

    // Check if the admin is logged in
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    }

    // Fetch product details by product ID
    axios
      .get(`http://localhost:5000/api/product/${pid}`)
      .then((res) => {
        setProductData(res.data); // Set product data for editing
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
        toast.error('Failed to fetch product data');
      });
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = productData.imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      const finalProductData = { ...productData, imageUrl };

      await axios.post(`http://localhost:5000/api/product/${pid}`, finalProductData);
    //   toast.success('Product updated successfully!');
      alert('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to update product.');
    }
  };

  const renderSpecificationFields = () => {
    const { category, specifications } = productData;

    switch (category) {
      case 'cpu':
        return (
          <>
            <div>
              <label htmlFor="manufacturer" className="block font-medium mb-2">Manufacturer</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={specifications.cpu.manufacturer}
                onChange={handleSpecificationChange}
                placeholder="Enter Manufacturer"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="model" className="block font-medium mb-2">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={specifications.cpu.model}
                onChange={handleSpecificationChange}
                placeholder="Enter Model"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Add more fields for CPU specifications */}
          </>
        );

      case 'gpu':
        return (
          <>
            <div>
              <label htmlFor="manufacturer" className="block font-medium mb-2">Manufacturer</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={specifications.gpu.manufacturer}
                onChange={handleSpecificationChange}
                placeholder="Enter Manufacturer"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="vram" className="block font-medium mb-2">VRAM</label>
              <input
                type="text"
                id="vram"
                name="vram"
                value={specifications.gpu.vram}
                onChange={handleSpecificationChange}
                placeholder="Enter VRAM"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Add more fields for GPU specifications */}
          </>
        );

      case 'ram':
        return (
          <>
            <div>
              <label htmlFor="type" className="block font-medium mb-2">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={specifications.ram.type}
                onChange={handleSpecificationChange}
                placeholder="Enter RAM Type"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block font-medium mb-2">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={specifications.ram.capacity}
                onChange={handleSpecificationChange}
                placeholder="Enter Capacity"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Add more fields for RAM specifications */}
          </>
        );

      case 'storage':
        return (
          <>
            <div>
              <label htmlFor="type" className="block font-medium mb-2">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={specifications.storage.type}
                onChange={handleSpecificationChange}
                placeholder="Enter Storage Type"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block font-medium mb-2">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={specifications.storage.capacity}
                onChange={handleSpecificationChange}
                placeholder="Enter Capacity"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Add more fields for Storage specifications */}
          </>
        );

      default:
        return null;
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
