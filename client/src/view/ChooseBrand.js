import React from "react";
import { useNavigate } from "react-router-dom";
import amd from '../images/Amd_Square-logo.png';
import intel from '../images/pngimg.com - intel_PNG1.png';

const ChooseBrand = () => {
  const navigate = useNavigate();

  const handleSelectBrand = (brand) => {
    navigate(`/custom-build/${brand}`); // Navigate to Intel or AMD build page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Choose Your CPU Brand</h1>

      <div className="flex space-x-12">
        {/* Intel Selection */}
        <div 
          onClick={() => handleSelectBrand("Intel")} 
          className="cursor-pointer bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105"
        >
          <img 
            src={intel}
            alt="Intel Logo" 
            className="w-40 h-40 object-contain"
          />
          <p className="text-center text-lg font-semibold text-blue-600 mt-2">Intel Build</p>
        </div>

        {/* AMD Selection */}
        <div 
          onClick={() => handleSelectBrand("AMD")} 
          className="cursor-pointer bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105"
        >
          <img 
            src={amd} 
            alt="AMD Logo" 
            className="w-40 h-40 object-contain"
          />
          <p className="text-center text-lg font-semibold text-red-600 mt-2">AMD Build</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseBrand;
