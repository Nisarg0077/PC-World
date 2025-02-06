import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

const BrandsManagement = () => {
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
      .get('http://localhost:5000/api/brands') // Update your API endpoint
      .then((res) => {
        const brands = res.data.brands || res.data;
        setData(brands);
        setFilteredData(brands);
        console.log(brands);
        
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  // Handle Delete Category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await axios.delete(`http://localhost:5000/api/brands/${id}`);
        console.log(id);
        
        // Ensure data exists before filtering
        if (data) {
          const updatedData = data.filter((brand) => brand._id !== id);
          setData(updatedData);
          setFilteredData(updatedData);
          console.log();
          
        }
  
        toast.success("Brand deleted successfully!");
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand.");
      }
    }
  };
  
  // Handle Edit Category
  const handleEdit = (id) => {
    navigate(`/edit-brand?bid=${id}`); // Navigate to the Edit page for categories
  };

  // Handle Add Category
  const handleAddCategory = () => {
    navigate('/add-brands'); // Navigate to the Add Category page
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((brand) =>
        brand.name.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };
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
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Brands Management</h1>
                <div className='p-1'>
                  <button
                    onClick={handleAddCategory}
                    className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-green-600"
                  >
                    Add Brand
                  </button>
                </div>
              </div>
    
              {/* Search */}
              <div className="flex items-center mb-4 space-x-4">
                <input
                  type="text"
                  placeholder="Search Brands..."
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
        <th className="border px-4 py-2">Logo</th>
        <th className="border px-4 py-2">Name</th>
        <th className="border px-4 py-2">Country</th>
        <th className="border px-4 py-2">Founded Year</th>
        <th className="border px-4 py-2">Description</th>
        <th className="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((brand, index) => (
        <tr key={brand._id} className="text-center">
          <td className="border px-4 py-2">{index + 1}</td>
          <td className="border px-4 py-2">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="h-15 w-15 object-cover mx-auto" />
            ) : (
              "N/A"
            )}
          </td>
          <td className="border px-4 py-2">{brand.name}</td>
          <td className="border px-4 py-2">{brand.country}</td>
          <td className="border px-4 py-2">{brand.foundedYear || "N/A"}</td>
          <td className="border px-4 py-2 w-7/12">{brand.description || "No description"}</td>
          <td className="border px-4 py-2 space-x-2">
            <button
              onClick={() => handleEdit(brand._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(brand._id)}
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
  <p>No brands available</p>
)}
            </main>
          </div>
        </div>
  )
}

export default BrandsManagement