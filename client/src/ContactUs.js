import React from "react";
import "font-awesome/css/font-awesome.min.css";

const ContactUs = () => {
    return (
      <div className="max-w-3xl mx-auto rounded-lg p-2 mt-10 bg-gradient-to-r from-blue-600 to-purple-600">

        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg  text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h1>
                <p className="text-gray-600 mb-6">
                We’d love to hear from you! Whether you have questions, need support, or want to collaborate, feel free to reach out to us.
                </p>
        
                <div className="text-gray-700 space-y-3">
                <p>Office: 456 IT Park, surat, Gujarat 395007</p>
                <p><i class="fa fa-phone" aria-hidden="true"></i><strong> Phone:</strong> +91 123 456 789</p>
                <p><i class="fa fa-envelope text-black"></i> <strong>Email:</strong> support@pcworld.com</p>
                <p><i class="fa fa-globe" aria-hidden="true"></i> <strong>Website:</strong> <a href="https://www.pcworld.com" className="text-blue-600 hover:underline">www.pcworld.com</a></p>
        
                <h3 className="text-lg font-semibold mt-4">Business Hours:</h3>
                <p>24/7 all days</p>
                </div>
        
                <p className="text-gray-600 mt-6">We look forward to assisting you!</p>
            </div>
      </div>
    );
  };
  
  export default ContactUs;
  