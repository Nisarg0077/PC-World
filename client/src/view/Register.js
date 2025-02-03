import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      setMessage("Registration successful!");
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      });
    } catch (error) {
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">User Registration</h2>
        
        {message && <p className="text-center mb-4 text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-2 border rounded w-full"
            required
          />

          <h3 className="text-lg font-semibold text-gray-700">Address</h3>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            className="p-2 border rounded w-full"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>
        <div>
        Already customer?<a href="/login" className="text-blue-600"> Login here.</a>
        </div>
      </div>
    </div>
  );
}