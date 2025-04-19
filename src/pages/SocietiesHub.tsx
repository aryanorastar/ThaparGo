import React from 'react';

/**
 * SocietiesHub Component
 * 
 * This component provides a link to the external Thapar Societies Hub website
 * while maintaining the ability to navigate back to ThaparGo
 */
const SocietiesHub = () => {
  // Function to open the Societies Hub in a new tab
  const openSocietiesHub = () => {
    window.open('https://thaparsocietieshub.netlify.app', '_blank');
  };

  // Return a page with information and a button to open the external site
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Thapar Societies Hub</h1>
      <p className="mb-6 max-w-md">Discover and join student societies at Thapar University through our dedicated Societies Hub platform.</p>
      
      <button 
        onClick={openSocietiesHub}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Open Societies Hub
      </button>
      
      <p className="mt-4 text-sm text-gray-500">
        This will open the Thapar Societies Hub in a new tab, allowing you to easily return to ThaparGo.
      </p>
    </div>
  );
};

export default SocietiesHub;
