import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMouseProduct = () => {
  const navigate = useNavigate();
  const [mouseData, setMouseData] = useState({
    name: '',
    category: 'mouse',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      mouse: {
        dpi: '',
        buttons: '',
        sensorType: '',
        connectivity: '',
        weight: '',
      }
    },
  });

  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const checkAdmin = () => {
      if (!sessionStorage.getItem('AdminUser')) {
        navigate('/login');
      }
    };
    checkAdmin();
    fetchBrands();
  }, []);

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
    setMouseData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setMouseData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        mouse: {
          ...prevData.specifications.mouse,
          [name]: name === 'dpi' || name === 'buttons' || name === 'weight' ? parseFloat(value) || '' : value,
        },
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setMouseData(prev => ({ ...prev, imageUrl: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updatedMouseData = {
          ...mouseData,
          imageUrl: uploadResponse.data.imageUrl
        };

        await axios.post('http://localhost:5000/api/productsin', updatedMouseData);
        toast.success('Mouse Product added successfully!');

        // Reset Form
        setMouseData({
          name: '',
          category: 'mouse',
          brand: '',
          model: '',
          description: '',
          price: '',
          stock: '',
          imageUrl: '',
          specifications: {
            mouse: {
              dpi: '',
              buttons: '',
              sensorType: '',
              connectivity: '',
              weight: '',
            }
          },
        });
        setImage(null);
        navigate('/products');
      }
    } catch (error) {
      console.error('Error adding Mouse product:', error);
      toast.error('Failed to add Mouse product.');
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
          <h1 className="text-2xl font-bold mb-4">Add Mouse Product</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {['name', 'model', 'description', 'price', 'stock'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={mouseData[field]}
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
                value={mouseData.brand}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {['dpi', 'buttons', 'weight'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="number"
                  id={spec}
                  name={spec}
                  value={mouseData.specifications.mouse[spec]}
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
                value={mouseData.specifications.mouse.sensorType}
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
                value={mouseData.specifications.mouse.connectivity}
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

            <div>
              <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} required className="border rounded px-4 py-2 w-full" />
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add Mouse Product
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

export default AddMouseProduct;
