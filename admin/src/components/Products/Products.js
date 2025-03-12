import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';

const Products = () => {
const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPageFromURL = Number(queryParams.get("page")) || 1;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(currentPageFromURL);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Sync page state with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = Number(params.get('page')) || 1;
    if(page){
      setCurrentPage(page);
    }
  }, [location.search]);

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
        setTotalPages(Math.ceil(products.length / itemsPerPage));
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [itemsPerPage]);

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios
        .delete(`http://localhost:5000/api/products/${id}`)
        .then(() => {
          const updatedData = data.filter((product) => product._id !== id);
          setData(updatedData);
          setFilteredData(updatedData);
          setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  };

  // Handle Edit with page preservation
  const handleEdit = (id) => {
    navigate(`/edit-product?pid=${id}&page=${currentPage}`);
  };

  // Handle page change with URL update
  const handlePageChange = (page) => {
    navigate(`?page=${page}`);
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    handlePageChange(1); // Reset to first page when searching
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

  useEffect(() => {
    handleSort();
  }, [sortField, sortOrder]);

  // Get current page products
  const currentPageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  
  const handleAddCPUProduct = () => {
    navigate('/add-cpu');
  };
  
  const handleAddGPUProduct = () => {
    navigate('/add-gpu');
  };
  
  const handleAddMotherboardProduct = () => {
    navigate('/add-motherboard');
  };
  
  const handleAddRamProduct = () => {
    navigate('/add-ram');
  };
  
  const handleAddStorageProduct = () => {
    navigate('/add-storage');
  };
  
  const handleAddPSUProduct = () => {
    navigate('/add-psu');
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
     
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <div className="flex-col items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Product Management System</h1>
            <div className='flex px-2'>
            <div className="p-1">
            <fieldset className='border border-black p-3 bg-green-100'>

              <legend className='font-bold text-lg'>Add PC Parts:</legend>         
                <button
                onClick={handleAddCPUProduct}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> CPU
              </button>

              <button
                onClick={handleAddGPUProduct}
                className="bg-green-500 text-white px-2 py-2 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> GPU
              </button>
              <button
                onClick={handleAddMotherboardProduct}
                className="bg-green-500 ml-2 text-white px-2 py-2 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> Motherboard
              </button>
              <button
                onClick={handleAddRamProduct}
                className="bg-green-500 ml-2 text-white px-2 py-2 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> RAM
              </button>
              <button
                onClick={handleAddStorageProduct}
                className="bg-green-500 ml-2 text-white px-2 py-2 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> Storage
              </button>

              <button
                onClick={handleAddPSUProduct}
                className="bg-green-500 ml-2 text-white px-2 py-2 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> PSU
              </button>
              </fieldset>
            </div>
            <div className='p-1'>
              <fieldset className='border border-black p-3 bg-green-100'>

              <legend className='font-bold text-lg'>Add Accessories:</legend>
              
            <button
                onClick={() => navigate('/add-keyboard')}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> Keyboard
              </button>
            <button
                onClick={() => navigate('/add-mouse')}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> Mouse
              </button>
            <button
                onClick={() => navigate('/add-monitor')}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> Monitor
              </button>
            <button
                onClick={() => navigate('/add-pccase')}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> PC Case
              </button>
            {/* <button
                onClick={() => navigate('/add-cpucooler')}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-white hover:text-green-500 font-bold"
              >
                <i class="fa fa-plus" aria-hidden="true"></i> CPU Cooler
              </button> */}
           
              </fieldset>
            </div>
            </div>
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

          {/* Display products */}
          {Array.isArray(currentPageData) && currentPageData.length > 0 ? (
            <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden font-semibold">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">View</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Stock</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((product) => (
                  <tr key={product._id} className="text-center">
                    <td className="border px-4 py-2">
                      <Link
                        to={{
                          pathname: '/product-info',
                          search: `?pid=${product._id}`,
                        }}
                      >
                        <i className="fa fa-eye text-blue-700" aria-hidden="true"></i>
                      </Link>
                    </td>
                    <td className="border py-2 w-1/12">
                        <img className='' src={product.imageUrl} alt={product.imageUrl} />
                    </td>
                    <td className="border px-4 py-2 w-4/12">{product.name}</td>
                    <td className="border px-4 py-2">
                      {product.category.toUpperCase()}
                    </td>
                    <td className="border px-4 py-2">₹{product.price}</td>
                    <td className="border px-4 py-2">{product.stock}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                       <i class="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-r hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
