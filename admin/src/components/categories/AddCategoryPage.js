import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Sidebar';

const AddCategoryPage = () => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing categories
    axios.get('http://localhost:5000/api/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error('Failed to fetch categories');
      });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', categoryData);
      toast.success('Category added successfully!');
      navigate('/categories'); // Navigate back to the categories page
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        
            <Sidebar/>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block font-medium mb-2">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={categoryData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category Description */}
            <div>
              <label htmlFor="description" className="block font-medium mb-2">Category Description</label>
              <textarea
                id="description"
                name="description"
                value={categoryData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add Category
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddCategoryPage;
