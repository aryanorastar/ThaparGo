
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, Info } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateThaparEmail = (email: string): boolean => {
    return email.toLowerCase().endsWith('@thapar.edu');
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Registration successful! Please check your email for verification.',
        });
        // Navigate to home page - the auth state listener will handle the session
        navigate('/');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during registration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during login.',
        variant: 'destructive',
      });
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
                <CardDescription className="flex items-center space-x-2">
                  <Info size={16} className="text-blue-500" />
                  <span>Only @thapar.edu emails are allowed</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@thapar.edu"
                    disabled={loading}
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
                    disabled={loading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
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
                <CardDescription className="flex items-center space-x-2">
                  <Info size={16} className="text-blue-500" />
                  <span>Only @thapar.edu emails are allowed</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@thapar.edu"
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
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
