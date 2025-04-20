import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast.js';
import authService from '../services/authService.js';

// Define the context with default values
const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check if session is valid
        const isValid = await authService.isAuthenticated();
        
        if (isValid) {
          // Get user profile
          const userProfile = await authService.getCurrentUser();
          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};