import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductInfo = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    } else {
      const params = new URLSearchParams(window.location.search);
      const pid = params.get('pid');
      if (pid) fetchProductInfo(pid);
    }
  }, [navigate]);

  const fetchProductInfo = async (pid) => {
    try {
      const response = await axios.post('http://localhost:5000/api/productInfo', { pid });
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product info');
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
          {product ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrl}  // Display full image URL
                    alt={product.name}
                    className="w-full md:w-64 h-auto rounded-md shadow"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-2xl font-semibold text-blue-600 mb-4">₹{product.price}</p>
                  <p className="text-gray-500 mb-2">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  <p className="text-gray-500 mb-2">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                  <p className="text-gray-500 mb-4">
                    <span className="font-medium">Stock Available:</span> {product.stock}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.cpu && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.cpu).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.gpu && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.gpu).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.ram && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.ram).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.storage && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.storage).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.motherboard && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.motherboard).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading product info...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductInfo;
