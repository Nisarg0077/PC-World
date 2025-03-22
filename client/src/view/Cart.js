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
    const storedUser = sessionStorage.getItem("clientUser");
    if (!storedUser) {
      navigate("/login");
      
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch cart when user is available
  useEffect(() => {
    if (user) fetchCart(user.id);
    console.log(cart);
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

    setCart((prevCart) => {
      const updatedCartItems = prevCart.cartItems.map((item) =>
        item.product === productId ? { ...item, quantity: newQuantity } : item,
      console.log(productId._id)
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
  const handleCheckout = () => {
    console.log(cart.cartItems)
    navigate("/checkout", { state: { cartItems: cart.cartItems } });
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
    <div className="bg-gray-100 p-2 sm:p-2 md:p-4">
      <div className="container mx-auto py-2 px-2 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Shopping Cart</h2>

        {loading ? (
          <p>Loading cart...</p>
        ) : cart?.cartItems?.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Image</th>
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Product</th>
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Price</th>
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Quantity</th>
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Total</th>
                    <th className="border px-2 sm:px-4 py-2 text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.cartItems?.map((item) => (
                    <tr key={item.product._id} className="text-center">
                      <td className="border px-2 sm:px-4 py-2">
                        <img className="w-12 sm:w-20 mx-auto" src={`http://localhost:5000/images/`+item.imageUrl} alt={item.name} />
                        </td>
<td>{item.name}</td>
<td>₹{new Intl.NumberFormat().format(item.price)}</td>

                      <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">
                        <div className="flex items-center justify-center">
                          <button
                           onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="px-1 pb-1 rounded-xl mx-1 bg-gradient-to-r from-red-400 to-red-600 text-white text-xl font-bold"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="px-1 pb-1 rounded-xl mx-1 bg-gradient-to-r from-lime-400 to-emerald-500 text-white text-xl font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">
                        ₹{new Intl.NumberFormat().format((item.price * item.quantity))}
                      </td>
                      <td className="border px-2 sm:px-4 py-2 text-sm sm:text-base">
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600"
                        >
                          <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-0">
                Total: ₹
                {Intl.NumberFormat('en-IN').format(cart?.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))}

              </h3>

              <div className="flex gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
              >
                Clear Cart
              </button>
                <button
                  onClick={handleCheckout}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-bold"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;