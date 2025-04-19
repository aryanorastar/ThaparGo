
import React, { useState, useEffect } from 'react';
import { Classroom } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Check, Clock, X } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../providers/AuthProvider';
import { RoomBooking } from '../types';

const RoomBookings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    roomId: '',
    purpose: '',
    society: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  
  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('room_bookings')
          .select('*')
          .eq('user_id', user.id);
        
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

    const fetchClassrooms = async () => {
      try {
        const { data, error } = await supabase
          .from('classrooms')
          .select('*');
        
        if (error) {
          console.error('Error fetching classrooms:', error);
          return;
        }
        
        setClassrooms(data as Classroom[]);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchBookings();
    fetchClassrooms();
  }, [user, toast]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switching to new booking tab
  const switchToNewBookingTab = () => {
    const element = document.querySelector('[data-value="new-booking"]');
    if (element instanceof HTMLElement) {
      element.click();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.roomId || !formData.purpose || !formData.society || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Find classroom name
      const classroom = classrooms.find(room => room.id === formData.roomId);
      const roomName = classroom ? classroom.name : '';
      
      // Create new booking
      const { data, error } = await supabase
        .from('room_bookings')
        .insert([
          {
            room_id: formData.roomId,
            room_name: roomName,
            purpose: formData.purpose,
            society: formData.society,
            date: formData.date,
            start_time: formData.startTime,
            end_time: formData.endTime,
            status: 'pending',
            user_id: user?.id
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Error",
          description: "Failed to create booking: " + error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Add new booking to state with proper mapping
      if (data) {
        const newBooking: RoomBooking = {
          id: data[0].id,
          roomId: data[0].room_id || '',
          roomName: data[0].room_name,
          purpose: data[0].purpose,
          society: data[0].society,
          date: data[0].date,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          status: data[0].status as 'pending' | 'approved' | 'rejected',
          userId: data[0].user_id,
          createdAt: data[0].created_at
        };
        setBookings([...bookings, newBooking]);
      }
      
      // Reset form
      setFormData({
        roomId: '',
        purpose: '',
        society: '',
        date: '',
        startTime: '',
        endTime: '',
      });
      
      toast({
        title: "Booking Request Submitted",
        description: "Your room booking request has been submitted and is pending approval.",
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                <p className="text-gray-500">You haven't made unknown room booking requests yet.</p>
                <Button className="mt-4" onClick={switchToNewBookingTab}>
                  Make a Booking
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
                  <Label htmlFor="purpose" className="mb-1 block">Purpose of Booking</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    placeholder="Provide details about the event or meeting..."
                    rows={4}
                    value={formData.purpose}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Room Booking Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Bookings must be made at least 3 days in advance.</li>
            <li>All society bookings require approval from the administration.</li>
            <li>The society is responsible for keeping the room clean and orderly.</li>
            <li>Any damage to property will be the responsibility of the society.</li>
            <li>Booking duration should not exceed 4 hours.</li>
            <li>Rooms must be vacated on time for subsequent bookings.</li>
            <li>Food and drinks are not allowed in classrooms and labs.</li>
            <li>For technical equipment, please specify in the purpose field.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomBookings;
