// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar";
// import axios from "axios";
// import { toast } from "react-toastify";

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [User, setUser] = useState(null);
//   const navigate = useNavigate();


//   // console.log(users)
//   // Check AdminUser session
//   useEffect(() => {
//     const AdminUser = sessionStorage.getItem("AdminUser");
//     if (!AdminUser) {
//       navigate("/login");
//     } else {
//       setUser(JSON.parse(AdminUser));
//       // console.log(AdminUser);
//     }
//   }, [navigate]);

//   // Fetch users data
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/users")
//       .then((res) => {
//         const usersList = res.data;
//         setUsers(usersList);
//         setFilteredUsers(usersList);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   // Handle Delete User
//   const handleDelete = async (userId) => {
//     // console.log('Deleting user with ID:', userId);

//     // Confirm before deletion
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         // Make the DELETE request to the backend API
//         const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
//         console.log(response.data.message);  // Success message from the server
//         const updatedUsers = users.filter((user) => user._id !== userId);

//         // Update the state with the remaining users
//         setUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);

//         // Show success toast notification
//         toast.success('User deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting user:', error);
//         toast.error('Failed to delete user.');
//       }
//     }
//   };

//   // Handle Edit User
//   const handleEdit = (userId) => {
//     navigate(`/edit-user?uid=${userId}`);
//     // console.log(userId);
    
//   };

//   // Handle Search
//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     const filtered = users.filter((user) =>
//       user.username.toLowerCase().includes(term)
//     );
//     setFilteredUsers(filtered);
//   };

//   return (
//     <div className="h-screen flex">
      
//         <Sidebar />
//             <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-xl font-bold">Users Management</h1>
//         </div>

//         {/* Search */}
//         <div className="flex items-center mb-4 space-x-4">
//           <input
//             type="text"
//             placeholder="Search Users..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
//           <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2">#</th>
//                 <th className="border px-4 py-2">firstName</th>
//                 <th className="border px-4 py-2">lastName</th>
//                 <th className="border px-4 py-2">username</th>
//                 <th className="border px-4 py-2">Email</th>
//                 <th className="border px-4 py-2">Role</th>
//                 <th className="border px-4 py-2">Status</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user, index) => (
//                 <tr key={user._id} className="text-center">
//                   <td className="border px-4 py-2">{index + 1}</td>
//                   <td className="border px-4 py-2">{user.firstName}</td>
//                   <td className="border px-4 py-2">{user.lastName}</td>
//                   <td className="border px-4 py-2">{user.username}</td>
//                   <td className="border px-4 py-2">{user.email}</td>
//                   <td className="border px-4 py-2">{user.role}</td>
//                   {user.isActive === true ? (
//                       <td className="border px-4 py-2 font-bold text-green-500">Active <i class="fa fa-toggle-on" aria-hidden="true"></i></td>

//                   ):(
//                     <td className="border px-4 py-2 font-bold text-red-500">In Active<i class="fa fa-toggle-off ml-1" aria-hidden="true"></i></td>
//                   )
                  
                  
//                   }
//                   <td className="border px-4 py-2 space-x-2">
//                     {/* <button
//                       onClick={() => handleEdit(user._id)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                     >
//                       <i class="fa fa-pencil" aria-hidden="true"></i>
//                     </button> */}
//                     <button
//                       onClick={() => handleDelete(user._id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                     >
//                       <i class="fa fa-trash" aria-hidden="true"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ): (
//           <p>No users available</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default UsersManagement;
 

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [User, setUser] = useState(null);
  const [coupons, setCoupons] = useState([]);
const [activeCoupons, setActiveCoupons] = useState([]);

useEffect(() => {
  axios.get("http://localhost:5000/api/coupons")
    .then(res => {
      const allCoupons = res.data;
      console.log(allCoupons.length)

      // Filter only active (non-expired) coupons
      const today = new Date();
      const active = allCoupons.filter(coupon => new Date(coupon.expiryDate) >= today);
      
      setCoupons(allCoupons);
      setActiveCoupons(active);
    })
    .catch(err => {
      console.error("Error fetching coupons:", err);
    });
}, []);


  const navigate = useNavigate();


  // console.log(users)
  // Check AdminUser session
  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");
    if (!AdminUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(AdminUser));
      // console.log(AdminUser);
    }
  }, [navigate]);

  // Fetch users data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        const usersList = res.data;
        setUsers(usersList);
        setFilteredUsers(usersList);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const getUserDisplayName = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? `${user.username} (${user.email})` : 'Unknown User';
  };
  
  // Handle Delete User
  const handleDelete = async (userId) => {
    // console.log('Deleting user with ID:', userId);

    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Make the DELETE request to the backend API
        const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
        console.log(response.data.message);  // Success message from the server
        const updatedUsers = users.filter((user) => user._id !== userId);

        // Update the state with the remaining users
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Show success toast notification
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
      }
    }
  };


  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };


  const [showCouponModal, setShowCouponModal] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [couponData, setCouponData] = useState({
  code: "",
  discountType: "percentage",
  discountValue: "",
  expiresAt: ""
});

const generateCouponCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
};

const handleGiveCoupon = (userId) => {
  const generatedCode = generateCouponCode();
  const expiryDate = getFutureDate(7); // 7 days later
  console.log(userId)
  setCouponData({
    code: generatedCode,
    discountType: "percentage",
    discountValue: "",
    expiresAt: expiryDate,
    assignedTo: userId 
  });
  
  setSelectedUserId(userId);
  setShowCouponModal(true);
};

console.log("selected User: ", selectedUserId);



const handleCouponChange = (e) => {
  setCouponData({ ...couponData, [e.target.name]: e.target.value });
};

const handleCouponSubmit = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/createCoupon", {
      code: couponData.code,
      discountPercentage: couponData.discountValue, // <-- use this instead of 'discountValue' directly
      userId: selectedUserId,
      expiryDate: couponData.expiresAt
    });
    
    toast.success("Coupon assigned successfully!");
    setShowCouponModal(false);
    setCouponData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      expiresAt: ""
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to assign coupon.");
  }
};

const getActiveCoupons = (user) => {
  if (!user || !user.coupons) return [];
  return user.coupons.filter(coupon => coupon.isUsed);
};



  return (
    <div className="h-screen flex">
      
        <Sidebar />
            <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Users Management</h1>
        </div>

        {/* Search */}
        <div className="flex items-center mb-4 space-x-4">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
  <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg overflow-hidden">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">#</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">First Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">Last Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">Username</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-black tracking-wider">Role</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-black tracking-wider">Give Discount</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-black tracking-wider">Active Coupons</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-black tracking-wider">Status</th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-black tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {filteredUsers.map((user, index) => (
        <tr key={user._id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{index + 1}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.firstName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.lastName}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.username}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.role}</td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
              onClick={() => handleGiveCoupon(user._id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-150 ease-in-out"
            >
              <i className="fa fa-gift mr-1" aria-hidden="true"></i> Give
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
  {coupons.filter(
    (coupon) =>
      coupon.assignedTo === user._id &&
      !coupon.isUsed &&
      new Date(coupon.expiryDate) > new Date()
  ).length > 0 ? (
    <span>{coupons.filter(
      (coupon) =>
        coupon.assignedTo === user._id &&
        !coupon.isUsed &&
        new Date(coupon.expiryDate) > new Date()
    ).length} active coupon(s)</span>
  ) : (
    <span className="text-gray-500 text-sm">No active coupons</span>
  )}
</td>

          <td className="px-6 py-4 whitespace-nowrap text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              <i className="fa fa-trash-o" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-center text-gray-500">No users found</p>
)}

{/* Coupon Modal */}
{showCouponModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Assign Coupon</h2>
      {/* Coupon Code - Auto-generated & read-only */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
      <input
        type="text"
        name="code"
        value={couponData.code}
        readOnly
        className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
      />
      {/* Discount Value in Percentage */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
      <div className="relative mb-4">
        <input
          type="number"
          name="discountValue"
          placeholder="Enter discount"
          value={couponData.discountValue}
          onChange={handleCouponChange}
          className="w-full p-2 border border-gray-300 rounded pr-10"
        />
        <span className="absolute top-2.5 right-3 text-gray-500 text-sm">%</span>
      </div>
      {/* Assigned User */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
      <input
        type="text"
        value={getUserDisplayName(couponData.assignedTo)}
        readOnly
        className="w-full mb-4 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
      />
      {/* Expiry Date - Auto-generated & read-only */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
      <input
        type="date"
        name="expiresAt"
        value={couponData.expiresAt}
        readOnly
        className="w-full mb-6 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
      />
      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowCouponModal(false)}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleCouponSubmit}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Assign
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default UsersManagement;
 

