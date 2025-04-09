import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../Sidebar';

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  // Extract category ID (cid) from query parameters
  const queryParams = new URLSearchParams(location.search);
  const cid = queryParams.get('cid');

  useEffect(() => {
    if (!cid) {
      toast.error('Category ID is missing');
      navigate('/categories');
    }

    // Fetch category data to edit using the ID from query parameters
    axios
      .get(`http://localhost:5000/api/category/${cid}`)
      .then((res) => {
        setCategoryData(res.data); // Set category data for editing
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
        toast.error('Failed to fetch category data');
      });
  }, [cid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/category/${cid}`, categoryData);
      toast.success('Category updated successfully!');
      navigate('/categories');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="h-screen flex flex-col">


      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <ToastContainer />
          <h1 className="text-xl font-bold mb-4">Edit Category</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-2">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                placeholder="Enter Category Name"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                placeholder="Enter Category Description"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Save Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditCategoryPage;
