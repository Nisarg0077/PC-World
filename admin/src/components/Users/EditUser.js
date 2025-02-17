import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { toast, ToastContainer } from 'react-toastify';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get('uid');
  
  // Fetch user data on component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${uid}`)
      .then(response => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch user data');
        setIsLoading(false);
      });
  }, [uid]);

  // Handle form submission for updating user
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/users/${uid}`, user)
      .then(response => {
          navigate("/users")
          toast.success('User updated successfully');
      })
      .catch(err => {
        toast.error('Failed to update user');
      });
  };

  // Conditional rendering based on the user’s role
  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen flex">
      <aside className="w-64 min-h-screen bg-white shadow-lg">
        <Sidebar />
      </aside>
      <main className="flex-grow bg-gray-100 p-8 overflow-y-auto">
        <ToastContainer />
        <h2 className="text-3xl font-semibold mb-6">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Conditional fields for Admin or Seller */}
          {user.role === 'admin' && (
            <div className="form-group">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                id="department"
                value={user.department || ''}
                onChange={(e) => setUser({ ...user, department: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          <div className="form-group flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={user.isActive}
              onChange={(e) => setUser({ ...user, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Is Active</label>
          </div>

          <div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600">
              Update User
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditUser;
