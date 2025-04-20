import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Calendar, ClipboardList, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/InternetIdentityProvider';

// Mock data for development
const MOCK_CLASSROOMS = [
  { id: '1', name: 'L101', building: 'Main Building', capacity: 60 },
  { id: '2', name: 'L102', building: 'Main Building', capacity: 40 },
  { id: '3', name: 'L201', building: 'Science Block', capacity: 120 },
  { id: '4', name: 'C101', building: 'Computer Block', capacity: 30 },
  { id: '5', name: 'S101', building: 'Science Block', capacity: 25 },
  { id: '6', name: 'M101', building: 'Mechanical Block', capacity: 50 },
];

const MOCK_BOOKINGS = [
  { 
    id: '1', 
    roomId: '1', 
    rooms: { name: 'L101' },
    purpose: 'IEEE Workshop on IoT', 
    society: 'IEEE Student Branch',
    date: '2025-04-25',
    startTime: '14:00',
    endTime: '16:00',
    status: 'approved',
    created_at: '2025-04-18T10:30:00Z'
  },
  { 
    id: '2', 
    roomId: '3', 
    rooms: { name: 'L201' },
    purpose: 'Literary Society Meeting', 
    society: 'Literary Society',
    date: '2025-04-27',
    startTime: '10:00',
    endTime: '12:00',
    status: 'pending',
    created_at: '2025-04-19T09:15:00Z'
  },
  { 
    id: '3', 
    roomId: '4', 
    rooms: { name: 'C101' },
    purpose: 'Coding Competition', 
    society: 'Coding Club',
    date: '2025-05-02',
    startTime: '09:00',
    endTime: '17:00',
    status: 'pending',
    created_at: '2025-04-20T11:45:00Z'
  }
];

const RoomBookings = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [classrooms] = useState(MOCK_CLASSROOMS);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading, principal, login } = useAuth();
  
  const [formData, setFormData] = useState({
    roomId: '',
    purpose: '',
    society: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.roomId || !formData.purpose || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create new booking object
      const newBooking = {
        id: String(bookings.length + 1),
        roomId: formData.roomId,
        rooms: { name: classrooms.find(room => room.id === formData.roomId)?.name || 'Unknown Room' },
        purpose: formData.purpose,
        society: formData.society || 'Personal',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      // Add the new booking to the bookings state
      setBookings([...bookings, newBooking]);
      
      toast({
        title: 'Booking Request Submitted',
        description: 'Your room booking request has been submitted successfully.',
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
      
      setSubmitting(false);
      
      // Switch to the "My Bookings" tab to show the new booking
      document.querySelector('[value="my-bookings"]').click();
    }, 1500);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-b-2 animate-spin border-thapar-maroon"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="container py-8 mx-auto">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access room booking functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <LogIn className="mb-4 w-16 h-16 text-thapar-maroon" />
            <p className="mb-6">
              You need to be authenticated with Internet Identity to view and create room bookings.
            </p>
            <Button onClick={login}>
              Login with Internet Identity
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-2 text-3xl font-bold">Room Bookings</h1>
      <p className="mb-6 text-gray-500">Book rooms for events, meetings, and activities</p>
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => document.querySelector('[value="new-booking"]').click()}>
          New Booking
        </Button>
      </div>
      
      <Tabs defaultValue="new-booking">
        <TabsList className="mb-6">
          <TabsTrigger value="new-booking" className="flex items-center">
            <Calendar className="mr-2 w-4 h-4" />
            New Booking
          </TabsTrigger>
          <TabsTrigger value="my-bookings" className="flex items-center">
            <ClipboardList className="mr-2 w-4 h-4" />
            My Bookings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-booking">
          <Card>
            <CardHeader>
              <CardTitle>Book a Room</CardTitle>
              <CardDescription>
                Fill in the details to request a room booking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roomId">Select Room</Label>
                    <Select 
                      value={formData.roomId} 
                      onValueChange={(value) => handleSelectChange('roomId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} ({room.building}) - Capacity: {room.capacity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="society">Society/Department (Optional)</Label>
                    <Input 
                      id="society" 
                      name="society" 
                      value={formData.society}
                      onChange={handleInputChange}
                      placeholder="Leave blank for personal bookings" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        name="date" 
                        type="date" 
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input 
                        id="startTime" 
                        name="startTime" 
                        type="time" 
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea 
                    id="purpose" 
                    name="purpose" 
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of your booking" 
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Booking Requests</CardTitle>
              <CardDescription>
                View and manage your room booking requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="py-10 text-center">
                  <Calendar className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <p className="text-gray-500">You don't have any booking requests yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[value="new-booking"]').click()}
                  >
                    Create Your First Booking
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map(booking => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{booking.purpose}</CardTitle>
                            <CardDescription>{booking.society}</CardDescription>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Room</p>
                            <p>{booking.rooms?.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p>{booking.startTime} - {booking.endTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Requested On</p>
                            <p>{new Date(booking.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomBookings;
