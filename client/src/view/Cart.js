import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    console.log(cart);
    
  // Fetch user data from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("ClientUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch cart when user is available
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  const fetchCart = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(response.data || { cartItems: [] });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart({ cartItems: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${user.id}/${productId}`, {
        quantity: newQuantity,
      });
      fetchCart(user.id);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

// const handleRemoveItem = async (productId) => {
//     try {
//       console.log("Removing item with product ID:", productId);
  
//       await axios.delete(`http://localhost:5000/api/cart/remove/${user.id}/${productId}`);
//       fetchCart(user.id);
//     } catch (error) {
//       console.error("Failed to remove item:", error.response?.data || error);
//     }
// };



const handleRemoveItem = async (productId) => {
    try {
        console.log("Removing item with product ID:", productId);

        // Update state immediately before API call
        setCart((prevCart) => ({
            ...prevCart,
            cartItems: prevCart.cartItems.filter(item => item.product !== productId)
        }));

        await axios.delete(`http://localhost:5000/api/cart/remove/${user.id}/${productId}`);

        fetchCart(user.id); // Fetch updated cart from backend
    } catch (error) {
        console.error("Failed to remove item:", error.response?.data || error);
    }
};


const handleClearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/clear/${user.id}`);
      fetchCart(user.id);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

        {loading ? (
          <p>Loading cart...</p>
        ) : cart?.cartItems?.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart?.cartItems?.map((item) => (
                  <tr key={item.product} className="text-center">
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-300 rounded-md mx-1"
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-300 rounded-md mx-1"
                      >
                        +
                      </button>
                    </td>
                    <td className="border px-4 py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between items-center">
              {/* <h3 className="text-xl font-bold">
                Total: ₹
                {cart?.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </h3> */}

<h3 className="text-xl font-bold">
    Total: ₹
    {cart?.cartItems?.length > 0
        ? cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
        : "0.00"}
</h3>

              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
