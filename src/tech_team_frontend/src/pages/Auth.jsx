import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../providers/AuthProvider';
import { Loader2, Info } from 'lucide-react';
import authService from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to the page the user was trying to access, or to home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const validateThaparEmail = (email) => {
    return email.toLowerCase().endsWith('@thapar.edu');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate if the email belongs to Thapar domain
    if (!validateThaparEmail(email)) {
      toast({
        title: 'Invalid Email Domain',
        description: 'Only @thapar.edu email addresses are allowed to register.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await authService.register(email, password);

      if (result.success) {
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created. You can now sign in.',
        });
        // Clear form and switch to sign in tab
        setEmail('');
        setPassword('');
        // Find and click the sign in tab
        document.querySelector('[data-state="inactive"][value="signin"]')?.click();
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // For sign in, we still verify the email format to ensure consistency
    if (!validateThaparEmail(email)) {
      toast({
        title: 'Invalid Email Domain',
        description: 'Only @thapar.edu email addresses are allowed to sign in.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        toast({
          title: 'Welcome Back',
          description: `You have successfully signed in as ${email}.`,
        });
        
        // Reload the page to trigger the auth provider to update
        window.location.href = location.state?.from?.pathname || '/';
      } else {
        toast({
          title: 'Sign In Failed',
          description: result.error || 'Invalid email or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your Thapar email and password to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.name@thapar.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account using your Thapar email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.name@thapar.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Only @thapar.edu email addresses are allowed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
