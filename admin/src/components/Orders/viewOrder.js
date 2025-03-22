// import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import Sidebar from "../Sidebar";

// const ViewOrder = () => {
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const params = new URLSearchParams(window.location.search);
//     const oid = params.get('oid');
//     const navigate = useNavigate();
//     useEffect(() => {
//         if (oid) {
//             axios.get(`http://localhost:5000/api/orders/${oid}`)
//                 .then(res => {
//                     if (res.data.success) {
//                         setOrder(res.data.order);
//                     } else {
//                         setError("Order not found");
//                     }
//                     setLoading(false);
//                 })
//                 .catch(err => {
//                     console.error("Error fetching order:", err);
//                     setError(err.response?.data?.message || "Failed to fetch order details.");
//                     setLoading(false);
//                 });
//         }
//     }, [oid]);

//     if (loading) return <p className="text-gray-500 text-center py-4">Loading order details...</p>;
//     if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
//     if (!order) return <p className="text-gray-500 text-center py-4">Order not found.</p>;

//     // Status styling
//     const statusStyles = {
//         payment: {
//             Paid: "bg-green-100 text-green-800",
//             Pending: "bg-yellow-100 text-yellow-800"
//         },
//         order: {
//             Delivered: "bg-green-100 text-green-800",
//             Cancelled: "bg-red-100 text-red-800",
//             Processing: "bg-blue-100 text-blue-800",
//             Shipped: "bg-purple-100 text-purple-800",
//             Pending: "bg-gray-100 text-gray-800"
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             <Sidebar />

//             <div className="flex-1 p-6">
//             <button onClick={() => navigate('/Order')} className="float-right bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white font-bold rounded-md">back</button>
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Details</h2>

//                 <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
//                     <table className="w-full border-collapse border border-gray-300">
//                         <tbody className="text-gray-700">
//                             {/* Order Information */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Order ID</td>
//                                 <td className="p-3 border border-gray-300">{oid}</td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Customer Name</td>
//                                 <td className="p-3 border border-gray-300">
//                                     {order.shippingAddress?.fullName || "N/A"}
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Phone Number</td>
//                                 <td className="p-3 border border-gray-300">
//                                     +91{order.shippingAddress?.phone || "N/A"}
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Phone Number</td>
//                                 <td className="p-3 border border-gray-300">
//                                     {order.email || "N/A"}
//                                 </td>
//                             </tr>
                            
//                             {/* Financial Information */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Total Amount</td>
//                                 <td className="p-3 border border-gray-300 font-medium">
//                                     ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
//                                 </td>
//                             </tr>
                            
//                             {/* Status Information */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Payment Status</td>
//                                 <td className="p-3 border border-gray-300">
//                                     <span className={`px-2 py-1 rounded ${statusStyles.payment[order.paymentStatus]}`}>
//                                         {order.paymentStatus || "N/A"}
//                                     </span>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Order Status</td>
//                                 <td className="p-3 border border-gray-300">
//                                     <span className={`px-2 py-1 rounded ${statusStyles.order[order.orderStatus]}`}>
//                                         {order.orderStatus || "N/A"}
//                                     </span>
//                                 </td>
//                             </tr>
                            
//                             {/* Shipping Address */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Shipping Address</td>
//                                 <td className="p-3 border border-gray-300">
//                                     {order.shippingAddress ? (
//                                         <div className="space-y-1">
//                                             <p>{order.shippingAddress.building}</p>
//                                             <p>{order.shippingAddress.street}</p>
//                                             <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
//                                             <p>PIN: {order.shippingAddress.pinCode}</p>
//                                         </div>
//                                     ) : "N/A"}
//                                 </td>
//                             </tr>
                            
//                             {/* Ordered Items with Images */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Ordered Items</td>
//                                 <td className="p-3 border border-gray-300">
//                                     {order.items?.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {order.items.map((item, index) => (
//                                                 <div key={index} className="flex items-start gap-4 pb-2 border-b last:border-b-0">
//                                                     <img 
//                                                         src={item.imageUrl}
//                                                         alt={item.name}
//                                                         className="w-20 h-20 object-cover rounded"
//                                                         onError={(e) => {
//                                                             e.target.style.display = 'none';
//                                                         }}
//                                                     />
//                                                     <div className="flex-1">
//                                                         <p className="font-medium">{item.name}</p>
//                                                         <p className="text-gray-600">
//                                                             {item.quantity} x ₹{item.price?.toLocaleString('en-IN')}
//                                                         </p>
//                                                         <p className="text-sm text-gray-500">
//                                                             Total: ₹{(item.quantity * item.price).toLocaleString('en-IN')}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         "No items found"
//                                     )}
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ViewOrder;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../Sidebar";

// const ViewOrder = () => {
//     const [order, setOrder] = useState(null);
//     const [userAadhaar, setUserAadhaar] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const params = new URLSearchParams(window.location.search);
//     const [imagePreview, setImagePreview] = useState(null);
//     const oid = params.get("oid");
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (oid) {
//             axios.get(`http://localhost:5000/api/orders/${oid}`)
//                 .then(res => {
//                     if (res.data.success) {
//                         setOrder(res.data.order);
//                         fetchAadhaarDetails(res.data.order.userId);  // ✅ Fetch Aadhaar Details
//                     } else {
//                         setError("Order not found");
//                     }
//                     setLoading(false);
//                 })
//                 .catch(err => {
//                     console.error("Error fetching order:", err);
//                     setError(err.response?.data?.message || "Failed to fetch order details.");
//                     setLoading(false);
//                 });
//         }
//     }, [oid]);

//     // ✅ Fetch Aadhaar Details
//     const fetchAadhaarDetails = async (userId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/user/aadhar/${userId}`);
//             if (response.data.success) {
//                 setUserAadhaar(response.data.aadhaar);
//             }
//         } catch (error) {
//             console.error("Error fetching Aadhaar details:", error);
//         }
//     };

//     if (loading) return <p className="text-gray-500 text-center py-4">Loading order details...</p>;
//     if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
//     if (!order) return <p className="text-gray-500 text-center py-4">Order not found.</p>;

//     // ✅ Status styling
//     const statusStyles = {
//         payment: {
//             Paid: "bg-green-100 text-green-800",
//             Pending: "bg-yellow-100 text-yellow-800"
//         },
//         order: {
//             Delivered: "bg-green-100 text-green-800",
//             Cancelled: "bg-red-100 text-red-800",
//             Processing: "bg-blue-100 text-blue-800",
//             Shipped: "bg-purple-100 text-purple-800",
//             Pending: "bg-gray-100 text-gray-800"
//         }
//     };
//     const closeImagePreview = () => {
//         setImagePreview(null);
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             <Sidebar />

//             <div className="flex-1 p-6">
//                 <button onClick={() => navigate('/Order')} className="float-right bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white font-bold rounded-md">Back</button>
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Details</h2>

//                 <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
//                     <table className="w-full border-collapse border border-gray-300">
//                         <tbody className="text-gray-700">
//                             {/* ✅ Order Information */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Order ID</td>
//                                 <td className="p-3 border border-gray-300">{oid}</td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Customer Name</td>
//                                 <td className="p-3 border border-gray-300">{order.shippingAddress?.fullName || "N/A"}</td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Phone Number</td>
//                                 <td className="p-3 border border-gray-300">+91{order.shippingAddress?.phone || "N/A"}</td>
//                             </tr>
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Email</td>
//                                 <td className="p-3 border border-gray-300">{order.email || "N/A"}</td>
//                             </tr>

//                             {/* ✅ Payment Status */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Payment Status</td>
//                                 <td className="p-3 border border-gray-300">
//                                     <span className={`px-2 py-1 rounded ${statusStyles.payment[order.paymentStatus]}`}>
//                                         {order.paymentStatus || "N/A"}
//                                     </span>
//                                 </td>
//                             </tr>

//                             {/* ✅ Order Status */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Order Status</td>
//                                 <td className="p-3 border border-gray-300">
//                                     <span className={`px-2 py-1 rounded ${statusStyles.order[order.orderStatus]}`}>
//                                         {order.orderStatus || "N/A"}
//                                     </span>
//                                 </td>
//                             </tr>

//                             {/* ✅ Aadhaar Details */}
//                             {userAadhaar && (
//                                 <tr>
//                                     <td className="p-3 font-semibold border border-gray-300">Aadhaar Details</td>
//                                     <td className="p-3 border border-gray-300">
//                                         <p><strong>Aadhaar Number:</strong> {userAadhaar.aadharNumber}</p>
//                                         <div className="flex gap-4 mt-2">
//                                             <div>
//                                                 <img 
//                                                     src={`http://localhost:5000/images/${userAadhaar.aadharFront}`} 
//                                                     alt="Aadhaar Front"
//                                                     className="w-40 h-28 object-cover rounded shadow-md border border-gray-300"
//                                                 />
//                                                 <p className="text-sm text-gray-500 text-center mt-1">Front</p>
//                                             </div>
//                                             <div>
//                                                 <img 
//                                                     src={`http://localhost:5000/images/${userAadhaar.aadharBack}`} 
//                                                     alt="Aadhaar Back"
//                                                     className="w-40 h-28 object-cover rounded shadow-md border border-gray-300"
//                                                 />
//                                                 <p className="text-sm text-gray-500 text-center mt-1">Back</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}

//                             {/* ✅ Ordered Items */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Ordered Items</td>
//                                 <td className="p-3 border border-gray-300">
//                                     {order.items?.length > 0 ? (
//                                         <div className="space-y-4">
//                                             {order.items.map((item, index) => (
//                                                 <div key={index} className="flex items-start gap-4 pb-2 border-b last:border-b-0">
//                                                     <img 
//                                                         src={item.imageUrl}  
//                                                         alt={item.name}
//                                                         className="w-20 h-20 object-cover rounded"
//                                                     />
//                                                     <div className="flex-1">
//                                                         <p className="font-medium">{item.name}</p>
//                                                         <p className="text-gray-600">{item.quantity} x ₹{item.price?.toLocaleString('en-IN')}</p>
//                                                         <p className="text-sm text-gray-500">
//                                                             Total: ₹{(item.quantity * item.price).toLocaleString('en-IN')}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : "No items found"}
//                                 </td>
//                             </tr>

//                             {imagePreview && (
//                 <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
//                     <div className="relative">
//                         <img src={imagePreview} alt="Aadhaar Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
//                         <button 
//                             onClick={closeImagePreview} 
//                             className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full font-semibold shadow-lg"
//                         >
//                             ✕
//                         </button>
//                     </div>
//                 </div>
//             )}

//                             {/* ✅ Total Amount */}
//                             <tr>
//                                 <td className="p-3 font-semibold border border-gray-300">Total Amount</td>
//                                 <td className="p-3 border border-gray-300 font-medium">
//                                     ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ViewOrder;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";

const ViewOrder = () => {
    const [order, setOrder] = useState(null);
    const [userAadhaar, setUserAadhaar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);  // ✅ Image Preview State
    console.log(userAadhaar)
    const params = new URLSearchParams(window.location.search);
    const oid = params.get("oid");
    const navigate = useNavigate();

    useEffect(() => {
        if (oid) {
            axios.get(`http://localhost:5000/api/orders/${oid}`)
                .then(res => {
                    if (res.data.success) {
                        setOrder(res.data.order);
                        fetchAadhaarDetails(res.data.order.userId);  
                    } else {
                        setError("Order not found");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching order:", err);
                    setError(err.response?.data?.message || "Failed to fetch order details.");
                    setLoading(false);
                });
        }
    }, [oid]);

    // ✅ Fetch Aadhaar Details
    const fetchAadhaarDetails = async (userId) => {
        try {
            console.log(userId)
            const response = await axios.get(`http://localhost:5000/api/user/aadhar/${userId}`);
            if (response.data.success) {
                setUserAadhaar(response.data.aadhaar);
            }
        } catch (error) {
            console.error("Error fetching Aadhaar details:", error);
        }
    };
    const statusStyles = {
                payment: {
                    Paid: "bg-green-100 text-green-800",
                    Pending: "bg-yellow-100 text-yellow-800"
                },
                order: {
                    Delivered: "bg-green-100 text-green-800",
                    Cancelled: "bg-red-100 text-red-800",
                    Processing: "bg-blue-100 text-blue-800",
                    Shipped: "bg-purple-100 text-purple-800",
                    Pending: "bg-gray-100 text-gray-800"
                }
            };

    // ✅ Close Image Modal
    const closeImagePreview = () => {
        setImagePreview(null);
    };

    if (loading) return <p className="text-gray-500 text-center py-4">Loading order details...</p>;
    if (error) return <p className="text-red-500 text-center py-4">{error}</p>;
    if (!order) return <p className="text-gray-500 text-center py-4">Order not found.</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 p-6">
                <button onClick={() => navigate('/Order')} className="float-right bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white font-bold rounded-md">Back</button>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Details</h2>

                <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
                    <table className="w-full border-collapse border border-gray-300">
                        <tbody className="text-gray-700">
                            {/* ✅ Order Information */}
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Order ID</td>
                                <td className="p-3 border border-gray-300">{oid}</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Customer Name</td>
                                <td className="p-3 border border-gray-300">{userAadhaar?.username || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Customer Name</td>
                                <td className="p-3 border border-gray-300">{order.shippingAddress?.fullName || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Phone Number</td>
                                <td className="p-3 border border-gray-300">+91{order.shippingAddress?.phone || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Email</td>
                                <td className="p-3 border border-gray-300">{order.email || "N/A"}</td>
                            </tr>
                            <tr>
                                 <td className="p-3 font-semibold border border-gray-300">Payment Status</td>
                                 <td className="p-3 border border-gray-300">
                                     <span className={`px-2 py-1 rounded ${statusStyles.payment[order.paymentStatus]}`}>
                                         {order.paymentStatus || "N/A"}
                                     </span>
                                 </td>
                             </tr>
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Order Status</td>
                                <td className="p-3 border border-gray-300">
                                     <span className={`px-2 py-1 rounded ${statusStyles.order[order.orderStatus]}`}>
                                       {order.orderStatus || "N/A"}
                                    </span>
                                 </td>
                             </tr>

                            {/* ✅ Aadhaar Details */}
                            {userAadhaar && (
                                <tr>
                                    <td className="p-3 font-semibold border border-gray-300">Aadhaar Details</td>
                                    <td className="p-3 border border-gray-300">
                                        <p><strong>Aadhaar Number:</strong> {userAadhaar.aadharNumber}</p>
                                        <div className="flex gap-4 mt-2">
                                            <div>
                                                <img 
                                                    src={`http://localhost:5000/images/${userAadhaar.aadharFront}`} 
                                                    alt="Aadhaar Front"
                                                    className="w-40 h-28 object-cover rounded shadow-md border border-gray-300 cursor-pointer"
                                                    onClick={() => setImagePreview(`http://localhost:5000/images/${userAadhaar.aadharFront}`)}  // ✅ Open Image Modal
                                                />
                                                <p className="text-sm text-gray-500 text-center mt-1">Front</p>
                                            </div>
                                            <div>
                                                <img 
                                                    src={`http://localhost:5000/images/${userAadhaar.aadharBack}`} 
                                                    alt="Aadhaar Back"
                                                    className="w-40 h-28 object-cover rounded shadow-md border border-gray-300 cursor-pointer"
                                                    onClick={() => setImagePreview(`http://localhost:5000/images/${userAadhaar.aadharBack}`)}  // ✅ Open Image Modal
                                                />
                                                <p className="text-sm text-gray-500 text-center mt-1">Back</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* ✅ Ordered Items */}
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Ordered Items</td>
                                <td className="p-3 border border-gray-300">
                                    {order.items?.length > 0 ? (
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-start gap-4 pb-2 border-b last:border-b-0">
                                                    <img 
                                                        src={item.imageUrl}  
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-gray-600">{item.quantity} x ₹{item.price?.toLocaleString('en-IN')}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Total: ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : "No items found"}
                                </td>
                            </tr>

                            {/* ✅ Total Amount */}
                            <tr>
                                <td className="p-3 font-semibold border border-gray-300">Total Amount</td>
                                <td className="p-3 border border-gray-300 font-medium">
                                    ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ Image Preview Modal */}
            {imagePreview && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
                    <div className="relative">
                        <img src={imagePreview} alt="Aadhaar Preview" className="max-w-full max-h-[70vh] rounded-lg shadow-lg" />
                        <button 
                            onClick={closeImagePreview} 
                            className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full font-semibold shadow-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewOrder;
