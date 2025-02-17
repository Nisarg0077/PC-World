import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [user, setUser] = useState(null); // Start with null, because it's an object
  const navigate = useNavigate();

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");

    if (!AdminUser) {
      navigate("/login");
    } else {
      // Parse the AdminUser string into an object
      setUser(JSON.parse(AdminUser)); // Assuming the session data is a JSON string
    }
  }, [navigate]);

  // Conditional rendering in case the user is not available yet
  if (!user) {
    return <p>Loading...</p>; // Show loading state while user data is fetched
  }

  return (
    <div className="h-screen flex flex-col">
  

      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p>Welcome, {user.firstName} {user.lastName}</p>
          {/* Your content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
