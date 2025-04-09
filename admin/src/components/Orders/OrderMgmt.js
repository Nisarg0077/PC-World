// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
// import axios from "axios";
// import Sidebar from "../Sidebar";

// const OrdersMgmt = () => {
//     const [orders, setOrders] = useState([]);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate(); // ✅ Initialize navigate

//     useEffect(() => {
//         axios.get("http://localhost:5000/api/orders")
//             .then(res =>{
//                 setOrders(res.data);
//                 console.log(res.data)
//                 fetchUserDetails(res.data.userId);
//             })
                
//             .catch(err => console.error(err));
//     }, []);
//      const fetchUserDetails = async (id) => {
//             try {
//                 // console.log(id);
//                 const response = await axios.get(`http://localhost:5000/api/users/${id}`);
//                 if (response.status === 200) {
//                     setUser(response.data);
//                     // console.log(response.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching User details:", error);
//             }
//         };

//     const updateStatus = async (id, orderStatus, paymentStatus) => {
//         try {
//             const response = await axios.put(`http://localhost:5000/api/orders/${id}`, {
//                 orderStatus,
//                 paymentStatus,
//             });

//             if (response.status === 200) {
//                 setOrders(prevOrders => prevOrders.map(order =>
//                     order._id === id ? { ...order, orderStatus, paymentStatus } : order
//                 ));
//                 console.log("Order updated successfully:", response.data);
//             } else {
//                 console.error("Failed to update order:", response);
//             }
//         } catch (error) {
//             console.error("Error updating order:", error);
//         }
//     };

//     const deleteOrder = async (id) => {
//         if (window.confirm("Are you sure you want to delete this order?")) {
//             try {
//                 await axios.delete(`http://localhost:5000/api/orders/${id}`);
//                 setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
//             } catch (error) {
//                 console.error("Error deleting order:", error);
//             }
//         }
//     };

//     const viewOrder = (id) => {
//         navigate(`/vieworder?oid=${id}`); // ✅ Navigate to order details page
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             <Sidebar />
//             <div className="flex-1 p-6">
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Management</h2>
//                 <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
//                     <table className="w-full border-collapse border border-gray-300">
//                         <thead className="bg-gray-800 text-white">
//                             <tr>
//                                 <th className="p-3 text-left border border-gray-300">Order ID</th>
//                                 <th className="p-3 text-left border border-gray-300">User</th>
//                                 <th className="p-3 text-left border border-gray-300">Total</th>
//                                 <th className="p-3 text-left border border-gray-300">Payment</th>
//                                 <th className="p-3 text-left border border-gray-300">Status</th>
//                                 <th className="p-3 text-center border border-gray-300">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-gray-700">
//                             {orders.length > 0 ? (
//                                 orders.map(order => (
//                                     <tr key={order._id} className="border-t hover:bg-gray-50">
//                                         <td className="p-3 border border-gray-300">{order._id}</td>
//                                         <td className="p-3 border border-gray-300">{order.userId?.username || "N/A"}</td>
//                                         <td className="p-3 border border-gray-300">{order.shippingAddress.fullName}</td>
//                                         <td className="p-3 border border-gray-300">₹{order.totalAmount.toLocaleString('en-IN')}</td>

//                                         <td className="p-3 border border-gray-300">
//                                             <select
//                                                 className="w-full p-2 border rounded-md bg-gray-50"
//                                                 value={order.paymentStatus}
//                                                 onChange={(e) => updateStatus(order._id, order.orderStatus, e.target.value)}
//                                             >
//                                                 <option value="Pending">Pending</option>
//                                                 <option value="Paid">Paid</option>
//                                             </select>
//                                         </td>

//                                         <td className="p-3 border border-gray-300">
//                                             <select
//                                                 className="w-full p-2 border rounded-md bg-gray-50"
//                                                 value={order.orderStatus}
//                                                 onChange={e => updateStatus(order._id, e.target.value, order.paymentStatus)}
//                                             >
//                                                 <option value="Pending">Pending</option>
//                                                 <option value="Processing">Processing</option>
//                                                 <option value="Shipped">Shipped</option>
//                                                 <option value="Delivered">Delivered</option>
//                                                 <option value="Cancelled">Cancelled</option>
//                                             </select>
//                                         </td>

//                                         <td className="p-3 text-center border border-gray-300 flex gap-2 justify-center">
//                                             <button
//                                                 className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
//                                                 onClick={() => viewOrder(order._id)} // ✅ View button
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
//                                                 onClick={() => deleteOrder(order._id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="6" className="p-4 text-center text-gray-500">
//                                         No orders found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrdersMgmt;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";

const OrdersMgmt = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/orders");
                setOrders(res.data);

                // Extract unique userIds
                const userIds = [...new Set(res.data.map(order => order.userId?._id))];

                // Fetch user details in parallel
                const userFetches = await Promise.all(
                    userIds.map(id => axios.get(`http://localhost:5000/api/users/${id}`))
                );

                // Create user map
                const userMap = {};
                userFetches.forEach((response) => {
                    if (response.status === 200) {
                        userMap[response.data._id] = response.data.username;
                    }
                });

                setUsers(userMap);
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (id, orderStatus, paymentStatus) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/${id}`, {
                orderStatus,
                paymentStatus,
            });

            if (response.status === 200) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === id ? { ...order, orderStatus, paymentStatus } : order
                    )
                );
                console.log("Order updated successfully:", response.data);
            } else {
                console.error("Failed to update order:", response);
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const deleteOrder = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${id}`);
                setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    const viewOrder = (id) => {
        navigate(`/vieworder?oid=${id}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Management</h2>
                <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-3 text-left border border-gray-300">Order ID</th>
                                <th className="p-3 text-left border border-gray-300">User</th>
                                <th className="p-3 text-left border border-gray-300">Full Name</th>
                                <th className="p-3 text-left border border-gray-300">Total</th>
                                <th className="p-3 text-left border border-gray-300">Payment</th>
                                <th className="p-3 text-left border border-gray-300">Status</th>
                                <th className="p-3 text-center border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {[...orders].reverse().length > 0 ? (
                                [...orders].reverse().map(order => (
                                    <tr key={order._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 border border-gray-300">{order._id}</td>
                                        <td className="p-3 border border-gray-300">
                                            {users[order.userId?._id] || "Loading..."}
                                        </td>
                                        <td className="p-3 border border-gray-300">{order.shippingAddress.fullName}</td>
                                        <td className="p-3 border border-gray-300">₹{order.finalTotal.toLocaleString('en-IN')}</td>

                                        <td className="p-3 border border-gray-300">
                                            <select
                                                className="w-full p-2 border rounded-md bg-gray-50"
                                                value={order.paymentStatus}
                                                onChange={(e) => updateStatus(order._id, order.orderStatus, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                        </td>

                                        <td className="p-3 border border-gray-300">
                                            <select
                                                className="w-full p-2 border rounded-md bg-gray-50"
                                                value={order.orderStatus}
                                                onChange={e => updateStatus(order._id, e.target.value, order.paymentStatus)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>

                                        <td className="p-3 text-center border border-gray-300 flex gap-2 justify-center">
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                                                onClick={() => viewOrder(order._id)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                                onClick={() => deleteOrder(order._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersMgmt;
