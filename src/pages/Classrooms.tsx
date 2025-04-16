
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Classroom } from '@/types';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '../providers/AuthProvider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Classrooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, any>>({});
  const [editRoom, setEditRoom] = useState<string | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch classrooms from Supabase
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const { data, error } = await supabase
          .from('classrooms')
          .select('*');
        
        if (error) {
          console.error('Error fetching classrooms:', error);
          toast({
            title: 'Error',
            description: 'Failed to load classrooms. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        setClassrooms(data as Classroom[]);
        
        // Extract unique buildings
        const uniqueBuildings = Array.from(new Set(data.map(room => room.building)));
        setBuildings(uniqueBuildings);
        
        // Initialize availability data
        const initialAvailability: Record<string, any> = {};
        
        // Get current day's schedule from Supabase schedules table to determine room occupancy
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const { data: scheduleData } = await supabase
          .from('schedules')
          .select('slots')
          .eq('day', currentDay);
        
        // Process schedule data to identify rooms that are occupied
        const occupiedRooms = new Set<string>();
        if (scheduleData && scheduleData.length > 0) {
          scheduleData.forEach(schedule => {
            const slots = Array.isArray(schedule.slots) ? schedule.slots : JSON.parse(schedule.slots as string);
            slots.forEach((slot: any) => {
              if (slot.room && slot.type !== 'free') {
                // For simplicity, we'll consider any room mentioned in today's schedule as potentially occupied
                occupiedRooms.add(slot.room);
              }
            });
          });
        }
        
        data.forEach(room => {
          // Check if room is in the occupied list from today's schedule
          const isOccupied = occupiedRooms.has(room.name) || occupiedRooms.has(room.room_no || '');
          
          initialAvailability[room.id] = {
            current: isOccupied ? 'Occupied' : 'Available',
            todayOccupancy: generateDefaultSchedule(room.name)
          };
        });
        
        setAvailabilityMap(initialAvailability);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [toast]);
  
  // Generate default schedule
  const generateDefaultSchedule = (roomName: string) => {
    // Try to get schedule data for this room from schedules in supabase
    const defaultSchedule = [
      { time: '08:00 AM - 09:00 AM', status: 'Available', subject: '' },
      { time: '09:00 AM - 10:00 AM', status: 'Available', subject: '' },
      { time: '10:00 AM - 11:00 AM', status: 'Available', subject: '' },
      { time: '11:00 AM - 12:00 PM', status: 'Available', subject: '' },
      { time: '12:00 PM - 01:00 PM', status: 'Available', subject: '' },
      { time: '01:00 PM - 02:00 PM', status: 'Available', subject: '' },
      { time: '02:00 PM - 03:00 PM', status: 'Available', subject: '' },
      { time: '03:00 PM - 04:00 PM', status: 'Available', subject: '' },
    ];
    
    return defaultSchedule;
  };
  
  // Filter classrooms based on search and filters
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         classroom.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (classroom.room_no && classroom.room_no.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBuilding = buildingFilter === 'all' || classroom.building === buildingFilter;
    
    const matchesCapacity = capacityFilter === 'all' || 
                           (capacityFilter === 'small' && classroom.capacity && classroom.capacity <= 30) ||
                           (capacityFilter === 'medium' && classroom.capacity && classroom.capacity > 30 && classroom.capacity <= 60) ||
                           (capacityFilter === 'large' && classroom.capacity && classroom.capacity > 60);
    
    return matchesSearch && matchesBuilding && matchesCapacity;
  });
  
  // Toggle room availability
  const toggleRoomAvailability = (roomId: string) => {
    setAvailabilityMap(prev => {
      const currentStatus = prev[roomId]?.current;
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          current: currentStatus === 'Available' ? 'Occupied' : 'Available'
        }
      };
    });
    
    toast({
      title: 'Room Status Updated',
      description: 'The room status has been successfully updated.',
    });
  };
  
  // Edit schedule
  const openScheduleEditor = (roomId: string) => {
    setEditRoom(roomId);
    setCurrentSchedule([...availabilityMap[roomId]?.todayOccupancy || []]);
  };
  
  // Update schedule slot
  const updateScheduleSlot = (index: number, field: string, value: string) => {
    setCurrentSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  // Save schedule changes
  const saveScheduleChanges = () => {
    if (!editRoom) return;
    
    setAvailabilityMap(prev => ({
      ...prev,
      [editRoom]: {
        ...prev[editRoom],
        todayOccupancy: currentSchedule
      }
    }));
    
    setEditRoom(null);
    
    toast({
      title: 'Schedule Updated',
      description: 'The room schedule has been successfully updated.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Classrooms</h1>
      <p className="text-lg mb-8">Find and check the availability of classrooms across campus.</p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find Classrooms</CardTitle>
              <CardDescription>Search and filter classrooms based on your requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="search" className="mb-1 block">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, room number, or building..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="building" className="mb-1 block">Building</Label>
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger id="building">
                      <SelectValue placeholder="All Buildings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buildings</SelectItem>
                      {buildings.map(building => (
                        <SelectItem key={building || 'unknown'} value={building || 'unknown'}>{building || 'Unknown'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capacity" className="mb-1 block">Capacity</Label>
                  <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                    <SelectTrigger id="capacity">
                      <SelectValue placeholder="Any Capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Capacity</SelectItem>
                      <SelectItem value="small">Small (≤ 30)</SelectItem>
                      <SelectItem value="medium">Medium (31-60)</SelectItem>
                      <SelectItem value="large">Large (&gt; 60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredClassrooms.length} classrooms found
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map(classroom => {
              const availability = availabilityMap[classroom.id] || {
                current: 'Available',
                todayOccupancy: generateDefaultSchedule(classroom.name)
              };
              
              return (
                <Card key={classroom.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{classroom.name}</CardTitle>
                        <CardDescription>
                          {classroom.building}, Floor {classroom.floor}
                          {classroom.room_no && <span> | Room: {classroom.room_no}</span>}
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        availability.current === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {availability.current}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="details">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                        <TabsTrigger value="schedule" className="flex-1">Today's Schedule</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                            <p>{classroom.capacity} seats</p>
                          </div>
                          
                          {classroom.room_no && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Room Number</h3>
                              <p>{classroom.room_no}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-semibold">Current Status</h3>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  checked={availability.current === 'Available'}
                                  onCheckedChange={() => toggleRoomAvailability(classroom.id)}
                                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                                />
                                <span className={`text-sm font-medium ${
                                  availability.current === 'Available' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {availability.current === 'Available' ? 'Available' : 'Occupied'}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Toggle to change the availability status of this room</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="schedule">
                        <div className="space-y-2">
                          <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                            <p>This is today's schedule for {classroom.name}. Click the Edit Schedule button to update it.</p>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Time</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Subject</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {availability.todayOccupancy.map((slot, index) => (
                                  <TableRow 
                                    key={index}
                                    className={`${
                                      slot.status === 'Available' ? 'bg-green-50' : 'bg-red-50'
                                    }`}
                                  >
                                    <TableCell className="font-medium">{slot.time}</TableCell>
                                    <TableCell className={`${
                                      slot.status === 'Available' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {slot.status}
                                    </TableCell>
                                    <TableCell>{slot.subject || '-'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={() => openScheduleEditor(classroom.id)}
                          >
                            Edit Schedule
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredClassrooms.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No classrooms found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          )}
          
          {/* Schedule Editor Dialog */}
          <Dialog open={!!editRoom} onOpenChange={(open) => !open && setEditRoom(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Classroom Schedule</DialogTitle>
                <DialogDescription>
                  Update the schedule for today. Toggle availability and set subjects for each time slot.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 max-h-[60vh] overflow-auto py-4">
                {currentSchedule.map((slot, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                    <div className="col-span-4 font-medium">{slot.time}</div>
                    
                    <div className="col-span-3">
                      <Select 
                        value={slot.status} 
                        onValueChange={(val) => updateScheduleSlot(index, 'status', val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Occupied">Occupied</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-5">
                      <Input
                        placeholder="Subject or event name"
                        value={slot.subject}
                        onChange={(e) => updateScheduleSlot(index, 'subject', e.target.value)}
                        disabled={slot.status === 'Available'}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditRoom(null)}>
                  Cancel
                </Button>
                <Button onClick={saveScheduleChanges}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Classrooms;
