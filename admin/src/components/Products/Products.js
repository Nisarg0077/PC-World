import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Products = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name'); // 'name', 'price', 'stock'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const navigate = useNavigate();

  // Check AdminUser session
  useEffect(() => {
    const AdminUser = sessionStorage.getItem('AdminUser');
    if (!AdminUser) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch products data
  useEffect(() => {
    axios
      .post('http://localhost:5000/api/products')
      .then((res) => {
        const products = res.data.products || res.data;
        setData(products);
        setFilteredData(products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios
        .delete(`http://localhost:5000/api/products/${id}`)
        .then(() => {
          const updatedData = data.filter((product) => product._id !== id);
          setData(updatedData);
          setFilteredData(updatedData);
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  // Handle Add Product
  const handleAddCPUProduct = () => {
    navigate('/add-cpu');
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  // Handle Sorting
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortField === 'price' || sortField === 'stock') {
        return sortOrder === 'asc'
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      }
      return sortOrder === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
    setFilteredData(sortedData);
  };

  // Trigger sorting whenever sortField or sortOrder changes
  useEffect(() => {
    handleSort();
  }, [sortField, sortOrder]);

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
            <h1 className="text-xl font-bold">Product Management System</h1>
            <button
              onClick={handleAddCPUProduct}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add CPU
            </button>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center mb-4 space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Stock</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((product, index) => (
                  <tr key={product._id} className="text-center">
                    <td className="border px-4 py-2">{product._id}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.category}</td>
                    <td className="border px-4 py-2">${product.price}</td>
                    <td className="border px-4 py-2">{product.stock}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
            <p>No products available</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
