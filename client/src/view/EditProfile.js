import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const EditProfile = () => {
  const [user, setUser] = useState({
      username: "",
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      phoneNumber: "",
      designation: "",
      jobProfile: "",
      orgName: "",
      officeAddress:{
        officeBuilding: "", // Separated office address fields
        officeStreet: "",
        officeCity: "",
        officeState: "",
        officePinCode: "",
      },
      email: "",
      address: {
        building: "", // Separated residential address fields
        street: "",
        city: "",
        state: "",
        pinCode: "",
      },
      aadharNumber: "",
      aadharFront: null, // Changed aadhar to aadharFront and back
      aadharBack: null,
      password: "",
      confirmPassword: "",
      role: 'client',
  });


  const [aadharFrontFile, setAadharFrontFile] = useState(null);
  const [aadharBackFile, setAadharBackFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const uid = new URLSearchParams(location.search).get('uid');
  
  useEffect(() => {
      const fetchUserData = async () => {
        const sessionData = JSON.parse(sessionStorage.getItem("clientUser")); // Fixed casing
        if (!sessionData?.username) {
          setError("User not logged in");
          setIsLoading(false);
          return;
        }
  
        try {
          // Changed to GET request with username parameter
          const { data } = await axios.post(
            `http://localhost:5000/api/client/user/`,
            {
              username: sessionData.username
            }
          );
  
          const userData = {
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
            address: data.address || {},
            officeAddress: data.officeAddress || {},
          };
  
          setUser(userData);
      } catch (err) {
        setError("Failed to fetch user data");
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parts = name.split('.');
    
    if (parts.length === 1) {
      setUser(prev => ({ ...prev, [name]: value }));
    } else {
      setUser(prev => ({
        ...prev,
        [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (fieldName === 'aadharFront') {
      setAadharFrontFile(file);
    } else if (fieldName === 'aadharBack') {
      setAadharBackFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      
      // Append user data including existing Aadhar references
      const { _id, __v, ...userData } = user;
      Object.entries(userData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`${key}.${subKey}`, subValue);
          });
        } else {
          formData.append(key, value);
        }
      });
  
      // Only overwrite Aadhar fields if new files are selected
      if (aadharFrontFile) {
        formData.set('aadharFront', aadharFrontFile);
      } else {
        // Extract just the filename from the URL
        const aadharFrontName = user.aadharFront?.split('http://localhost:5000/images/').pop() || '';
        formData.set('aadharFront', aadharFrontName);
      }
      
      if (aadharBackFile) {
        formData.set('aadharBack', aadharBackFile);
      } else {
        // Extract just the filename from the URL
        const aadharBackName = user.aadharBack?.split('http://localhost:5000/images/').pop() || '';
        formData.set('aadharBack', aadharBackName);
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/users/${uid}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      // Update session storage
      const sessionData = JSON.parse(sessionStorage.getItem("ClientUser"));
      const updatedSessionData = { ...sessionData, ...response.data };
      sessionStorage.setItem("clientUser", JSON.stringify(updatedSessionData));
  
      toast.success('Profile updated successfully');
      navigate('/userProfile');
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <ToastContainer />
  <div className="mx-auto bg-white rounded-lg shadow-md p-6">
    <div className='flex justify-between'>
    <h2 className="text-3xl font-bold mb-6 text-violet-800">Edit Profile</h2>
    <button onClick={() => navigate(-1)} className='bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-white font-bold rounded-md mb-6'>Back</button>
    </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4 border rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4 border rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">Residential Address</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="address.building"
            value={user.address.building}
            onChange={handleInputChange}
            placeholder="Building"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="address.street"
            value={user.address.street}
            onChange={handleInputChange}
            placeholder="Street"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="address.city"
              value={user.address.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="address.state"
              value={user.address.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="address.pinCode"
              value={user.address.pinCode}
              onChange={handleInputChange}
              placeholder="Pin Code"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="space-y-4 border rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">Employment Details</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="designation"
            value={user.designation}
            onChange={handleInputChange}
            placeholder="Designation"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="jobProfile"
            value={user.jobProfile}
            onChange={handleInputChange}
            placeholder="Job Profile"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            name="orgName"
            value={user.orgName}
            onChange={handleInputChange}
            placeholder="Organization Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2 text-purple-800">Office Address</h4>
            <input
              type="text"
              name="officeAddress.officeBuilding"
              value={user.officeAddress.officeBuilding}
              onChange={handleInputChange}
              placeholder="Office Building"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="officeAddress.officeStreet"
              value={user.officeAddress.officeStreet}
              onChange={handleInputChange}
              placeholder="Office Street"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="officeAddress.officeCity"
                value={user.officeAddress.officeCity}
                onChange={handleInputChange}
                placeholder="Office City"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                name="officeAddress.officeState"
                value={user.officeAddress.officeState}
                onChange={handleInputChange}
                placeholder="Office State"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                name="officeAddress.officePinCode"
                value={user.officeAddress.officePinCode}
                onChange={handleInputChange}
                placeholder="Office Pin Code"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="space-y-4 border rounded-lg p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">Account Information</h3>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              pattern="[0-9]{10}"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={user.aadharNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Aadhar Documents */}
      <div className="space-y-4 border rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4 text-purple-800">Aadhar Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Front</label>
            <input
              type="file"
              name="aadharFront"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*,.pdf"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Back</label>
            <input
              type="file"
              name="aadharBack"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*,.pdf"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 mt-6">
  <button 
    type="submit" 
    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
    disabled={isLoading}
  >
    {isLoading ? 'Updating...' : 'Update Profile'}
  </button>

  <button 
    onClick={() => navigate(-1)} 
    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-white font-semibold rounded-md hover:from-violet-700 hover:to-indigo-700 transition-colors"
  >
    Back
  </button>
</div>
    </form>
  </div>
</div>
  );
};

export default EditProfile;