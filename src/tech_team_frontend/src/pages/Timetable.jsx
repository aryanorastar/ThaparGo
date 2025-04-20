import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../providers/AuthProvider';

// Mock data for development
const MOCK_BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE'];
const MOCK_YEARS = [1, 2, 3, 4];
const MOCK_BATCHES = [
  { id: '1', name: 'CSE-1', branch: 'CSE', year: 1, section: 'A' },
  { id: '2', name: 'CSE-2', branch: 'CSE', year: 1, section: 'B' },
  { id: '3', name: 'ECE-1', branch: 'ECE', year: 2, section: 'A' },
  { id: '4', name: 'ME-1', branch: 'ME', year: 3, section: 'A' },
];
const MOCK_SCHEDULES = [
  { 
    id: '1', 
    day: 'Monday', 
    batch_id: '1',
    slots: [
      { id: 'slot-1', startTime: '9:00', endTime: '10:00', subject: 'Data Structures', teacher: 'Dr. Smith', room: 'L101', type: 'class' },
      { id: 'slot-2', startTime: '10:00', endTime: '11:00', subject: 'Algorithms', teacher: 'Dr. Johnson', room: 'L102', type: 'class' },
      { id: 'slot-3', startTime: '11:00', endTime: '12:00', subject: 'Database Systems', teacher: 'Prof. Williams', room: 'L103', type: 'lab' },
    ]
  },
  { 
    id: '2', 
    day: 'Tuesday', 
    batch_id: '1',
    slots: [
      { id: 'slot-4', startTime: '9:00', endTime: '10:00', subject: 'Computer Networks', teacher: 'Dr. Brown', room: 'L201', type: 'class' },
      { id: 'slot-5', startTime: '10:00', endTime: '11:00', subject: 'Operating Systems', teacher: 'Dr. Davis', room: 'L202', type: 'class' },
      { id: 'slot-6', startTime: '11:00', endTime: '12:00', subject: 'Software Engineering', teacher: 'Prof. Miller', room: 'L203', type: 'lab' },
    ]
  },
];

const Timetable = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([1, 2, 3, 4]);
  const [batches, setBatches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBatchData, setSelectedBatchData] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editedSlot, setEditedSlot] = useState({
    subject: '',
    teacher: '',
    room: '',
    type: 'class'
  });
  const [useMockData, setUseMockData] = useState(true); // Start with mock data by default

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Initialize with mock data
  useEffect(() => {
    try {
      console.log("Initializing Timetable component");
      setBatches(MOCK_BATCHES);
      setBranches(MOCK_BRANCHES);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing Timetable:", error);
      setLoading(false);
    }
  }, []);

  // Load schedule data when batch is selected
  useEffect(() => {
    if (!selectedBatch) return;
    
    try {
      console.log("Loading schedule for batch:", selectedBatch);
      setLoading(true);
      
      // Use mock data
      const mockBatchData = MOCK_BATCHES.find(b => b.id === selectedBatch);
      setSelectedBatchData(mockBatchData || MOCK_BATCHES[0]);
      
      const mockSchedules = MOCK_SCHEDULES.filter(s => s.batch_id === selectedBatch);
      
      // Create a schedule for each weekday if it doesn't exist
      const schedules = [...mockSchedules];
      const batch_id = selectedBatch;
      
      weekdays.forEach(day => {
        if (!schedules.find(s => s.day === day)) {
          schedules.push({
            id: `temp-${day}`,
            day,
            slots: [],
            batch_id
          });
        }
      });
      
      setScheduleData(schedules);
      setLoading(false);
    } catch (error) {
      console.error("Error loading schedule:", error);
      setLoading(false);
    }
  }, [selectedBatch]);
  
  const handleBatchChange = (value) => {
    console.log("Batch changed to:", value);
    setSelectedBatch(value);
  };
  
  const handleBranchChange = (value) => {
    console.log("Branch changed to:", value);
    setSelectedBranch(value);
    // Reset selected batch when branch changes
    setSelectedBatch('');
  };
  
  const handleYearChange = (value) => {
    console.log("Year changed to:", value);
    setSelectedYear(value);
    // Reset selected batch when year changes
    setSelectedBatch('');
  };
  
  const handleEditSlot = (day, slot) => {
    try {
      console.log("Editing slot:", { day, slot });
      setEditingDay(day);
      setEditingSlot(slot);
      setEditedSlot({
        subject: slot.subject || '',
        teacher: slot.teacher || '',
        room: slot.room || '',
        type: slot.type || 'class',
      });
      setIsSlotDialogOpen(true);
    } catch (error) {
      console.error("Error editing slot:", error);
      toast({
        title: "Error",
        description: "Could not edit the slot. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSlot = () => {
    try {
      console.log("Saving slot:", { editingDay, editingSlot, editedSlot });
      if (!editingDay || !editingSlot || !selectedBatch) {
        console.error("Missing required data for saving slot");
        return;
      }
      
      // Find the schedule to update
      const scheduleToUpdate = scheduleData.find(s => s.day === editingDay);
      if (!scheduleToUpdate) {
        console.error('Schedule not found for day:', editingDay);
        toast({
          title: 'Error saving schedule',
          description: 'Schedule not found for the selected day.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update the slot in the schedule
      let updatedScheduleData;
      
      if (editingSlot.id.startsWith('new-')) {
        // This is a new slot being added
        updatedScheduleData = scheduleData.map(schedule => {
          if (schedule.day === editingDay) {
            return {
              ...schedule,
              slots: [...(schedule.slots || []), {
                ...editingSlot,
                ...editedSlot,
                type: editedSlot.subject === 'Free Period' ? 'free' : (editedSlot.type || 'class')
              }]
            };
          }
          return schedule;
        });
      } else {
        // This is an existing slot being updated
        updatedScheduleData = scheduleData.map(schedule => {
          if (schedule.day === editingDay) {
            const updatedSlots = schedule.slots.map(slot => {
              if (slot.id === editingSlot.id) {
                return {
                  ...slot,
                  ...editedSlot,
                  type: editedSlot.subject === 'Free Period' ? 'free' : (editedSlot.type || 'class')
                };
              }
              return slot;
            });
            
            return { ...schedule, slots: updatedSlots };
          }
          return schedule;
        });
      }
      
      setScheduleData(updatedScheduleData);
      
      toast({
        title: 'Schedule saved',
        description: 'The schedule has been updated successfully.',
      });
    } catch (error) {
      console.error("Error saving slot:", error);
      toast({
        title: 'Error saving schedule',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSlotDialogOpen(false);
    }
  };
  
  const handleDeleteSlot = (day, slotId) => {
    try {
      console.log("Deleting slot:", { day, slotId });
      const updatedScheduleData = scheduleData.map(schedule => {
        if (schedule.day === day) {
          return {
            ...schedule,
            slots: schedule.slots.filter(slot => slot.id !== slotId)
          };
        }
        return schedule;
      });
      
      setScheduleData(updatedScheduleData);
      
      toast({
        title: 'Slot deleted',
        description: 'The slot has been removed from the schedule.',
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast({
        title: "Error",
        description: "Could not delete the slot. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredBatches = batches.filter(batch => 
    (!selectedBranch || batch.branch === selectedBranch) && 
    (!selectedYear || batch.year === parseInt(selectedYear))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Timetable</h1>
          <p className="text-gray-500">View and manage class schedules</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Select Batch</CardTitle>
                <CardDescription>Choose a branch, year, and batch to view the timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select value={selectedBranch} onValueChange={handleBranchChange}>
                      <SelectTrigger id="branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Branches</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Years</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select value={selectedBatch} onValueChange={handleBatchChange}>
                      <SelectTrigger id="batch">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBatches.length > 0 ? (
                          filteredBatches.map(batch => (
                            <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No batches found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {selectedBatch && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedBatchData ? `${selectedBatchData.name} Timetable` : 'Timetable'}
                  </CardTitle>
                  <CardDescription>
                    {selectedBatchData ? `Schedule for ${selectedBatchData.branch} Year ${selectedBatchData.year} Section ${selectedBatchData.section}` : 'Class schedule'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="Monday">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                      {weekdays.map(day => (
                        <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {weekdays.map(day => (
                      <TabsContent key={day} value={day}>
                        <div className="space-y-4">
                          {scheduleData.find(schedule => schedule.day === day)?.slots?.map((slot, index) => (
                            <div 
                              key={slot.id || index} 
                              className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                            >
                              <div>
                                <div className="font-medium">{slot.subject}</div>
                                <div className="text-sm text-gray-500">
                                  {slot.teacher && `${slot.teacher} • `}
                                  {slot.room && `Room ${slot.room} • `}
                                  {slot.type === 'lab' ? 'Lab' : 'Lecture'}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-500">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                                {user && (
                                  <div className="flex space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditSlot(day, slot)}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteSlot(day, slot.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {(!scheduleData.find(schedule => schedule.day === day)?.slots?.length) && (
                            <div className="text-center p-4 text-gray-500 text-sm">
                              No classes scheduled
                            </div>
                          )}
                          
                          {user && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => {
                                try {
                                  const newSlot = {
                                    id: `new-${Date.now()}`,
                                    startTime: '09:00',
                                    endTime: '10:00',
                                    subject: 'New Class',
                                    teacher: '',
                                    room: '',
                                    type: 'class'
                                  };
                                  
                                  setEditingDay(day);
                                  setEditingSlot(newSlot);
                                  setEditedSlot({
                                    subject: newSlot.subject,
                                    teacher: newSlot.teacher,
                                    room: newSlot.room,
                                    type: newSlot.type
                                  });
                                  
                                  setIsSlotDialogOpen(true);
                                } catch (error) {
                                  console.error("Error adding new slot:", error);
                                  toast({
                                    title: "Error",
                                    description: "Could not add a new slot. Please try again.",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              Add Slot
                            </Button>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
      
      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlot?.id?.startsWith('new-') ? 'Add New Slot' : 'Edit Slot'}</DialogTitle>
            <DialogDescription>
              {editingDay && `${editingDay} schedule for ${selectedBatchData?.name || 'batch'}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  value={editingSlot?.startTime || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                  placeholder="09:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  value={editingSlot?.endTime || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                  placeholder="10:00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={editedSlot.subject}
                onChange={(e) => setEditedSlot({...editedSlot, subject: e.target.value})}
                placeholder="Subject name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Input
                id="teacher"
                value={editedSlot.teacher}
                onChange={(e) => setEditedSlot({...editedSlot, teacher: e.target.value})}
                placeholder="Teacher name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={editedSlot.room}
                onChange={(e) => setEditedSlot({...editedSlot, room: e.target.value})}
                placeholder="Room number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={editedSlot.type} 
                onValueChange={(value) => setEditedSlot({...editedSlot, type: value})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Lecture</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="free">Free Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSlot}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
