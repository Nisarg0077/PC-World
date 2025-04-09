import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedProducts = [], checkoutType, product: singleProduct, customBuild, isCustomBuild  } = location.state || {};

  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const [availableCoupons, setAvailableCoupons] = useState([]);
const [appliedCoupon, setAppliedCoupon] = useState(null);


// const [discountedTotal, setDiscountedTotal] = useState(totalPrice);
const [couponCode, setCouponCode] = useState("");
const [discountPercent, setDiscountPercent] = useState(0);
const [couponId, setCouponId] = useState("");

  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    phone: shippingAddress?.phone || "",
    building: shippingAddress?.building || "",
    street: shippingAddress?.street || "",
    city: shippingAddress?.city || "",
    state: shippingAddress?.state || "",
    pinCode: shippingAddress?.pinCode || "",
  });
  useEffect(() => {
    const storedUser = sessionStorage.getItem("clientUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserCoupons(userData.id);
      fetchUserAddress(userData.id);
      console.log(checkoutType);
      console.log(isCustomBuild);
      
      
    } else {
      setError("No user found. Please log in.");
    }
  }, [])

  useEffect(() => {
    if (!cartItems.length && checkoutType === "cart") fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
      setCartItems(response.data || []);
    } catch (error) {
      setError("Failed to load cart items.");
    }
  };



 const fetchUserCoupons = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/coupons/user/${userId}`);
    setAvailableCoupons(res.data || []);
    
    console.log(res.data)
  } catch (error) {
    console.error("❌ Failed to fetch coupons:", error);
  }
};



  const fetchUserAddress = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/address/${userId}`);
      setShippingAddress(response.data);
    } catch (error) {
      setError("Failed to fetch shipping address.");
    }
  };

  const getImageUrl = (item) => {
    if (!item || !item.imageUrl) return "http://localhost:5000/images/default.jpg";
    return item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:5000/images/${item.imageUrl.replace(/^[/\\]+/, "")}`;
  };

  const getItemsToDisplay = () => {
    if (customBuild?.components) return Object.values(customBuild.components);
    if (selectedProducts.length > 0) return selectedProducts;
    if (singleProduct) return [singleProduct];
    return cartItems;
  };

  const displayItems = getItemsToDisplay();

  // const totalPrice = (() => {
  //   if (customBuild) return Object.values(customBuild.components).reduce((total, item) => total + (item?.price || 0), 0);
  //   if (checkoutType === "singleProduct") return singleProduct?.price || 0;
  //   return displayItems.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);
  // })();

  const totalPrice = (() => {
    if (customBuild) {
      return Object.values(customBuild.components).reduce(
        (total, item) => total + (item?.price || 0),
        0
      );
    }
  
    if (checkoutType === "singleProduct") {
      return singleProduct?.price || 0;
    }
  
    return displayItems.reduce(
      (total, item) => total + (item?.price || 0) * (item?.quantity || 1),
      0
    );
  })();

  const [discountedTotal, setDiscountedTotal] = useState(totalPrice);
  

  

  const handlePlaceOrder = async () => {
  if (!user || !shippingAddress || totalPrice === 0) {
    alert("Please login to Checkout.");
    return;
  }

  
  
  

  const orderItems = displayItems.map((item) => {
    const productId = item.product?._id || item?._id || "";
    if (!productId) return null;
    return {
      productId,
      name: item?.name || item?.product?.name || "Unknown",
      price: item?.price || item?.product?.price || 0,
      quantity: item?.quantity || 1,
      imageUrl: getImageUrl(item),
    };
  }).filter(Boolean);

  const orderData = {
    userId: user?._id || user?.id || "",
    email: user?.email || "",
    items: orderItems,
    isCustomBuild: isCustomBuild || false,
    // totalAmount: totalPrice,
    originalTotal: totalPrice,     
    discountPercent: discountPercent || 0, 
    finalTotal: discountedTotal,
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

  console.log(orderData.isCustomBuild);


  
  

  console.log("Submitting order", orderData);
  try {
    const response = await axios.post("http://localhost:5000/api/orderin", orderData);

    if (response.status === 201) {
      alert("🎉 Order placed successfully!");
    
      
      // ✅ Only clear cart if checkout is from cart
      if (checkoutType === "cart" && (user?._id || user?.id)) {
        try {
          await axios.delete(`http://localhost:5000/api/cart/clear/${user?._id || user?.id}`);
          
               
             
  
          clearCart(); // Clear frontend cart context
          console.log("✅ Cart cleared after checkout");
        } catch (clearErr) {
          console.error("❌ Failed to clear cart:", clearErr);
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    }
  } catch (error) {
    console.error("❌ Error placing order:", error);
    setError("Failed to place order. Please try again.");
  }
};

const applyCoupon = async (code) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/coupons/validate', {
   
      code,
      userId: user._id || user.id,
    });

    if (data.valid) {
      setAppliedCoupon(data.coupon);

      const discountPercentage = data.coupon.discountPercentage || 0;
      const discount = (totalPrice * discountPercentage) / 100;
      const newTotal = Math.max(totalPrice - discount, 0);

      setDiscountedTotal(newTotal);
      setDiscountPercent(discountPercentage);
      
      
      
      await axios.put(`http://localhost:5000/api/coupons/mark-used/${data.coupon._id}`);
      alert('✅ Coupon applied successfully!');
    } else {
      setAppliedCoupon(null);
      setDiscountedTotal(totalPrice);
      alert(data.message || '❌ Invalid or expired coupon');
    }
  } catch (error) {
    console.error('❌ Error applying coupon:', error);
    setAppliedCoupon(null);
    setDiscountedTotal(totalPrice);
    alert('❌ Error applying coupon');
  }
};





  const handleUpdateAddress = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user/address/${user.id}`, editedAddress);
      if (response.status === 200) {
        setShippingAddress(editedAddress);
        alert("Address updated successfully!");
        setShowAddressModal(false);
      } else {
        alert("Failed to update address.");
      }
    } catch (error) {
      console.error("❌ Error updating address:", error);
      alert("Error updating address. Please try again.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg border">
      <button onClick={() => navigate(-1)} className="mb-6 px-5 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">← Back</button>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {user && shippingAddress && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">User & Address</h3>
      
          </div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Phone:</strong> +91 {shippingAddress.phone}</p>
          <div className="mt-4 pt-4 border-t border-black">
            <p><strong>Address:</strong> {shippingAddress.building}, {shippingAddress.street}</p>
            <p><strong>City:</strong> {shippingAddress.city}, <strong>State:</strong> {shippingAddress.state}</p>
            <p><strong>Pincode:</strong> {shippingAddress.pinCode}</p>
          </div>

          <button
            onClick={() => {
              setEditedAddress(shippingAddress);
              setShowAddressModal(true);
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit Address
          </button>


        </div>
      )}

      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-700 mb-5">Products</h3>
        {displayItems.length > 0 ? displayItems.map((item) => (
          <div key={item?._id || Math.random()} className="flex items-center gap-4 border-b pb-3 mb-3">
            <img src={getImageUrl(item)} alt={item?.name} className="w-20 h-20 object-cover rounded-lg shadow-md" />
            <div>
              <p className="text-lg font-semibold">{item?.name}</p>
              <p>₹{Number(item.price || 0).toLocaleString()}</p>
              {item?.quantity > 0 && <p className="text-gray-600"><strong>Quantity:</strong> {item?.quantity}</p>}
            </div>
          </div>
        )) : <p className="text-center text-gray-500">No products in checkout</p>}
      </div>

      {/* {availableCoupons.length > 0 && (
  <div className="mt-6 p-4 bg-white rounded-md shadow">
  <h4 className="text-lg font-semibold mb-2">Apply Coupon</h4>
  <div className="flex items-center space-x-3">
    <input
      type="text"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      placeholder="Enter coupon code"
      className="px-3 py-2 border border-gray-300 rounded"
    />
    <button
      onClick={applyCoupon}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Apply
    </button>
  </div>
  {appliedCoupon && (
    <p className="mt-2 text-green-600">Applied: {appliedCoupon.code} - {appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`} off</p>
  )}
</div>

)}
 */}


{availableCoupons.filter(coupon => !coupon.isUsed).length > 0 && (
  <div className="mt-6 p-4 bg-white rounded-md shadow">
    <h4 className="text-lg font-semibold mb-4">Available Coupons</h4>
    <div className="space-y-3">
      {availableCoupons
        .filter(coupon => !coupon.isUsed)
        .map((coupon, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
          >
            <div>
              <p className="text-blue-800 font-semibold">
                {coupon.code} - {coupon.discountPercentage}%
              </p>
              <p className="text-sm text-gray-500">
                Valid till {new Date(coupon.expiryDate).toLocaleDateString()}
              </p>
            </div>

            {/* <button
              onClick={() => applyCoupon(coupon.code)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Apply
            </button> */}
            {appliedCoupon?.code !== coupon.code && (
  <button
    onClick={() => applyCoupon(coupon.code)}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    Apply
  </button>
)}


          </div>
        ))}
    </div>

    {appliedCoupon && (
      <p className="mt-4 text-green-600">
        ✅ Applied: <strong>{appliedCoupon.code}</strong> -{" "}
        {appliedCoupon.discountPercentage}%
      </p>
    )}
  </div>
)}


      {/* <div className="text-2xl font-semibold text-gray-900 mb-4">Total Price: ₹{totalPrice.toLocaleString("en-IN")}</div> */}
      <div className="text-xl font-semibold text-gray-900 mb-4">
  {appliedCoupon ? (
    <>
      <div>Original: <span className="line-through text-gray-500">₹{totalPrice.toLocaleString()}</span></div>
      <div>Discounted Total: ₹{discountedTotal.toLocaleString("en-IN")}</div>
    </>
  ) : (
    <div>Total Price: ₹{totalPrice.toLocaleString("en-IN")}</div>
  )}
</div>

      <button onClick={handlePlaceOrder} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">Place Order (COD)</button>

      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Edit Address</h3>

            <input
              type="text"
              placeholder="Phone"
              name="phone"
              className="w-full p-2 mb-2 border rounded"
              value={editedAddress.phone}
              onChange={(e) => setEditedAddress({ ...editedAddress, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Building"
              name="building"
              className="w-full p-2 mb-2 border rounded"
              value={editedAddress.building}
              onChange={(e) => setEditedAddress({ ...editedAddress, building: e.target.value })}
            />
            <input
              type="text"
              placeholder="Street"
              name="street"
              className="w-full p-2 mb-2 border rounded"
              value={editedAddress.street}
              onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              className="w-full p-2 mb-2 border rounded"
              value={editedAddress.city}
              onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              className="w-full p-2 mb-2 border rounded"
              value={editedAddress.state}
              onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pincode"
              name="pinCode"
              className="w-full p-2 mb-4 border rounded"
              value={editedAddress.pinCode}
              onChange={(e) => setEditedAddress({ ...editedAddress, pinCode: e.target.value })}
            />

            <div className="flex justify-end gap-4">
              <button onClick={handleUpdateAddress} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              <button onClick={() => setShowAddressModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}





    </div>
  );
};

export default Checkout;
