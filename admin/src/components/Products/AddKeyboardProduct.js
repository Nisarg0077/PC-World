import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddKeyboardProduct = () => {
  const navigate = useNavigate();
  const [keyboardData, setKeyboardData] = useState({
    name: '',
    category: 'keyboard',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
        keyboard: {
        switchType: '',
        layout: '',
        keyCount: '',
        backlit: false,
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
    setKeyboardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setKeyboardData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        keyboard: {
          ...prevData.specifications.keyboard,
          [name]: name === 'keyCount' ? Number(value) : value,
          [name]: type === 'checkbox' ? checked : value,
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
      let imageUrl = keyboardData.imageUrl;
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      const finalProductData = { ...keyboardData, imageUrl };
      await axios.post('http://localhost:5000/api/productsin', finalProductData);
      toast.success('Keyboard Product added successfully!');

      setKeyboardData({
        name: '',
        category: 'keyboard',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
            keyboard: {
                switchType: '',
                layout: '',
                keyCount: '',
                backlit: false,
          }
        },
      });
      setImage(null);
      navigate(`/products`);
    } catch (error) {
      console.error('Error adding Keyboard product:', error);
      toast.error('Failed to add Keyboard product.');
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
          <h1 className="text-2xl font-bold mb-4">Add Keyboard Product</h1>
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
                  value={keyboardData[field]}
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
                value={keyboardData.brand}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {['switchType', 'layout', 'keyCount'].map((spec) => (
                <div key={spec}>
                    <label htmlFor={spec} className="block font-medium mb-2">
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </label>
                    <input
                    type={spec === 'keyCount' ? 'number' : 'text'}
                    id={spec}
                    name={spec}
                    value={keyboardData.specifications.keyboard[spec]}
                    onChange={handleSpecificationChange}
                    placeholder={`Enter ${spec}`}
                    required
                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                ))}


            <div>
              <label htmlFor="backlit" className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="backlit"
                  name="backlit"
                  checked={keyboardData.specifications.keyboard.backlit}
                  onChange={handleSpecificationChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="font-medium">Backlit</span>
              </label>
            </div>

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
              Add Keyboard Product
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

export default AddKeyboardProduct;
