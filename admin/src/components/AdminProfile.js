import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const AdminProfile = () => {
  const [user, setUser] = useState(null);  // ✅ Fix: Start with `null`
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedAdmin = sessionStorage.getItem("AdminUser");
        
      if (!storedAdmin) {
        console.error("AdminUser not found in sessionStorage");
        navigate("/login");
        return;
      }
  
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        console.log("Fetching user:", parsedAdmin.username);  // ✅ Debugging
  
        const response = await axios.post("http://localhost:5000/api/admin/user", {
          username: parsedAdmin.username
        });
  
        if (response.data) {
          console.log("User data received:", response.data);  // ✅ Debugging
          setUser(response.data);
        } else {
          console.error("Empty user data received");
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };
  
    fetchUserData();
  }, []);
  
  if (!user) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
   

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md hidden md:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

            <div className="flex items-center space-x-6">
              {/* Profile Image Placeholder */}
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-200">
                <span className="text-3xl font-bold text-gray-600">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Username:</span> {user?.username}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Full Name:</span> {user?.firstName} {user?.lastName}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Role:</span> {user?.role}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Phone:</span> {user?.phone}
                </p>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Address</h3>
              <p className="text-lg text-gray-700">{user?.address?.street}</p>
              <p className="text-lg text-gray-700">
                {user?.address?.city}, {user?.address?.state} - {user?.address?.zip}
              </p>
            </div>

            {/* Account Info */}
            <div className="mt-6">
  <h3 className="text-xl font-semibold text-gray-800">Account Information</h3>
  <p className="text-lg text-gray-700">
    <span className="font-semibold">Created At: </span> 
    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
  </p>
  <p className="text-lg text-gray-700">
    <span className="font-semibold">Last Updated: </span> 
    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
  </p>
</div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
