
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useCart } from "../components/CartContext";
// import queryString from "query-string";

// const Checkout = () => {
//   const { state, clearCart } = useCart();
//   const cartItems = state?.cartItems || [];
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { selectedProducts = [], checkoutType } = location.state || {};
//   const productData = queryString.parse(location.search, { parseNumbers: true });

//   const [user, setUser] = useState(null);
//   const [shippingAddress, setShippingAddress] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   console.log("✅ Checkout Data:", { selectedProducts, checkoutType, cartItems, productData });

//   // ✅ Fetch Single Product (if exists)
//   useEffect(() => {
//     if (productData._id) {
//       fetchProduct(productData._id);
//     } else {
//       setLoading(false);
//     }
//   }, [productData]);

//   const fetchProduct = async (id) => {
//     try {
//       console.log("Fetching Product with ID:", id);
//       const response = await axios.get(`http://localhost:5000/api/product/${id}`);
//       console.log("✅ Fetched Product:", response.data);
//       setProduct(response.data);
//     } catch (err) {
//       console.error("❌ Error fetching product:", err);
//       setError("Failed to fetch product details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch User & Address
//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("clientUser");
//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser);
//         setUser(userData);
//         fetchUserAddress(userData.id);
//       } catch (err) {
//         console.error("Error parsing stored user:", err);
//         setError("Error parsing user data.");
//       }
//     } else {
//       setError("No user found. Please log in.");
//     }
//   }, []);

//   const fetchUserAddress = async (userId) => {
//     try {
//       console.log("Fetching Address for User:", userId);
//       const response = await axios.get(`http://localhost:5000/api/user/address/${userId}`);
//       console.log("✅ Fetched Address:", response.data);
//       setShippingAddress(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching address:", error);
//       setError("Failed to fetch shipping address.");
//     }
//   };

//   // ✅ Fix Total Price Calculation
//   const totalPrice =
//     checkoutType === "customBuild"
//       ? selectedProducts.reduce((total, item) => total + (item?.price || 0), 0)
//       : product
//       ? product?.price || 0
//       : cartItems.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);

//   // ✅ Handle Place Order
//   const handlePlaceOrder = async () => {
//     if (!user || !shippingAddress || totalPrice === 0) {
//       setError("Missing user details or cart items.");
//       return;
//     }

//     const orderItems = checkoutType === "customBuild"
//       ? selectedProducts.map((item) => ({
//           productId: item?._id || "",
//           name: item?.name || "Unknown",
//           price: item?.price || 0,
//           quantity: 1,
//           imageUrl: `http://localhost:5000/images/${item?.imageUrl || "default.jpg"}`,
//         }))
//       : product
//       ? [{ productId: product?._id || "", name: product?.name || "Unknown", price: product?.price || 0, quantity: 1, imageUrl: `http://localhost:5000/images/${product?.imageUrl || "default.jpg"}` }]
//       : cartItems.map((item) => ({
//           productId: item?._id || "",
//           name: item?.name || "Unknown",
//           price: item?.price || 0,
//           quantity: item?.quantity || 1,
//           imageUrl: item?.imageUrl || "default.jpg",
//         }));

//     const orderData = {
//       userId: user?.id || "",
//       email: user?.email || "",
//       items: orderItems,
//       totalAmount: totalPrice,
//       shippingAddress: {
//         fullName: `${user?.firstName} ${user?.lastName}`,
//         phone: shippingAddress?.phone || "N/A",
//         building: shippingAddress?.building || "N/A",
//         street: shippingAddress?.street || "N/A",
//         city: shippingAddress?.city || "N/A",
//         state: shippingAddress?.state || "N/A",
//         pinCode: shippingAddress?.pinCode || "N/A",
//       },
//     };

//     try {
//       const response = await axios.post("http://localhost:5000/api/orderin", orderData);
//       alert("🎉 Order placed successfully!");
//       clearCart();
//       await axios.delete(`http://localhost:5000/api/cart/clear/${user?.id || ""}`);
//       window.dispatchEvent(new Event("cartUpdated"));
//       navigate("/");
//     } catch (error) {
//       console.error("❌ Error placing order:", error);
//       setError("Failed to place order. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg border">
//       <button onClick={() => navigate(-1)} className="mb-6 px-5 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
//         ← Back
//       </button>

//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h2>
//       {error && <p className="text-red-500 text-center">{error}</p>}

//       {/* ✅ Display User Information */}
//       {user && shippingAddress && (
//         <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-700">Shipping Details</h3>
//           <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
//           <p className="text-gray-600"><strong>Phone:</strong> +91{shippingAddress.phone}</p>
//           <p className="text-gray-600"><strong>Address:</strong> {shippingAddress.building}, {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.pinCode}</p>
//         </div>
//       )}

//       {/* ✅ Checkout Items */}
//       {checkoutType === "customBuild" ? (
//         selectedProducts.map((component) => (
//           <div key={component?._id || ""} className="flex items-center gap-4 border-b pb-3 mb-3">
//             <img src={`http://localhost:5000/images/${component?.imageUrl || "default.jpg"}`} alt={component?.name || "Unknown"} className="w-20 h-20 rounded-lg shadow-md" />
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800">{component?.name || "Unknown"}</h2>
//               <p className="text-gray-600"><strong>Price:</strong> ₹{component?.price?.toLocaleString("en-IN")}</p>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500 text-center">No items in cart.</p>
//       )}

//       {/* ✅ Total Price */}
//       <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-700">Total Price</h3>
//         <p className="text-xl font-semibold text-gray-900">₹{totalPrice.toLocaleString("en-IN")}</p>
//       </div>

//       {/* ✅ Place Order Button */}
//       <button onClick={handlePlaceOrder} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200">
//         Place Order (COD)
//       </button>
//     </div>
//   );
// };

// export default Checkout;


import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract Data from Route State
  const { selectedProducts = [], checkoutType, product: singleProduct, customBuild } = location.state || {};

  // ✅ States
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("✅ Checkout Data:", { selectedProducts, checkoutType, cartItems, singleProduct, customBuild });

  // ✅ Fetch Cart Items if Not Available
  useEffect(() => {
    if (!cartItems.length && checkoutType === "cart") {
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = async () => {
    try {
      console.log("Fetching Cart Items...");
      const response = await axios.get("http://localhost:5000/api/cart");
      setCartItems(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching cart items:", error);
      setError("Failed to load cart items.");
    }
  };

  // ✅ Fetch User & Address
  useEffect(() => {
    const storedUser = sessionStorage.getItem("clientUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        fetchUserAddress(userData.id);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        setError("Error parsing user data.");
      }
    } else {
      setError("No user found. Please log in.");
    }
  }, []);

  const fetchUserAddress = async (userId) => {
    try {
      console.log("Fetching Address for User:", userId);
      const response = await axios.get(`http://localhost:5000/api/user/address/${userId}`);
      setShippingAddress(response.data);
    } catch (error) {
      console.error("❌ Error fetching address:", error);
      setError("Failed to fetch shipping address.");
    }
  };

  // ✅ Get Image URL Safely
  const getImageUrl = (item) => {
    if (!item || !item.imageUrl) return "http://localhost:5000/images/default.jpg";

    if (item.imageUrl.startsWith("http")) return item.imageUrl;

    return `http://localhost:5000/images/${item.imageUrl.replace(/^[/\\]+/, "")}`;
  };

  // ✅ Get Items to Display
  const getItemsToDisplay = () => {
    if (customBuild?.components) {
      return Object.values(customBuild.components);
    } else if (selectedProducts.length > 0) {
      return selectedProducts;
    } else if (singleProduct) {
      return [singleProduct];
    } else {
      return cartItems;
    }
  };

  const displayItems = getItemsToDisplay();

  // ✅ Correct Total Price Calculation
  const totalPrice = (() => {
    if (customBuild) {
      return Object.values(customBuild.components).reduce((total, item) => total + (item?.price || 0), 0);
    } else if (checkoutType === "singleProduct") {
      return singleProduct?.price || 0;
    } else {
      return displayItems.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);
    }
  })();

  // ✅ Handle Place Order
  const handlePlaceOrder = async () => {
    if (!user || !shippingAddress || totalPrice === 0) {
      setError("Missing user details or cart items.");
      return;
    }

    const orderItems = displayItems.map((item) => ({
      productId: item?._id || "",
      name: item?.name || "Unknown",
      price: item?.price || 0,
      quantity: item?.quantity || 1,
      imageUrl: getImageUrl(item),
    }));

    const orderData = {
      userId: user?.id || "",
      email: user?.email || "",
      items: orderItems,
      totalAmount: totalPrice,
      shippingAddress: {
        fullName: `${user?.firstName} ${user?.lastName}`,
        phone: shippingAddress?.phone || "N/A",
        building: shippingAddress?.building || "N/A",
        street: shippingAddress?.street || "N/A",
        city: shippingAddress?.city || "N/A",
        state: shippingAddress?.state || "N/A",
        pinCode: shippingAddress?.pinCode || "N/A",
      },
    };

    try {
      console.log("Placing order with data:", orderData);
      const response = await axios.post("http://localhost:5000/api/orderin", orderData);
      console.log("Order placed successfully:", response.data);
      alert("🎉 Order placed successfully!");
      clearCart();
      await axios.delete(`http://localhost:5000/api/cart/clear/${user?.id || ""}`);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg border">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-5 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* ✅ User & Address Details */}
      {user && shippingAddress && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">User & Address</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Phone:</strong> +91{shippingAddress.phone}</p>
          <p><strong>Address:</strong> {shippingAddress.building}, {shippingAddress.street}</p>
          <p><strong>City:</strong> {shippingAddress.city}, <strong>State:</strong> {shippingAddress.state}</p>
          <p><strong>Pincode:</strong> {shippingAddress.pinCode}</p>
        </div>
      )}

      {/* ✅ Checkout Items */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-5">Products</h3>
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item?._id || Math.random().toString()} className="flex items-center gap-4 border-b pb-3 mb-3">
              <img 
                src={getImageUrl(item)}
                alt={item?.name} 
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
              <div>
                <p className="text-lg font-semibold">{item?.name}</p>
                <p className="text-gray-600">₹{item?.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products in checkout</p>
        )}
      </div>

      {/* ✅ Total Price */}
      <div className="text-2xl font-semibold text-gray-900 mb-4">Total Price: ₹{totalPrice.toLocaleString("en-IN")}</div>

      {/* ✅ Place Order Button */}
      <button 
        onClick={handlePlaceOrder} 
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        Place Order (COD)
      </button>
    </div>
  );
};

export default Checkout;
