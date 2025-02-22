// import React, { useEffect, useState } from 'react'
// import Navbar from './Navbar'
// import fetchProductInfo from '../components/Back_ViewProduct'
// import axios from 'axios'
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export const ViewProudct = () => {
//     const [product, setProduct] = useState([]);
//     const [query, setQuery] = useState([]);
//     const [pid, setPid] = useState([]);
//     const [user, setUser] = useState(null);
//     useEffect(()=> {

//       const storedUser = sessionStorage.getItem("ClientUser");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//         const getinfo = async () => {
//             const params = new URLSearchParams(window.location.search);
//       const paramsArray = Array.from(params.entries()); // Convert query parameters to an array
//       setQuery(paramsArray); // Store them for mapping
//       const pid = params.get('pid'); // Extract specific key if needed
//       if (pid){
//         const info = await fetchProductInfo(pid);
//             setProduct(info);
//       } 
            

//         }
//         getinfo();
        
//     },[])


//     const handleAddToCart = async (product) => {
//       if (!user) {
//         alert("Please log in to add items to the cart.");
//         return;
//       }
    
//       const cartData = {
//         customerId: user.id,
//       productId: product._id,
//       name: product.name,
//       price: product.price,
//       quantity: 1,
//       imageUrl: product.image || product.imageUrl.replace("http://localhost:5000/images/", ""),
//       };
    
//       console.log("Adding to cart:", cartData);
    
//       try {
//         const response = await axios.post("http://localhost:5000/api/cart/add", cartData);
//         toast.success("Product added to cart successfully!");
//       } catch (error) {
//         toast.error("Failed to add product to cart.");
//       }
//     };
    
//   return (
//     <div>
//         <ToastContainer position="top-right" autoClose={2000} /> 
//         <section>
//         {product ? (
//             <div className="bg-white shadow-md rounded-lg p-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 {/* Product Image */}
//                 <div className="flex-shrink-0">
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     className="w-full md:w-64 h-auto rounded-md shadow"
//                   />
//                 </div>

//                 {/* Product Details */}
//                 <div className="flex-1">
//                   <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
//                   <p className="text-gray-600 mb-4">{product.description}</p>
//                   <p className="text-2xl font-semibold text-blue-600 mb-4">₹{product.price}</p>
//                   <p className="text-gray-500 mb-2">
//                     <span className="font-medium">Brand:</span> {product.brand}
//                   </p>
//                   <p className="text-gray-500 mb-2">
//                     <span className="font-medium">Category:</span> {product.category}
//                   </p>
//                   <p className="text-gray-500 mb-4">
//                     <span className="font-medium">Stock Available:</span> {product.stock}
//                   </p>
//                   <button className='border border-yellow-600 bg-yellow-400 p-2 text-black rounded font-semibold' onClick={() => handleAddToCart(product)}>Add To Cart</button>
//                   <button  className='border border-yellow-600 bg-yellow-500 p-2 ml-2 text-black rounded font-semibold'>Buy Now</button>
//                 </div>
//               </div>

//               {product.specifications && product.specifications.cpu &&  (
//                 <div className="mt-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications.cpu).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-gray-50 p-4 rounded shadow border border-gray-200"
//                       >
//                         <span className="block font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}:
//                         </span>
//                         <span className="text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {product.specifications && product.specifications.gpu &&  (
//                 <div className="mt-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">GPU Specifications</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications.gpu).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-gray-50 p-4 rounded shadow border border-gray-200"
//                       >
//                         <span className="block font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}:
//                         </span>
//                         <span className="text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}


//               {product.specifications && product.specifications.ram && (
//                 <div className="mt-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">RAM Specifications</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications.ram).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-gray-50 p-4 rounded shadow border border-gray-200"
//                       >
//                         <span className="block font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}:
//                         </span>
//                         <span className="text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}


//               {product.specifications && product.specifications.motherboard && (
//                 <div className="mt-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">Motherboard Specifications</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications.motherboard).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-gray-50 p-4 rounded shadow border border-gray-200"
//                       >
//                         <span className="block font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}:
//                         </span>
//                         <span className="text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {product.specifications && product.specifications.storage && (
//                 <div className="mt-6">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">Storage Specifications</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(product.specifications.storage).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-gray-50 p-4 rounded shadow border border-gray-200"
//                       >
//                         <span className="block font-medium text-gray-700 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1')}:
//                         </span>
//                         <span className="text-gray-900">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}




// {product.specifications && product.specifications.psu && (
//   <div className="mt-6">
//     <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {Object.entries(product.specifications.psu).map(([key, value]) => (
//         <div key={key} className="bg-gray-50 p-4 rounded shadow border border-gray-200">
//           <span className="block font-medium text-gray-700 capitalize">
//             {key.replace(/([A-Z])/g, ' $1')}:
//           </span>
          
//           {/* Check for modular, and display "Yes" or "No" */}
//           <span className="text-gray-900">
//             {key === "modular" ? (value ? "Yes" : "No") : value}
//           </span>
//         </div>
//       ))}
//     </div>
//   </div>
// )}
//             </div>
//           ) : (
//             <p>Loading product info...</p>
//           )}
//         </section>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react';
import fetchProductInfo from '../components/Back_ViewProduct';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners'; // For loading spinner

export const ViewProudct = () => {
  const [product, setProduct] = useState(null);
  const [query, setQuery] = useState([]);
  const [pid, setPid] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('ClientUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const getinfo = async () => {
      const params = new URLSearchParams(window.location.search);
      const paramsArray = Array.from(params.entries());
      setQuery(paramsArray);
      const pid = params.get('pid');
      if (pid) {
        const info = await fetchProductInfo(pid);
        setProduct(info);
      }
      setLoading(false);
    };
    getinfo();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const cartData = {
      customerId: user.id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image || product.imageUrl.replace('http://localhost:5000/images/', ''),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', cartData);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add product to cart.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* <Navbar /> */}
      <section className="container mx-auto px-4 py-8">
        {product ? (
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 p-8">
              {/* Product Image */}
              <div className="flex-shrink-0 w-full md:w-96">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-700 text-lg mb-6">{product.description}</p>
                <p className="text-3xl font-semibold text-blue-600 mb-6">₹{product.price}</p>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-600">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Stock Available:</span> {product.stock}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Add To Cart
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="p-8 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Specifications</h2>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div
                          key={subKey}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                        >
                          <span className="block font-medium text-gray-700 capitalize">
                            {subKey.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="text-gray-900">
                            {typeof subValue === 'boolean' ? (subValue ? 'Yes' : 'No') : subValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-700">Product not found.</p>
        )}
      </section>
    </div>
  );
};