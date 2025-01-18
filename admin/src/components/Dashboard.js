import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");

    if (!AdminUser) {
      // navigate("/login");
    } else {
      const { firstName = "First Name", lastName = "Last Name" } = JSON.parse(AdminUser);
      setFirstName(firstName);
      setLastName(lastName);
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p>Welcome, {firstName} {lastName}!</p>
          {/* Your content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
