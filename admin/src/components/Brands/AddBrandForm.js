import React, { useState } from "react";
import axios from "axios";
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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandData.name || !brandData.country) {
      toast.error("Name and Country are required!");
      return;
    }

    let imageUrl = brandData.logoUrl; // Keep existing or default URL

    if (image) {
      try {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.imageUrl; // Get uploaded image URL
      } catch (error) {
        toast.error("Failed to upload image. Try again!");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/brands", { ...brandData, logoUrl: imageUrl });
      toast.success("Brand added successfully!");

      // Reset form
      setBrandData({
        name: "",
        country: "",
        foundedYear: "",
        logoUrl: "",
        description: "",
      });
      setImage(null);
      setPreview("");
    } catch (error) {
      toast.error("Failed to add brand. Try again!");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />


      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add Brand</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Name */}
            <div>
              <label className="block font-medium mb-2">Brand Name</label>
              <input
                type="text"
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
              <label className="block font-medium mb-2">Country</label>
              <input
                type="text"
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
              <label className="block font-medium mb-2">Founded Year</label>
              <input
                type="number"
                name="foundedYear"
                value={brandData.foundedYear}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter founded year (optional)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium mb-2">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mt-4">
                <label className="block font-medium mb-2">Image Preview</label>
                <img src={preview} alt="Brand Logo" className="w-24 h-24 rounded border" />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={brandData.description}
                onChange={handleChange}
                rows="3"
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description (optional)"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add Brand
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddBrandForm;
