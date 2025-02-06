import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBrandPage = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState({
    name: "",
    country: "",
    foundedYear: "",
    logoUrl: "",
    description: "",
  });
  const [image, setImage] = useState(null); // Store image file
console.log(brandData)
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/api/brands/${id}`);
        setBrandData(response.data);
        console.log(response.data)
      } catch (error) {
        toast.error("Failed to load brand data");
        navigate("/brands"); // Redirect if not found
      }
    };

    if (id) fetchBrand();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = brandData.logoUrl; // Default to existing image URL

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        // Upload image to server
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadResponse.data.imageUrl; // Get the uploaded image URL
      }

      // Send updated data to the server
      await axios.post(`http://localhost:5000/api/brands/${id}`, { ...brandData, logoUrl: imageUrl });
      toast.success("Brand updated successfully!");
      navigate("/brands");
    } catch (error) {
      toast.error("Failed to update brand.");
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
          <h1 className="text-2xl font-bold mb-4">Edit Brand</h1>

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

            {/* Preview Existing Image */}
            {brandData.logoUrl && (
              <div className="mt-4">
                <label className="block font-medium mb-2">Current Logo</label>
                <img src={brandData.logoUrl} alt="Brand Logo" className="w-24 h-24 rounded border" />
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
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Update Brand
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditBrandPage;