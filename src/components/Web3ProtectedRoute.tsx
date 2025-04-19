import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWeb3 } from '../providers/Web3Provider';

interface Web3ProtectedRouteProps {
  children: React.ReactNode;
}

const Web3ProtectedRoute: React.FC<Web3ProtectedRouteProps> = ({ children }) => {
  const { isConnected, chainId } = useWeb3();
  
  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = 80001;
  
  // If not connected, redirect to wallet auth page
  if (!isConnected) {
    return <Navigate to="/wallet-auth" replace />;
  }
  
  // If connected but on wrong network, also redirect to wallet auth page
  // where they can switch networks
  if (chainId !== MUMBAI_CHAIN_ID) {
    return <Navigate to="/wallet-auth" replace />;
  }
  
  // If connected and on correct network, render the protected component
  return <>{children}</>;
};

export default Web3ProtectedRoute;
