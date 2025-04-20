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

// Mock data for development
const MOCK_CLASSROOMS = [
  { id: '1', name: 'L101', building: 'Main Building', capacity: 60, hasProjector: true, hasAC: true, type: 'Lecture Hall', floor: 1, room_no: '101' },
  { id: '2', name: 'L102', building: 'Main Building', capacity: 40, hasProjector: true, hasAC: true, type: 'Lecture Hall', floor: 1, room_no: '102' },
  { id: '3', name: 'L201', building: 'Science Block', capacity: 120, hasProjector: true, hasAC: true, type: 'Lecture Hall', floor: 2, room_no: '201' },
  { id: '4', name: 'C101', building: 'Computer Block', capacity: 30, hasProjector: true, hasAC: true, type: 'Computer Lab', floor: 1, room_no: '101' },
  { id: '5', name: 'S101', building: 'Science Block', capacity: 25, hasProjector: false, hasAC: true, type: 'Lab', floor: 1, room_no: '101' },
  { id: '6', name: 'M101', building: 'Mechanical Block', capacity: 50, hasProjector: true, hasAC: false, type: 'Workshop', floor: 1, room_no: '101' },
];

const MOCK_BUILDINGS = ['Main Building', 'Science Block', 'Computer Block', 'Mechanical Block'];

const MOCK_AVAILABILITY = {
  '1': { 'Monday': [true, false, true, true, false, true, true, true], 'Tuesday': [true, true, true, false, false, true, true, true] },
  '2': { 'Monday': [false, false, true, true, true, true, false, true], 'Tuesday': [true, true, false, false, true, true, true, true] },
  '3': { 'Monday': [true, true, false, false, true, true, true, false], 'Tuesday': [false, true, true, true, false, false, true, true] },
  '4': { 'Monday': [false, true, true, true, false, true, true, true], 'Tuesday': [true, false, false, true, true, true, false, true] },
  '5': { 'Monday': [true, true, true, false, false, true, true, false], 'Tuesday': [true, true, true, true, false, false, true, true] },
  '6': { 'Monday': [true, false, true, true, true, false, false, true], 'Tuesday': [false, true, true, true, true, false, true, true] },
};

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
  const [useMockData, setUseMockData] = useState(false);

  // Fetch classrooms from Supabase
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const { data: classroomsData, error: classroomsError } = await supabase
          .from('classrooms')
          .select('*');
        
        if (classroomsError) {
          console.warn('Supabase error, using mock data:', classroomsError.message);
          setUseMockData(true);
          setClassrooms(MOCK_CLASSROOMS);
          setBuildings(MOCK_BUILDINGS);
          setAvailabilityMap(MOCK_AVAILABILITY);
          setLoading(false);
          return;
        }
        
        setClassrooms(classroomsData || []);
        
        // Extract unique buildings
        const uniqueBuildings = [...new Set(classroomsData.map(room => room.building))].filter(Boolean);
        setBuildings(uniqueBuildings);
        
        // Generate availability data
        const fetchAvailability = async () => {
          const { data: availabilityData, error: availabilityError } = await supabase
            .from('classroom_availability')
            .select('*');
          
          if (availabilityError) {
            console.warn('Error fetching availability, using mock data:', availabilityError.message);
            setAvailabilityMap(MOCK_AVAILABILITY);
            return;
          }
          
          // Process availability data
          const availMap = {};
          availabilityData.forEach(item => {
            if (!availMap[item.classroom_id]) {
              availMap[item.classroom_id] = {};
            }
            availMap[item.classroom_id][item.day] = item.slots;
          });
          
          setAvailabilityMap(availMap);
        };
        
        await fetchAvailability();
      } catch (error) {
        console.warn('Unexpected error, using mock data:', error);
        setUseMockData(true);
        setClassrooms(MOCK_CLASSROOMS);
        setBuildings(MOCK_BUILDINGS);
        setAvailabilityMap(MOCK_AVAILABILITY);
      } finally {
        setLoading(false);
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
                          {classroom.building || 'Unknown Building'}
                          {classroom.floor && <span>, Floor {classroom.floor}</span>}
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
                            <p>{classroom.capacity || 'Unknown'} seats</p>
                          </div>
                          
                          {classroom.room_no && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Room Number</h3>
                              <p>{classroom.room_no}</p>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Facilities</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <div className={`px-2 py-1 rounded-full text-xs ${classroom.hasProjector ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {classroom.hasProjector ? 'Projector' : 'No Projector'}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${classroom.hasAC ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {classroom.hasAC ? 'Air Conditioned' : 'No AC'}
                              </div>
                              {classroom.type && (
                                <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {classroom.type}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => toggleRoomAvailability(classroom.id)}
                            >
                              Toggle Availability
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="schedule">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-medium">Today's Schedule</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditSchedule(classroom)}
                            >
                              Edit
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {availability.todayOccupancy && availability.todayOccupancy.map((slot, index) => (
                              <div 
                                key={index} 
                                className={`p-2 rounded-md border ${
                                  slot.type === 'free' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    slot.type === 'free' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {slot.type === 'free' ? 'Available' : 'Occupied'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {slot.subject || 'No class scheduled'}
                                </p>
                              </div>
                            ))}
                            
                            {(!availability.todayOccupancy || availability.todayOccupancy.length === 0) && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No schedule information available
                              </p>
                            )}
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
      
      {editRoom && (
        <Dialog open={!!editRoom} onOpenChange={() => setEditRoom(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Schedule for {editRoom.name}</DialogTitle>
              <DialogDescription>
                Update the schedule for this classroom. Toggle between available and occupied for each time slot.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {currentSchedule.map((slot, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <p className="text-sm font-medium">{slot.startTime} - {slot.endTime}</p>
                    <Input
                      value={slot.subject}
                      onChange={(e) => updateSlotSchedule(index, 'subject', e.target.value)}
                      placeholder="Subject or class name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={slot.type === 'free'}
                      onCheckedChange={(checked) => updateSlotSchedule(index, 'type', checked ? 'free' : 'occupied')}
                    />
                    <span className="text-sm">
                      {slot.type === 'free' ? 'Available' : 'Occupied'}
                    </span>
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
      )}
    </div>
  );
};

export default Classrooms;
