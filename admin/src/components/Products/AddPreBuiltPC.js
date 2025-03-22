import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPreBuiltPC = () => {
  const navigate = useNavigate();
  const [preBuiltData, setPreBuiltData] = useState({
    name: '',
    category: 'preBuilt',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
        preBuilt:{
            cpu: '',
            gpu: '',
            ram: '',
            storage: '',
            motherboard: '',
            psu: '',
            case: '',
        }
    },
  });

  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);

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
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreBuiltData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setPreBuiltData((prevData) => ({
      ...prevData,
      specifications: {
        preBuilt: {
          ...prevData.specifications.preBuilt,
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
      let imageUrl = preBuiltData.imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      const finalProductData = { ...preBuiltData, imageUrl };
      await axios.post('http://localhost:5000/api/productsin', finalProductData);
      toast.success('Pre-Built PC added successfully!');

      setPreBuiltData({
        name: '',
        category: 'pre-built',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
            preBuilt:{
                cpu: '',
                gpu: '',
                ram: '',
                storage: '',
                motherboard: '',
                psu: '',
                case: '',
            }
        },
      });
      setImage(null);
      navigate('/products');
    } catch (error) {
      console.error('Error adding Pre-Built PC:', error);
      toast.error('Failed to add Pre-Built PC.');
    }
  };

  const handleBack = () => {
    navigate('/products');
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add Pre-Built PC</h1>

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
                  value={preBuiltData[field]}
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
                value={preBuiltData.brand}
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

            {/* Specifications */}
            {['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'case'].map((spec) => (
  <div key={spec}>
    <label htmlFor={spec} className="block font-medium mb-2">
      {spec.toUpperCase()}
    </label>
    <input
      type="text"
      id={spec}
      name={spec}
      value={preBuiltData.specifications.preBuilt[spec] || ''}
      onChange={handleSpecificationChange}
      placeholder={`Enter ${spec.toUpperCase()}`}
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
              Add Pre-Built PC
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

export default AddPreBuiltPC;
