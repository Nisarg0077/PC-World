import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for redirection

const Login = () => {
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [message, setMessage] = useState(""); // State for API response message
  
  const navigate = useNavigate(); // Hook to handle navigation after successful login

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // const response = await axios.post("http://localhost:5000/api/admin/login", {
      //   username,
      //   password,
      // });

      const response = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      // Store user info in sessionStorage (or localStorage if you want it to persist across sessions)
      sessionStorage.setItem("AdminUser", JSON.stringify(response.data.user)); // Store the user data in session

      // Set a success message
      setMessage({ success: `Welcome, ${response.data.user.firstName || "User"}!` });

      // Redirect to dashboard
      navigate("/"); // Redirect to the dashboard page
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ error: "Login failed! Please check your credentials." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 py-1 text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        {message && (
          <div className="mt-4">
            {message.error ? (
              <p className="text-red-500 text-sm">{message.error}</p>
            ) : (
              <p className="text-green-500 text-sm">{message.success}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
