import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBrandForm = () => {
  const [brandData, setBrandData] = useState({
    name: "",
    country: "",
    foundedYear: "",
    logoUrl: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandData.name || !brandData.country) {
      toast.error("Name and Country are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/brands", brandData);
      toast.success("Brand added successfully!");

      // Reset form
      setBrandData({
        name: "",
        country: "",
        foundedYear: "",
        logoUrl: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to add brand. Try again!");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="sticky top-0 h-full">
          <Sidebar />
        </aside>

        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add Brand</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-medium mb-2">
                Brand Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={brandData.name}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={brandData.country}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter country"
              />
            </div>

            {/* Founded Year */}
            <div>
              <label htmlFor="foundedYear" className="block font-medium mb-2">
                Founded Year
              </label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                value={brandData.foundedYear}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter founded year (optional)"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logoUrl" className="block font-medium mb-2">
                Logo URL
              </label>
              <input
                type="text"
                id="logoUrl"
                name="logoUrl"
                value={brandData.logoUrl}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter logo URL (optional)"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={brandData.description}
                onChange={handleChange}
                rows="3"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description (optional)"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Add Brand
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddBrandForm;