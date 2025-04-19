
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../providers/AuthProvider';
import { LogOut, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

const AuthHeader = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-gray-300">
  <AvatarFallback>
    {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
  </AvatarFallback>
</Avatar>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">{user.email}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link to="/auth">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      )}
    </div>
  );
};

export default AuthHeader;
