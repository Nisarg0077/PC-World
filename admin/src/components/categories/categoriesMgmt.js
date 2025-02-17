import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../Sidebar';
import axios from 'axios';

const Categories = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Check AdminUser session
  useEffect(() => {
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch categories data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories') // Update your API endpoint
      .then((res) => {
        const categories = res.data.categories || res.data;
        setData(categories);
        setFilteredData(categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Handle Delete Category
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      axios
        .delete(`http://localhost:5000/api/categories/${id}`) // Update your API endpoint
        .then(() => {
          const updatedData = data.filter((category) => category._id !== id);
          setData(updatedData);
          setFilteredData(updatedData);
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
        });
    }
  };

  // Handle Edit Category
  const handleEdit = (id) => {
    navigate(`/edit-category?cid=${id}`); // Navigate to the Edit page for categories
  };

  // Handle Add Category
  const handleAddCategory = () => {
    navigate('/add-category'); // Navigate to the Add Category page
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="h-screen flex flex-col">


      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Category Management</h1>
            <div className='p-1'>
              <button
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center mb-4 space-x-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((category, index) => (
                  <tr key={category._id} className="text-center">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{category.name}</td>
                    <td className="border px-4 py-2 w-7/12">{category.description}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No categories available</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;
