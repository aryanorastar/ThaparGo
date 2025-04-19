import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../providers/AuthProvider';

const RoomBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    roomId: '',
    purpose: '',
    society: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('room_bookings')
          .select('*, rooms:roomId(name)')
          .eq('userId', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          toast({
            title: 'Error fetching bookings',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        const formattedBookings = data.map(booking => ({
          ...booking,
          roomName: booking.rooms?.name || 'Unknown Room'
        }));
        
        setBookings(formattedBookings);
      } catch (error) {
        toast({
          title: 'Unexpected error',
          description: 'Failed to load bookings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    const fetchClassrooms = async () => {
      try {
        const { data, error } = await supabase
          .from('classrooms')
          .select('*')
          .order('name');
        
        if (error) {
          toast({
            title: 'Error fetching classrooms',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        setClassrooms(data || []);
      } catch (error) {
        toast({
          title: 'Unexpected error',
          description: 'Failed to load classrooms',
          variant: 'destructive',
        });
      }
    };
    
    fetchBookings();
    fetchClassrooms();
  }, [user, toast]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a booking request',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate form
    if (!formData.roomId || !formData.purpose || !formData.society || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('room_bookings')
        .insert([
          {
            roomId: formData.roomId,
            purpose: formData.purpose,
            society: formData.society,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            userId: user.id,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) {
        toast({
          title: 'Error submitting booking',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Booking submitted',
        description: 'Your room booking request has been submitted for approval',
      });
      
      // Reset form
      setFormData({
        roomId: '',
        purpose: '',
        society: '',
        date: '',
        startTime: '',
        endTime: '',
      });
      
      // Refresh bookings
      const { data: updatedBookings, error: fetchError } = await supabase
        .from('room_bookings')
        .select('*, rooms:roomId(name)')
        .eq('userId', user.id)
        .order('created_at', { ascending: false });
      
      if (!fetchError) {
        const formattedBookings = updatedBookings.map(booking => ({
          ...booking,
          roomName: booking.rooms?.name || 'Unknown Room'
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      toast({
        title: 'Unexpected error',
        description: 'Failed to submit booking request',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Approved</div>;
    } else if (status === 'rejected') {
      return <div className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Rejected</div>;
    } else {
      return <div className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Pending</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Room Bookings</h1>
      <p className="text-lg mb-8">Request rooms for society events and check booking status.</p>
      
      <Tabs defaultValue="my-bookings">
        <TabsList className="mb-6">
          <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="new-booking">New Booking Request</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-bookings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 flex justify-center items-center h-64">
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              bookings.map(booking => (
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
                        <p>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p>{booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-sm text-gray-500">
                      {booking.status === 'pending' ? (
                        'Your booking request is pending approval from the administration.'
                      ) : booking.status === 'approved' ? (
                        'Your booking has been approved. Please ensure to follow all guidelines.'
                      ) : (
                        'Your booking request has been rejected. Contact administration for more details.'
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-xl font-medium mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6">You haven't made any room booking requests yet.</p>
                <Button variant="outline" onClick={() => document.querySelector('[value="new-booking"]').click()}>
                  Make Your First Booking
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="new-booking">
          <Card>
            <CardHeader>
              <CardTitle>New Room Booking Request</CardTitle>
              <CardDescription>
                Fill in the details to request a room for your society event or meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="society" className="mb-1 block">Society Name</Label>
                    <Input
                      id="society"
                      name="society"
                      placeholder="e.g., IEEE Student Branch"
                      value={formData.society}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="roomId" className="mb-1 block">Room</Label>
                    <Select name="roomId" value={formData.roomId} onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}>
                      <SelectTrigger id="roomId">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map(room => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} ({room.building}, Capacity: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="mb-1 block">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="mb-1 block">Start Time</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="mb-1 block">End Time</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="purpose" className="mb-1 block">Purpose</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    placeholder="Describe the purpose of your booking"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <h3 className="text-sm font-semibold mb-2">Booking Guidelines:</h3>
              <ul className="text-sm text-gray-500 space-y-1 list-disc pl-5">
                <li>Bookings must be made at least 3 days in advance.</li>
                <li>All society bookings require approval from the administration.</li>
                <li>The society is responsible for keeping the room clean and orderly.</li>
                <li>Any damage to property will be the responsibility of the society.</li>
                <li>Booking duration should not exceed 4 hours.</li>
                <li>Rooms must be vacated on time for subsequent bookings.</li>
                <li>Food and drinks are not allowed in classrooms and labs.</li>
                <li>For technical equipment, please specify in the purpose field.</li>
              </ul>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomBookings;
