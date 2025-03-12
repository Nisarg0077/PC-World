import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
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

  const navigate = useNavigate();
  const [message, setMessage] = useState("");


  const [usernameModified, setUsernameModified] = useState(false);

  useEffect(() => {
    if (formData.firstName.trim() && !usernameModified) {
      const generateUsername = () => {
        const cleanFirstName = formData.firstName
  .toLowerCase()
  .replace(/\s+/g, '') // Remove spaces
  .replace(/[^a-z0-9]/g, '') // Remove special characters
  .replace(/([a-z]*)(\d+)/, '$1@$2'); // Insert @ before the first number sequence
        
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const generatedUsername = `${cleanFirstName}@${randomDigits}`.slice(0, 20);
        
        setFormData(prev => ({
          ...prev,
          username: generatedUsername
        }));
      };

      generateUsername();
    }
  }, [formData.firstName, usernameModified]);
  const handleUsernameChange = (e) => {
    setUsernameModified(true);
    handleChange(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parts = name.split('.');
    
    if (parts.length === 1) {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
      }));
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
  
    if (file && !["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setMessage("Invalid file format. Only JPG, PNG, or PDF allowed.");
      return;
    }
  
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, phoneNumber, username } = formData;
    
    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    
    // Phone number validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Phone number must be exactly 10 digits.");
      return false;
    }

    // Username validation
    if (!username.trim()) {
      setMessage("Username is required.");
      return false;
    }
   
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const formDataToSend = new FormData();
      const { confirmPassword, ...dataToSend } = formData;
  
      // Append top-level fields
      Object.keys(dataToSend).forEach((key) => {
        if (key !== 'officeAddress' && key !== 'address') {
          formDataToSend.append(key, dataToSend[key]);
        }
      });
  
      // Append officeAddress sub-fields
      Object.keys(dataToSend.officeAddress).forEach((subKey) => {
        formDataToSend.append(`officeAddress.${subKey}`, dataToSend.officeAddress[subKey]);
      });
  
      // Append address sub-fields
      Object.keys(dataToSend.address).forEach((subKey) => {
        formDataToSend.append(`address.${subKey}`, dataToSend.address[subKey]);
      });
  
      const response = await axios.post("http://localhost:5000/api/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage("Registration successful!");
      toast.success("Registration successful!");
      navigate(`/login?username=${formData.username}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-0.5">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">User Registration</h2>
        {message && (
          <p className={`text-center mb-4 p-3 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4 border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Generated username: {formData.username}
            </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} 
                      placeholder="Enter your last name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input border-2 border-gray-300 rounded-md w-full p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
              
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Residential Address</label>
                  <input type="text" name="address.building" value={formData.address.building} onChange={handleChange} placeholder="Building" className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 my-1" required />
                  <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street" className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 my-1" required />
                  <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 my-1" required />
                  <input type="text" name="address.pinCode" value={formData.address.pinCode} onChange={handleChange} placeholder="Pin Code" className="input w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 my-1" required />
              
              </div>
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="space-y-4 border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} 
                      placeholder="E.g., Software Engineer"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Job Profile</label>
                <input type="text" name="jobProfile" value={formData.jobProfile} onChange={handleChange} 
                      placeholder="E.g., Full Stack Developer"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Organization Name</label>
                <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} 
                      placeholder="Enter your company name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Office Address</label>
                <input type="text" name="officeAddress" value={formData.officeAddress} onChange={handleChange} 
                      placeholder="Enter complete office address"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div> */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Office Address</h4>
                <div className="space-y-2">
                  <input type="text" name="officeAddress.officeBuilding" value={formData.officeAddress.officeBuilding} onChange={handleChange} 
                        placeholder="Office Building" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  <input type="text" name="officeAddress.officeStreet" value={formData.officeAddress.officeStreet} onChange={handleChange} 
                        placeholder="Office Street" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input type="text" name="officeAddress.officeCity" value={formData.officeAddress.officeCity} onChange={handleChange} 
                          placeholder="Office City" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                    <input type="text" name="officeAddress.officeState" value={formData.officeAddress.officeState} onChange={handleChange} 
                          placeholder="Office State" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                    <input type="text" name="officeAddress.officePinCode" value={formData.officeAddress.officePinCode} onChange={handleChange} 
                          placeholder="Office Pin Code" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                </div>
                </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Account Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleUsernameChange}
              placeholder="Edit your username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} 
                      placeholder="example@domain.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} 
                      placeholder="At least 6 characters with letters and numbers"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} 
                      placeholder="Re-enter your password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleChange({ target: { name: 'phoneNumber', value } });
                    }}
                    placeholder="Enter 10-digit phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Aadhar Number</label>
                <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} 
                      placeholder="1234 5678 9012"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Aadhar Document (Front)</label>
              <input type="file" name="aadharFront" accept=".jpg, .jpeg, .png" onChange={handleFileChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required/>

              <label className="block text-sm font-medium text-gray-600 mb-1 mt-4">Aadhar Document (Back)</label>
              <input type="file" name="aadharBack" accept=".jpg, .jpeg, .png" onChange={handleFileChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required/>


              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
            Create Account
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign in here
          </a>

          <p className="mt-5">
    <a href="/" className="text-white bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-md hover:underline">
      Go to Home
    </a>
  </p>
        </div>
      </div>
    </div>
    </div>
  );
}