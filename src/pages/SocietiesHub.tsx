import React, { useEffect } from 'react';

/**
 * SocietiesHub Component
 * 
 * This component redirects users to the external Thapar Societies Hub website
 */
const SocietiesHub = () => {
  // Redirect to the Thapar Societies Hub website when the component mounts
  useEffect(() => {
    window.location.href = 'https://thaparsocietieshub.netlify.app';
  }, []);

  // Return a loading message that will be shown briefly before the redirect happens
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Thapar Societies Hub...</p>
    </div>
  );
};

export default SocietiesHub;
