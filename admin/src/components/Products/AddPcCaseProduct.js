import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPcCaseProduct = () => {
  const navigate = useNavigate();
  const [pcCaseData, setPcCaseData] = useState({
    name: '',
    category: 'PC Case',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      pcCase: {
        formFactor: '',
        material: '',
        dimensions: '',
        weight: '',
        fanSupport: '',
        radiatorSupport: '',
        gpuClearance: '',
        cpuCoolerClearance: '',
        psuSupport: '',
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
  }, [navigate]); // Added navigate to dependency array

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
    setPcCaseData(prev => ({
      ...prev,
      [name]: ['price', 'stock'].includes(name) ? parseFloat(value) || '' : value,
    }));
  };

  // Fixed specification change handler
  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setPcCaseData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        pcCase: {
          ...prev.specifications.pcCase,
          [name]: ['weight', 'gpuClearance', 'cpuCoolerClearance'].includes(name) 
            ? parseFloat(value) || '' 
            : value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Show preview while keeping imageUrl for final upload
      setPcCaseData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        toast.error('Please upload an image');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);

      const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedPcCaseData = {
        ...pcCaseData,
        imageUrl: uploadResponse.data.imageUrl
      };

      await axios.post('http://localhost:5000/api/productsin', updatedPcCaseData);
      toast.success('PC Case added successfully!');

      // Reset form properly
      setPcCaseData({
        name: '',
        category: 'PC Case',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          pcCase: {
            formFactor: '',
            material: '',
            dimensions: '',
            weight: '',
            fanSupport: '',
            radiatorSupport: '',
            gpuClearance: '',
            cpuCoolerClearance: '',
            psuSupport: '',
          }
        },
      });
      setImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add PC Case Product</h1>
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
                  value={pcCaseData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={field === 'price' ? 0.01 : field === 'stock' ? 0 : undefined}
                  step={field === 'price' ? 0.01 : 1}
                />
              </div>
            ))}

            <div>
              <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
              <select
                id="brand"
                name="brand"
                value={pcCaseData.brand}
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

            <div className="grid grid-cols-2 gap-4">
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
                    value={pcCaseData.specifications.pcCase[spec]}
                    onChange={handleSpecificationChange}
                    placeholder={`Enter ${spec.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    required
                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step={spec === 'weight' ? 0.1 : 1}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="border rounded px-4 py-2 w-full"
                key={Date.now()} // Reset input on form reset
              />
              {pcCaseData.imageUrl && (
                <img 
                  src={pcCaseData.imageUrl} 
                  alt="Preview" 
                  className="mt-2 h-32 object-contain"
                />
              )}
            </div>

            <button 
              type="submit" 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
            >
              Add PC Case Product
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddPcCaseProduct;