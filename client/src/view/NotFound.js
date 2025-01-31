import React from 'react';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl font-semibold mb-6">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-300 mb-6">It seems like the URL you entered might be incorrect or the page has been moved.</p>
        <a href="/" className="text-blue-500 hover:text-blue-400 text-lg font-semibold">Go back to the homepage</a>
      </div>
    </div>
  );
};

export default NotFound;