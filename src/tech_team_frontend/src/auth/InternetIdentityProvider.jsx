import React, { createContext, useCallback, useContext, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "./ledger.did.js";

// Get the canister ID from environment variables
const canisterID = process.env.CANISTER_ID_TECH_TEAM_BACKEND || "5zvoh-pyaaa-aaaan-qzy7a-cai";

// Create the authentication context
const InternetIdentityContext = createContext();

export const InternetIdentityProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing authentication on mount
  React.useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('auth_status');
      const storedPrincipal = localStorage.getItem('mock_principal');
      
      if (authStatus === 'authenticated' && storedPrincipal) {
        setIsAuthenticated(true);
        setPrincipal({ toString: () => storedPrincipal });
        console.log("Restored authentication from localStorage");
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Mock authentication for development
  const login = useCallback(() => {
    console.log("Login function called");
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsAuthenticated(true);
      setPrincipal({ toString: () => "2vxsx-fae" });
      
      // Store authentication status in localStorage for persistence
      localStorage.setItem('auth_status', 'authenticated');
      localStorage.setItem('mock_principal', '2vxsx-fae');
      
      console.log("Authentication successful");
      setIsLoading(false);
    }, 1000);
  }, []);

  const logout = useCallback(() => {
    console.log("Logout function called");
    setIsLoading(true);
    
    setTimeout(() => {
      setIsAuthenticated(false);
      setPrincipal(null);
      
      // Clear authentication data from localStorage
      localStorage.removeItem('auth_status');
      localStorage.removeItem('mock_principal');
      
      console.log("Logout successful");
      setIsLoading(false);
    }, 500);
  }, []);

  // Create a custom actor for a specific canister
  const createCustomActor = async (canisterId, idlFactory) => {
    try {
      console.log("Creating actor for canister ID:", canisterId);
      
      // Use the host appropriate for your environment
      const host = "https://ic0.app";
      const agent = new HttpAgent({ host });

      const actor = Actor.createActor(idlFactory, { agent, canisterId });
      console.log("Created actor:", actor);
      return actor;
    } catch (err) {
      console.error("Error creating actor:", err);
      return null;
    }
  };

  const authValue = {
    isAuthenticated,
    login,
    logout,
    principal,
    createCustomActor,
    isLoading,
    user: principal ? { principal } : null
  };
  
  return (
    <InternetIdentityContext.Provider value={authValue}>
      {children}
    </InternetIdentityContext.Provider>
  );
};

export const useAuth = () => useContext(InternetIdentityContext);
