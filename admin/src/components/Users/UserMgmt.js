import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [User, setUser] = useState(null);
  const navigate = useNavigate();


  console.log(users)
  // Check AdminUser session
  useEffect(() => {
    const AdminUser = sessionStorage.getItem("AdminUser");
    if (!AdminUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(AdminUser));
      console.log(AdminUser);
    }
  }, [navigate]);

  // Fetch users data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        const usersList = res.data;
        setUsers(usersList);
        setFilteredUsers(usersList);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Handle Delete User
  const handleDelete = async (userId) => {
    console.log('Deleting user with ID:', userId);

    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Make the DELETE request to the backend API
        const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
        console.log(response.data.message);  // Success message from the server
        const updatedUsers = users.filter((user) => user._id !== userId);

        // Update the state with the remaining users
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        // Show success toast notification
        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
      }
    }
  };

  // Handle Edit User
  const handleEdit = (userId) => {
    navigate(`/edit-user?uid=${userId}`);
    console.log(userId);
    
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="h-screen flex">
      <aside className="w-64 min-h-screen bg-white shadow-lg">
        <Sidebar />
      </aside>
      <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Users Management</h1>
        </div>

        {/* Search */}
        <div className="flex items-center mb-4 space-x-4">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">firstName</th>
                <th className="border px-4 py-2">lastName</th>
                <th className="border px-4 py-2">username</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{user.firstName}</td>
                  <td className="border px-4 py-2">{user.lastName}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  {user.isActive === true ? (
                      <td className="border px-4 py-2 font-bold text-green-500">{user.isActive.toString()}</td>

                  ):(
                    <td className="border px-4 py-2 font-bold text-red-500">{user.isActive.toString()}</td>
                  )
                  
                  
                  }
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ): (
          <p>No users available</p>
        )}
      </main>
    </div>
  );
};

export default UsersManagement;
 