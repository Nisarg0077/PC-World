import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const EditProfile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: '',
    role: 'user',
    address: [{ street: '', city: '', state: '', zip: '' }],
  });

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const uid = new URLSearchParams(location.search).get('uid');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/${uid}`);
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
        }
        data.address = data.address?.length ? [data.address[0]] : [{ street: '', city: '', state: '', zip: '' }];
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) fetchUserData();
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      address: [{ ...prev.address[0], [name]: value }],
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (key === 'address') {
        formData.append(key, JSON.stringify(value)); // Stringify the address array
      } else {
        formData.append(key, value);
      }
    });

    if (file) formData.append('image', file);

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${uid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Fetch updated user data from the backend
      const updatedUser = response.data.user;

      // Update session storage
      const sessionData = JSON.parse(sessionStorage.getItem("ClientUser"));
      const updatedSessionData = { ...sessionData, ...updatedUser };
      sessionStorage.setItem("ClientUser", JSON.stringify(updatedSessionData));

      toast.success('User updated successfully');
      navigate('/userProfile');
      window.location.reload();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || 'Failed to update user.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="h-screen flex">
      <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
        <ToastContainer />
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {['firstName', 'lastName', 'email', 'phone'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={user[field]}
                onChange={handleInputChange}
                className="input border-2 border-gray-300 rounded-md w-full p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md w-full p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={user.dateOfBirth || ''}
              onChange={handleInputChange}
              className="input border-2 border-gray-300 rounded-md w-full p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="input border-2 border-gray-300 rounded-md w-full p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            />
          </div>

          {['street', 'city', 'state', 'zip'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={user.address[0]?.[field] || ''}
                onChange={handleAddressChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;