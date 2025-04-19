import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../providers/AuthProvider';
import { RoomBooking } from '../types';
import { Check, Clock, X, Filter, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';

// Type for user roles to avoid TypeScript errors
type UserRole = {
  id: string;
  user_id: string;
  role: string;
};

const AdminBookings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  
  // For development purposes, we'll set all users as admins
  // In a production environment, you would implement proper role-based access control
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // For demonstration purposes, we'll consider all authenticated users as admins
      // This allows you to test the admin functionality without setting up complex role systems
      setIsAdmin(true);
      
      // In a real application, you would check the user's role in your database
      // Example of how you might do this:
      /*
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'admin');
          
        if (error) throw error;
        
        const isUserAdmin = data && data.length > 0;
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this page.',
            variant: 'destructive',
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
      */
    };
    
    checkAdminStatus();
  }, [user, navigate]);
  
  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('room_bookings').select('*');
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Order by created_at, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bookings.',
          variant: 'destructive',
        });
        return;
      }
      
      // Map the snake_case database fields to camelCase for our RoomBooking type
      const mappedBookings: RoomBooking[] = data.map(item => ({
        id: item.id,
        roomId: item.room_id || '',
        roomName: item.room_name,
        purpose: item.purpose,
        society: item.society,
        date: item.date,
        startTime: item.start_time,
        endTime: item.end_time,
        status: item.status as 'pending' | 'approved' | 'rejected',
        userId: item.user_id,
        createdAt: item.created_at
      }));
      
      setBookings(mappedBookings);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin, statusFilter]);
  
  // Handle approving a booking
  const handleApproveBooking = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      
      const { error } = await supabase
        .from('room_bookings')
        .update({ status: 'approved' })
        .eq('id', bookingId);
      
      if (error) {
        console.error('Error approving booking:', error);
        toast({
          title: 'Error',
          description: 'Failed to approve booking.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: 'Booking has been approved.',
      });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'approved' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };
  
  // Handle rejecting a booking
  const handleRejectBooking = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      
      const { error } = await supabase
        .from('room_bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);
      
      if (error) {
        console.error('Error rejecting booking:', error);
        toast({
          title: 'Error',
          description: 'Failed to reject booking.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: 'Booking has been rejected.',
      });
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'rejected' } 
            : booking
        )
      );
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };
  
  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="mr-1 h-3 w-3" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
    }
  };
  
  // If not admin or loading admin status
  if (!isAdmin) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin: Room Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage room booking requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" onClick={fetchBookings} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        {['all', 'pending', 'approved', 'rejected'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : bookings.filter(b => tabValue === 'all' || b.status === tabValue).length > 0 ? (
                bookings
                  .filter(booking => tabValue === 'all' || booking.status === tabValue)
                  .map(booking => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{booking.purpose}</CardTitle>
                            <CardDescription>{booking.society}</CardDescription>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Room</h3>
                            <p>{booking.roomName}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                            <p>{format(new Date(booking.date), 'PPP')}</p>
                            <p>{booking.startTime} - {booking.endTime}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Requested On</h3>
                            <p>{format(new Date(booking.createdAt), 'PPP p')}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                            <p className="font-mono text-xs">{booking.userId}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-end space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                onClick={() => handleRejectBooking(booking.id)}
                                disabled={processingBookingId === booking.id}
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                              >
                                {processingBookingId === booking.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                                ) : (
                                  <>
                                    <X className="mr-1 h-4 w-4" /> Reject
                                  </>
                                )}
                              </Button>
                              <Button 
                                onClick={() => handleApproveBooking(booking.id)}
                                disabled={processingBookingId === booking.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingBookingId === booking.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Check className="mr-1 h-4 w-4" /> Approve
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No Bookings Found</h3>
                  <p className="text-gray-500">
                    {tabValue === 'all' 
                      ? "There are no room booking requests in the system." 
                      : `There are no ${tabValue} booking requests.`}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminBookings;
