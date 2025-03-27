import React, { useEffect, useState } from "react";
// import fetchProductInfo from "../components/Back_ViewProduct";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners"; // For loading spinner
import { useNavigate, useLocation } from "react-router-dom";
import queryString from 'query-string';
import { FaStar, FaRegStar } from "react-icons/fa";

export const ViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const [rating, setRating] = useState(0); // User's rating input

  const location = useLocation();
  const navigate = useNavigate();
  // const [filteredData, setFilteredData] = useState([]);
  
  const filters = queryString.parse(location.search);
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  console.log(search);
  
  // Use filteredData and previousPath here
  // console.log('Received filters:', filters);

   const putFilteredData = () => {
      //setFilteredData(queryString.parse(filters))
      // console.log(filters);
      
   }
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("clientUser");
    putFilteredData();
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
    }
    const getinfo = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const pid = params.get("pid");
        if (pid) {
          try {
            const response = await axios.post('http://localhost:5000/api/productInfo', { pid });
            // return response.data;
            setProduct(response.data);



            const feedbackResponse = await axios.get(`http://localhost:5000/api/feedback/${pid}`);
        setFeedbacks(feedbackResponse.data);
          } catch (error) {
            console.error('Failed to fetch product info');
            return [];
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    

    getinfo();
  }, []);

 
  

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartData = {
      customerId: user.id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image || product.imageUrl,
    };

    try {
      await axios.post("http://localhost:5000/api/cart/add", cartData);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackTitle.trim() || !feedbackDesc.trim()) {
      toast.error("Please enter both title and feedback.");
      return;
    }

    const feedbackData = {
      userId: user.id,
      username: user.username,
      productId: product._id,
      productTitle: product.name,
      title: feedbackTitle,
      description: feedbackDesc,
    };

    console.log(feedbackData)

    try {
      await axios.post("http://localhost:5000/api/feedback-in", feedbackData);
      toast.success("Your feedback submitted successfully!");
      setFeedbackTitle("");
      setFeedbackDesc("");
      // Refresh feedbacks
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback.");
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

      <section className="container mx-auto px-4 py-4">
        {product ? (
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 p-8">
              <div className="flex-shrink-0 w-full md:w-96">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>


              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-700 text-lg mb-6">{product.description}</p>
                <p className="flex items-center mb-4">
  {Array.from({ length: 5 }, (_, index) =>
    index < Math.round(product.averageRating || 0) ? (
      <FaStar key={index} className="text-yellow-500" />
    ) : (
      <FaRegStar key={index} className="text-yellow-500" />
    )
  )}
  <span className="ml-2 text-gray-700">({product.averageRating?.toFixed(1) || 0} / 5)</span>
</p>
                <p className="text-3xl font-semibold text-blue-600 mb-6">₹{product.price.toLocaleString('en-IN')}</p>
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
                  <button onClick={()=> {
                    navigate('/checkout', {
                      state: { 
                        checkoutType: 'singleProduct',
                        product: product,
                        isCustomBuild: false
                      }
                    });
                    
                  }} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
                <div>
                  <button onClick={() => navigate(`/shopnow?${queryString.stringify(filters)}&search=${search}`)} className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white font-bold rounded-md">Back</button>
                </div>
            </div>

            

            {product.specifications && (
              <div className="p-8 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Specifications</h2>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="mb-8">
                    {/* <h3 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div
                          key={subKey}
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200"
                        >
                          <span className="block font-medium text-white capitalize">
                            {subKey.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="text-white">
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

      

      {user ? (
        <section className="container mx-auto px-4 py-4">


<div className="bg-white flex flex-col justify-center items-center shadow-2xl rounded-lg p-6 mx-auto mt-6">
  <h2 className="text-lg font-semibold mb-4 text-center">Rate this Product</h2>
  <div className="flex space-x-2">
    {Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        className={`text-3xl ${index < rating ? 'text-yellow-500' : 'text-gray-400'}`}
      >
        ★
      </button>
    ))}
  </div>
  <button
    onClick={async () => {
      if (rating === 0) {
        toast.error("Please select a rating!");
        return;
      }
      try {
        await axios.post("http://localhost:5000/api/submit-rating", {
          productId: product._id,
          userId: user.id,
          rating,
        });
        toast.success("Thank you for rating!");
      } catch (error) {
        console.error("Rating failed", error);
        toast.error("Failed to submit rating");
      }
    }}
    className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
  >
    Submit Rating
  </button>
</div>




          <div className="bg-white flex flex-col justify-center items-center shadow-2xl rounded-lg p-6 mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">Feedback</h2>

            <div className="space-y-4 w-5/12">
              <input
                type="text"
                placeholder="Write title"
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
                className="w-full border-2 border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <textarea
                placeholder="Write your feedback..."
                value={feedbackDesc}
                onChange={(e) => setFeedbackDesc(e.target.value)}
                className="w-full border-2 border-black rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              ></textarea>

              <button
                onClick={handleFeedbackSubmit}
                className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition"
              >
                Submit Feedback <i className="fa fa-send" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-gray-100 shadow-2xl rounded-lg px-6 py-2 mb-10">
          <h2 className="text-center text-lg font-semibold">Login to give Feedback</h2>
        </div>
      )}



<section className="container mx-auto px-4 py-8">
  <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">User Feedbacks</h2>
  
  {feedbacks.length > 0 ? (
    <div className="space-y-6">
      {feedbacks.map((fb) => (
        <div 
          key={fb._id} 
          className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300"
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{fb.title}</h3>
          <p className="text-gray-700 text-lg mb-4">{fb.description}</p>
          <p className="text-sm text-gray-500 italic">— {fb.username || 'Anonymous'}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-600 text-lg">No feedbacks yet.</p>
  )}
</section>


    </div>
  );
};