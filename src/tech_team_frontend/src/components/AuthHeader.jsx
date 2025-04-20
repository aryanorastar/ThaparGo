import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../auth/InternetIdentityProvider';
import { LogOut, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

const AuthHeader = () => {
  const { isAuthenticated, principal, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-gray-300">
            <AvatarFallback>
              {principal ? principal.toString().substring(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white">
              {principal ? `${principal.toString().substring(0, 8)}...` : 'Authenticated'}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Sign Out" className="text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AuthHeader;
