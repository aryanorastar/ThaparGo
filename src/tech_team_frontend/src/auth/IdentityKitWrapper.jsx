import React from 'react';
import { InternetIdentityProvider } from './InternetIdentityProvider';

const IdentityKitWrapper = ({ children }) => {
  return (
    <InternetIdentityProvider>
      {children}
    </InternetIdentityProvider>
  );
};

export default IdentityKitWrapper;
