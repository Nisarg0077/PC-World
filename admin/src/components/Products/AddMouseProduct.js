import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';

const AddMouseProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    category: 'Peripherals',
    subCategory: 'Mouse',
    specifications: {
      type: 'Mouse',
      interface: '',
      compatibility: [],
      dimensions: '',
      weight: '',
      features: [],
      mouse: {
        dpi: '',
        buttons: '',
        sensorType: ''
      }
    },
    images: [{ url: '', caption: '' }],
    stock: {
      quantity: '',
      sku: ''
    },
    features: [],
    compatibility: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const keys = name.split('.');
      if (keys.length === 1) {
        return { ...prev, [name]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleArrayInput = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim())
    }));
  };

  const handleImageChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index][key] = value;
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/accessories', formData);
      console.log('Product added:', response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Add New Mouse Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand ID *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU *</label>
                  <input type="text" name="stock.sku" value={formData.stock.sku} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
              </div>
            </div>

            {/* Mouse Specifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">DPI *</label>
                  <input type="number" name="specifications.mouse.dpi" value={formData.specifications.mouse.dpi} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buttons *</label>
                  <input type="number" name="specifications.mouse.buttons" value={formData.specifications.mouse.buttons} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sensor Type *</label>
                  <select name="specifications.mouse.sensorType" value={formData.specifications.mouse.sensorType} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Sensor Type</option>
                    <option value="Optical">Optical</option>
                    <option value="Laser">Laser</option>
                    <option value="Trackball">Trackball</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Interface *</label>
                  <select name="specifications.interface" value={formData.specifications.interface} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Interface</option>
                    <option value="USB">USB</option>
                    <option value="Wireless">Wireless</option>
                    <option value="Bluetooth">Bluetooth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Stock Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity *</label>
                  <input type="number" name="stock.quantity" value={formData.stock.quantity} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>
              {formData.images.map((image, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input type="text" value={image.url} onChange={(e) => handleImageChange(index, 'url', e.target.value)} className="w-full p-2 border rounded mb-2" />
                  <label className="block text-sm font-medium mb-1">Caption</label>
                  <input type="text" value={image.caption} onChange={(e) => handleImageChange(index, 'caption', e.target.value)} className="w-full p-2 border rounded" />
                </div>
              ))}
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', caption: '' }] }))} className="text-blue-600 text-sm">+ Add Another Image</button>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Add Product</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddMouseProduct;
