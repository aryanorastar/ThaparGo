import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { useAuth } from '../providers/AuthProvider';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const Classrooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [classrooms, setClassrooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [editRoom, setEditRoom] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch classrooms from Supabase
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const { data: classroomsData, error: classroomsError } = await supabase
          .from('classrooms')
          .select('*');
        
        if (classroomsError) {
          toast({
            title: 'Error fetching classrooms',
            description: classroomsError.message,
            variant: 'destructive',
          });
          return;
        }
        
        setClassrooms(classroomsData || []);
        
        // Extract unique buildings
        const uniqueBuildings = [...new Set(classroomsData.map(room => room.building))].filter(Boolean);
        setBuildings(uniqueBuildings);
        
        // Generate availability data
        const availabilityData = {};
        classroomsData.forEach(room => {
          availabilityData[room.id] = {
            current: Math.random() > 0.5 ? 'Available' : 'Occupied',
            todayOccupancy: generateDefaultSchedule(room.name)
          };
        });
        
        setAvailabilityMap(availabilityData);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Unexpected error',
          description: 'Failed to load classrooms data',
          variant: 'destructive',
        });
      }
    };

    fetchClassrooms();
  }, [toast]);
  
  // Generate default schedule
  const generateDefaultSchedule = (roomName) => {
    const timeSlots = [
      { startTime: '09:00', endTime: '10:30' },
      { startTime: '10:45', endTime: '12:15' },
      { startTime: '12:30', endTime: '14:00' },
      { startTime: '14:15', endTime: '15:45' },
      { startTime: '16:00', endTime: '17:30' }
    ];
    
    return timeSlots.map(slot => ({
      ...slot,
      type: Math.random() > 0.5 ? 'free' : 'occupied',
      subject: Math.random() > 0.5 ? 'No Class' : `Class ${Math.floor(Math.random() * 10) + 1}`
    }));
  };
  
  // Filter classrooms based on search and filters
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (classroom.building && classroom.building.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBuilding = buildingFilter === 'all' || classroom.building === buildingFilter;
    
    let matchesCapacity = true;
    if (capacityFilter === 'small') {
      matchesCapacity = classroom.capacity < 30;
    } else if (capacityFilter === 'medium') {
      matchesCapacity = classroom.capacity >= 30 && classroom.capacity < 100;
    } else if (capacityFilter === 'large') {
      matchesCapacity = classroom.capacity >= 100;
    }
    
    return matchesSearch && matchesBuilding && matchesCapacity;
  });
  
  const toggleRoomAvailability = (roomId) => {
    setAvailabilityMap(prev => {
      const current = prev[roomId].current;
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          current: current === 'Available' ? 'Occupied' : 'Available'
        }
      };
    });
  };
  
  const handleEditSchedule = (room) => {
    setEditRoom(room);
    setCurrentSchedule(availabilityMap[room.id]?.todayOccupancy || generateDefaultSchedule(room.name));
  };
  
  const handleSaveSchedule = () => {
    if (!editRoom) return;
    
    setAvailabilityMap(prev => ({
      ...prev,
      [editRoom.id]: {
        ...prev[editRoom.id],
        todayOccupancy: currentSchedule
      }
    }));
    
    setEditRoom(null);
    toast({
      title: 'Schedule updated',
      description: `Schedule for ${editRoom.name} has been updated.`,
    });
  };
  
  const updateSlotSchedule = (index, field, value) => {
    setCurrentSchedule(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Classrooms</h1>
      <p className="text-lg mb-8">Find and check the availability of classrooms across campus.</p>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading classrooms...</p>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find Classrooms</CardTitle>
              <CardDescription>Search and filter classrooms based on your requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input 
                    id="search"
                    placeholder="Search by name or building..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="building-filter">Building</Label>
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger id="building-filter" className="mt-1">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buildings</SelectItem>
                      {buildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capacity-filter">Capacity</Label>
                  <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                    <SelectTrigger id="capacity-filter" className="mt-1">
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="small">Small (&lt;30)</SelectItem>
                      <SelectItem value="medium">Medium (30-100)</SelectItem>
                      <SelectItem value="large">Large (&gt;100)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                          {classroom.room_no && <span> | Room {classroom.room_no}</span>}
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
                                      slot.type === 'free' ? 'bg-green-50' : 'bg-red-50'
                                    }`}
                                  >
                                    <TableCell className="font-medium">{slot.startTime} - {slot.endTime}</TableCell>
                                    <TableCell>{slot.type === 'free' ? 'Available' : 'Occupied'}</TableCell>
                                    <TableCell>{slot.subject}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              onClick={() => handleEditSchedule(classroom)}
                              variant="outline" 
                              size="sm"
                            >
                              Edit Schedule
                            </Button>
                          </div>
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
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
      
      <Dialog open={!!editRoom} onOpenChange={(open) => !open && setEditRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Schedule: {editRoom?.name}</DialogTitle>
            <DialogDescription>
              Update the schedule for {editRoom?.name} for today.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {currentSchedule.map((slot, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                <div className="col-span-4 font-medium">{slot.startTime} - {slot.endTime}</div>
                <div className="col-span-3">
                  <Select 
                    value={slot.type}
                    onValueChange={(value) => updateSlotSchedule(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-5">
                  <Input 
                    value={slot.subject}
                    onChange={(e) => updateSlotSchedule(index, 'subject', e.target.value)}
                    placeholder="Subject/Class"
                    disabled={slot.type === 'free'}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoom(null)}>Cancel</Button>
            <Button onClick={handleSaveSchedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classrooms;
