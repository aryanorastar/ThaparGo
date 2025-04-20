import React from 'react';
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../auth/InternetIdentityProvider';

const InternetIdentityLogin = () => {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

  const handleLogin = () => {
    console.log("Login button clicked");
    login();
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className="bg-white/10 text-white">
        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout} 
        className="bg-white/10 text-white hover:bg-white/20"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogin} 
      className="bg-white/10 text-white hover:bg-white/20"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Internet Identity
    </Button>
  );
};

export default InternetIdentityLogin;
