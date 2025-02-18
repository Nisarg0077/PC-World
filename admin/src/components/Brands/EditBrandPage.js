import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Sidebar";

const EditBrandPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [brandData, setBrandData] = useState({
    name: "",
    country: "",
    foundedYear: "",
    logoUrl: "",
    description: "",
  });

  const [image, setImage] = useState(null); // Store image file

  // Extract brand ID (bid) from query parameters
  const queryParams = new URLSearchParams(location.search);
  const bid = queryParams.get("bid");

  useEffect(() => {
    if (!bid) {
      toast.error("Brand ID is missing");
      navigate("/brands");
      return;
    }

    // Fetch brand data from API
    axios
      .get(`http://localhost:5000/api/brands/${bid}`)
      .then((res) => {
        if (!res.data) {
          toast.error("Brand not found");
          navigate("/brands");
          return;
        }
        setBrandData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching brand data:", error);
        toast.error("Failed to fetch brand data");
      });
  }, [bid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let imageUrl = brandData.logoUrl; // Keep existing image URL

  //     // Upload image if a new file is selected
  //     if (image) {
  //       const formData = new FormData();
  //       formData.append("image", image);

  //       const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });

  //       imageUrl = uploadResponse.data.imageUrl; // Get uploaded image URL
  //     }

  //     // Update brand data
  //     await axios.post(`http://localhost:5000/api/brands/update/${bid}`, { ...brandData, logoUrl: imageUrl });

  //     toast.success("Brand updated successfully!");
  //     navigate("/brands");
  //     console.log(brandData.logoUrl)
  //   } catch (error) {
  //     console.error("Error updating brand:", error);
  //     toast.error("Failed to update brand.");
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = brandData.logoUrl; // Keep existing image URL
  
      // Upload new image if a new file is selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
  
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        console.log("Upload Response:", uploadResponse.data); // Debugging: Check what response is coming
  
        if (uploadResponse.data.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl; // Update with new image URL
        }
      }
  
      // Send updated brand data
      const updatedData = { ...brandData, logoUrl: imageUrl };
  
      console.log("Updating brand with data:", updatedData); // Debugging
  
      await axios.put(`http://localhost:5000/api/brands/update/${bid}`, updatedData);
  
      toast.success("Brand updated successfully!");
      navigate("/brands");
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand.");
    }
  };
  

  return (
    <div className="h-screen flex flex-col">


      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto ">
          <ToastContainer />
          <h1 className="text-xl font-bold mb-4">Edit Brand</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Brand Name */}
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
                placeholder="Enter description (optional)"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Save Changes
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditBrandPage;
