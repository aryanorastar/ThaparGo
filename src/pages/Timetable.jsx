import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../providers/AuthProvider';

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

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .order('name');
        
        if (error) {
          toast({
            title: 'Error fetching batches',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        setBatches(data || []);
        
        // Extract unique branches
        const uniqueBranches = [...new Set(data.map(batch => batch.branch))];
        setBranches(uniqueBranches);
        
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Unexpected error',
          description: 'Failed to load batches',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    const getSubjects = async () => {
      // fetchSubjects is now handled outside production code
    };

    fetchBatches();
    getSubjects();
  }, [toast]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedBatch) return;
      
      try {
        setLoading(true);
        
        // Get batch details
        const { data: batchData, error: batchError } = await supabase
          .from('batches')
          .select('*')
          .eq('id', selectedBatch)
          .single();
        
        if (batchError) {
          toast({
            title: 'Error fetching batch details',
            description: batchError.message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        setSelectedBatchData(batchData);
        
        // Get schedule for this batch
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select('*')
          .eq('batch_id', selectedBatch);
        
        if (scheduleError) {
          toast({
            title: 'Error fetching schedule',
            description: scheduleError.message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        // Create a schedule for each weekday if it doesn't exist
        const schedules = scheduleData || [];
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
      } catch (error) {
        toast({
          title: 'Unexpected error',
          description: 'Failed to load schedule',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedules();
  }, [selectedBatch, toast]);
  
  const handleBatchChange = (value) => {
    setSelectedBatch(value);
  };
  
  const handleBranchChange = (value) => {
    setSelectedBranch(value);
  };
  
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };
  
  const generateDefaultTimeSlots = () => {
    return Array.from({ length: 8 }).map((_, i) => {
      const startHour = 8 + i;
      const endHour = 9 + i;
      
      return {
        id: `slot-${i}`,
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        subject: 'Free Period',
        type: 'free',
      };
    });
  };
  
  const handleEditSlot = (day, slot) => {
    setEditingDay(day);
    setEditingSlot(slot);
    setEditedSlot({
      subject: slot.subject,
      teacher: slot.teacher,
      room: slot.room,
      type: slot.type,
    });
    setIsSlotDialogOpen(true);
  };
  
  const handleSaveSlot = async () => {
    if (!editingDay || !editingSlot || !selectedBatch) return;
    
    const updatedScheduleData = scheduleData.map(schedule => {
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
    
    setScheduleData(updatedScheduleData);
    
    // Find the schedule to update
    const scheduleToUpdate = updatedScheduleData.find(s => s.day === editingDay);
    
    try {
      // If it's a temporary ID, create a new schedule
      if (scheduleToUpdate.id.startsWith('temp-')) {
        const { data, error } = await supabase
          .from('schedules')
          .insert({
            day: day,
            batch_id: batch_id,
            slots: slots
          })
          .select();
        
        if (error) {
          console.error('Error creating schedule:', error);
          toast({
            title: 'Error',
            description: 'Failed to create schedule. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        
        if (data && data.length > 0) {
          setScheduleData(prev => prev.map(s => 
            s.day === scheduleToUpdate.day ? { ...s, id: data[0].id } : s
          ));
        }
      } else {
        const { error } = await supabase
          .from('schedules')
          .update({
            slots: scheduleToUpdate.slots
          })
          .eq('id', scheduleToUpdate.id);
        
        if (error) {
          console.error('Error updating schedule:', error);
          toast({
            title: 'Error',
            description: 'Failed to update schedule. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    
    setIsSlotDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Timetable</h1>
      <p className="text-lg mb-8">View class schedules for different batches and courses.</p>
      
      {loading && !selectedBatchData ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Batch</CardTitle>
              <CardDescription>Choose the branch, year and batch to view its timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="branch" className="mb-1 block">Branch</Label>
                  <Select value={selectedBranch} onValueChange={handleBranchChange}>
                    <SelectTrigger id="branch">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="year" className="mb-1 block">Year</Label>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="batch" className="mb-1 block">Batch</Label>
                  <Select value={selectedBatch} onValueChange={handleBatchChange}>
                    <SelectTrigger id="batch">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches
                        .filter(batch => 
                          (!selectedBranch || batch.branch === selectedBranch) && 
                          (!selectedYear || batch.year.toString() === selectedYear)
                        )
                        .map(batch => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedBatchData && (
            <Tabs defaultValue="grid">
              <TabsList className="mb-6">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedBatchData.name} Timetable</CardTitle>
                    <CardDescription>
                      {selectedBatchData.branch}, Year {selectedBatchData.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      {weekdays.map(day => (
                        <div key={day} className="space-y-2">
                          <h3 className="font-semibold text-center py-2 bg-gray-100 rounded-md">
                            {day}
                          </h3>
                          
                          {scheduleData
                            .find(schedule => schedule.day === day)?.slots
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(slot => (
                              <div
                                key={slot.id} 
                                className={`
                                  p-3 rounded-md mb-2 transition-all duration-300
                                  ${slot.type === 'class' ? 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100' : 
                                    slot.type === 'lab' ? 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100' : 
                                    'bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100'}
                                  ${user ? 'cursor-pointer' : ''}
                                `}
                                onClick={() => user && handleEditSlot(day, slot)}
                              >
                                <div className="font-medium">{slot.subject}</div>
                                {slot.type !== 'free' && (
                                  <>
                                    {slot.teacher && (
                                      <div className="text-xs text-gray-500">
                                        {slot.teacher}
                                      </div>
                                    )}
                                    {slot.room && (
                                      <div className="text-xs text-gray-500">
                                        Room: {slot.room}
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="text-xs mt-1">
                                  {slot.startTime} - {slot.endTime}
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
                                
                                // Add the new slot to the schedule
                                setScheduleData(prev => prev.map(schedule => {
                                  if (schedule.day === day) {
                                    return {
                                      ...schedule,
                                      slots: [...(schedule.slots || []), newSlot]
                                    };
                                  }
                                  return schedule;
                                }));
                                
                                setIsSlotDialogOpen(true);
                              }}
                            >
                              Add Slot
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedBatchData.name} Timetable</CardTitle>
                    <CardDescription>
                      {selectedBatchData.branch}, Year {selectedBatchData.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {weekdays.map(day => (
                      <div key={day} className="mb-6">
                        <h3 className="font-semibold text-lg mb-3">{day}</h3>
                        <div className="space-y-2">
                          {scheduleData
                            .find(schedule => schedule.day === day)?.slots
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(slot => (
                              <div 
                                key={slot.id}
                                className={`
                                  p-3 rounded-md border-l-4 flex justify-between items-center
                                  ${slot.type === 'class' ? 'border-blue-500 bg-blue-50' : 
                                    slot.type === 'lab' ? 'border-green-500 bg-green-50' : 
                                    'border-gray-300 bg-gray-50'}
                                  ${user ? 'cursor-pointer' : ''}
                                `}
                                onClick={() => user && handleEditSlot(day, slot)}
                              >
                                <div>
                                  <div className="font-medium">{slot.subject}</div>
                                  {slot.type !== 'free' && (
                                    <div className="text-sm text-gray-500">
                                      {slot.teacher} {slot.room && `| Room: ${slot.room}`}
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              </div>
                            ))}
                          
                          {(!scheduleData.find(schedule => schedule.day === day)?.slots?.length) && (
                            <div className="text-center p-4 text-gray-500">
                              No classes scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class Slot</DialogTitle>
            <DialogDescription>
              Update the details for this time slot.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  value={editingSlot?.startTime || ''}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  value={editingSlot?.endTime || ''}
                  onChange={(e) => setEditingSlot(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={editedSlot.subject}
                onChange={(e) => setEditedSlot(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Input
                id="teacher"
                value={editedSlot.teacher}
                onChange={(e) => setEditedSlot(prev => ({ ...prev, teacher: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={editedSlot.room}
                onChange={(e) => setEditedSlot(prev => ({ ...prev, room: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select 
                value={editedSlot.type} 
                onValueChange={(value) => setEditedSlot(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
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
            <Button onClick={handleSaveSlot}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
