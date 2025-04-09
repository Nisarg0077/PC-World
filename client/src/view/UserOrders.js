import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";

const UserOrders = () => {
    const { state, dispatch, clearCart } = useCart();
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const clientUser = sessionStorage.getItem("clientUser");
        if (clientUser) {
            try {
                setUser(JSON.parse(clientUser)); // Parse JSON to get user object
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!user || !user.id) {
            console.error("User not logged in.");
            return;
        }

        axios.get(`http://localhost:5000/api/orders/user/${user.id}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error("Error fetching orders:", err));
    }, [user]); // Fetch orders when user is set

    // Function to return Tailwind class based on order status
    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-500 font-semibold"; // Yellow for pending
            case "Processing":
                return "text-blue-500 font-semibold"; // Blue for processing
            case "Delivered":
                return "text-green-500 font-semibold"; // Green for delivered
            case "Cancelled":
                return "text-red-500 font-semibold"; // Red for cancelled
            default:
                return "text-gray-500 font-semibold"; // Default gray
        }
    };
    const getPaymentStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-500 font-semibold";
            case "paid":
                return "text-green-500 font-semibold";
            default:
                return "text-gray-500 font-semibold"; // Default gray
        }
    };

    const handleCancelOrder = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) {
            // User pressed Cancel
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/${id}`, {
                orderStatus: "Cancelled",
            });
    
            if (response.status === 200) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === id ? { ...order, orderStatus: "Cancelled" } : order
                    )
                );
                console.log("✅ Order cancelled successfully:", response.data);
                alert("✅ Order cancelled successfully!");
            } else {
                console.error("❌ Failed to cancel order:", response);
                alert("❌ Failed to cancel order.");
            }
        } catch (error) {
            console.error("❌ Error cancelling order:", error);
            alert("❌ Error occurred while cancelling the order.");
        }
    };
    
    
      

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Orders</h2>
            <button onClick={() => navigate('/')} className="float-right bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 mb-4 text-white font-bold rounded-md">back</button>

            {[...orders].reverse().length > 0 ? (
                <div className="w-full max-w-4xl space-y-4">
                    {[...orders].reverse().map(order => (
                        <div key={order._id} className="bg-white p-4 shadow-md rounded-lg">
                            <div className="flex justify-between items-center border-b pb-2 mb-2">
                                <p className="text-gray-600 font-bold">Order Date: {new Date(order.orderedAt).toLocaleDateString()}</p>
                                <p className="text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
                                <p className={`p-1 ${order.isCustomBuild ? "text-white bg-yellow-500" : "text-white bg-green-500"}`}>{order.isCustomBuild ? "Custom Build" : "Normal Order"}</p>

                                <span className={`px-3 py-1 rounded-lg text-lg font-bold`}>
                                    Status: <strong className={getStatusClass(order.orderStatus)}>   
                                    {order.orderStatus}
                                    </strong>
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* ✅ Check if order.products exists before mapping */}
                                {order.items && order.items.length > 0 ? (
                                    order.items.map(item => (
                                        <div key={item._id} className="flex items-center gap-4 border-b pb-3">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                                            <div>
                                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                                <p className="text-gray-600">₹{item.price.toLocaleString('en-IN')} </p>
                                                <p className="text-gray-600">Quantity: {item.quantity} </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No products available for this order.</p>
                                )}
                            </div>

                            <div className="mt-3 flex justify-between">
                            <p className="text-gray-700 font-bold text-lg"> Total: ₹{order.originalTotal.toLocaleString('en-IN')}</p>
<p className="text-gray-700 font-bold text-lg">Discount: {order.discountPercent.toLocaleString('en-IN')}%</p>
<p className="text-gray-700 font-bold text-lg">Final Amount: ₹{order.finalTotal.toLocaleString('en-IN')}</p>

    <p className="text-gray-600 text-lg font-bold">Payment: <strong className={getPaymentStatusClass(order.paymentStatus)}>{order.paymentStatus}</strong></p>
</div>

{order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && order.paymentStatus !== 'paid' && (
    <button
        type="button"
        onClick={() => handleCancelOrder(order._id)}
        className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-200"
    >
        Cancel Order
    </button>
)}



                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-lg">No orders found.</p>
            )}
        </div>
    );
};

export default UserOrders;
