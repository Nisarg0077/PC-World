import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { toast, ToastContainer } from 'react-toastify';

const EditUser = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        dateOfBirth: "",
        gender: "",
        dateOfJoining: "",
        isActive: false,
        isDeleted: false,
        profilePicture: "",
        role: "user",
    });

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');

    const roles = ['client', 'admin', 'seller'];
    const departments = ['Sales', 'Support', 'HR', 'IT', 'Marketing'];

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${uid}`)
            .then(response => {
                const userData = response.data;
                if (userData.dateOfBirth) {
                    const formattedDate = new Date(userData.dateOfBirth).toISOString().split('T')[0];
                    userData.dateOfBirth = formattedDate;
                }
                setUser(userData);
                setIsLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch user data');
                setIsLoading(false);
            });
    }, [uid]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true during update

        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('department', user.department);
        formData.append('gender', user.gender);
        formData.append('dateOfBirth', user.dateOfBirth);
        formData.append('isActive', user.isActive);
        formData.append('isDeleted', user.isDeleted);
        formData.append('role', user.role);

        if (file) {
            formData.append('image', file);
        }

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        axios.put(`http://localhost:5000/api/users/${uid}`, formData)
            .then(() => {
                toast.success('User updated successfully');
                // console.log("Gender submitted:", user.gender);
                navigate("/users");
            })
            .catch(error => {
                // console.error("API Error:", error);
                if (error.response) {
                    toast.error(`Failed to update user: ${error.response.data.message || error.message}`);
                } else if (error.request) {
                    toast.error('No response received from the server.');
                } else {
                    toast.error('Failed to update user. Please try again later.');
                }
            })
            .finally(() => setIsLoading(false)); // Set loading to false regardless of success/failure
    };

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;



  return (
    <div className="h-screen flex">
      <Sidebar />

      <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
        <ToastContainer />
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input 
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              name="role"
              value={user.role}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            >
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>

          {user.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select 
                name="department"
                value={user.department || ''}
                onChange={handleInputChange}
                className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
              >
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
          )}

          <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                    id="genderSelect"  // Add ID
                    name="gender"
                    value={user.gender}
                    onChange={handleInputChange}
                    className="input border-2 ..."
                >
                  <option value="">Select Gender</option> {/* Default option */}
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option> {/* Optional "other" option */}
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input 
              type="date"
              name="dateOfBirth"
              value={user.dateOfBirth || ""}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input 
              type="file"
              name='image'
              onChange={handleFileChange}
              className="input border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 w-full p-2"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input 
              type="checkbox"
              name="isActive"
              checked={user.isActive}
              onChange={handleInputChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300" 
            />
            <label className="text-sm text-gray-700">Is Active</label>
          </div>

          <div className="flex items-center space-x-3">
            <input 
              type="checkbox"
              name="isDeleted"
              checked={user.isDeleted}
              onChange={handleInputChange}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300" 
            />
            <label className="text-sm text-gray-700">Is Deleted</label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditUser;

