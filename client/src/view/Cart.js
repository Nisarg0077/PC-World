import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { state, dispatch } = useCart();
  const navigate = useNavigate();



  // Fetch user from session storage
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
    if (user) fetchCart(user.id);
  }, [user]);

  // Listen for cart updates
  useEffect(() => {
    const updateCartCount = () => {
      if (user) fetchCart(user.id);
    };
  
    window.addEventListener("cartUpdated", updateCartCount);
  
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [user]);
  

  const fetchCart = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(data || { cartItems: [] });
      dispatch({ type: "SET_CART", payload: data.cartItems || [] });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart({ cartItems: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
  
    console.log("Updating product:", productId, "New quantity:", newQuantity); 
  
    setCart((prevCart) => {
      const updatedCartItems = prevCart.cartItems.map((item) =>
        item.product === productId ? { ...item, quantity: newQuantity } : item
      );
    
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { product: productId, quantity: newQuantity },
      });
    
      return { ...prevCart, cartItems: updatedCartItems };
    });
    
  
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${user.id}/${productId}`, {
        quantity: newQuantity,
      });
  
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };
  
  

  const handleRemoveItem = async (productId) => {
    try {
      setCart((prevCart) => ({
        ...prevCart,
        cartItems: prevCart.cartItems.filter((item) => item.product !== productId),
      }));

      dispatch({ type: "REMOVE_ITEM", payload: productId });

      await axios.delete(`http://localhost:5000/api/cart/remove/${user.id}/${productId}`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/clear/${user.id}`);
      dispatch({ type: "CLEAR_CART" });
      setCart({ cartItems: [] });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-4 px-20">
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
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
              {cart?.cartItems?.map((item) => (
                    <tr key={item.product._id}>
                      <td className="border px-4 py-2">
                        <img className="w-20" src={item.product.imageUrl} alt={item.product.name} width="50" />
                      </td>
                      <td className="border px-4 py-2 font-bold">{item.product.name}</td>
                      <td className="border px-4 py-2">₹{item.product.price}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-300 rounded-md mx-1"
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-300 rounded-md mx-1"
                        >
                          +
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
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
              <h3 className="text-xl font-bold">
                Total: ₹
                {cart?.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
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
