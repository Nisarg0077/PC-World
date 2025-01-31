import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import fetchProductInfo from '../components/Back_ViewProduct'

export const ViewProudct = () => {
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState([]);
    const [pid, setPid] = useState([]);
    useEffect(()=> {
        const getinfo = async () => {
            const params = new URLSearchParams(window.location.search);
      const paramsArray = Array.from(params.entries()); // Convert query parameters to an array
      setQuery(paramsArray); // Store them for mapping
      const pid = params.get('pid'); // Extract specific key if needed
      if (pid){
        const info = await fetchProductInfo(pid);
            setProduct(info);
      } 
            

        }
        getinfo();
        
    },[])
  return (
    <div>
        <Navbar/>
        <section>
        {product ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrl}
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
                  <button className='border border-yellow-600 bg-yellow-400 p-2 text-black rounded font-semibold'>Add To Cart</button>
                  <button  className='border border-yellow-600 bg-yellow-500 p-2 ml-2 text-black rounded font-semibold'>Buy Now</button>
                </div>
              </div>

              {product.specifications && product.specifications.cpu &&  (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.cpu).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                      >
                        <span className="block font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications && product.specifications.gpu &&  (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">GPU Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.gpu).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                      >
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">RAM Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.ram).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                      >
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Motherboard Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.motherboard).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                      >
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Storage Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications.storage).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-50 p-4 rounded shadow border border-gray-200"
                      >
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
        </section>
    </div>
  )
}
