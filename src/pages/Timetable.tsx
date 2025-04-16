import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { TimeSlot, BatchData, Schedule, Subject } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../providers/AuthProvider';
import { Json } from '@/integrations/supabase/types';
import { fetchSubjects } from '../hooks/useDatabaseSeed';

const Timetable = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [editedSlot, setEditedSlot] = useState<Partial<TimeSlot>>({});
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*');
        
        if (error) {
          console.error('Error fetching batches:', error);
          toast({
            title: 'Error',
            description: 'Failed to load batches. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        const batchData = data as BatchData[];
        setBatches(batchData);
        
        const uniqueBranches = Array.from(new Set(batchData.map(batch => batch.branch)));
        const uniqueYears = Array.from(new Set(batchData.map(batch => batch.year))).sort();
        
        setBranches(uniqueBranches);
        setYears(uniqueYears);
        
        if (uniqueBranches.length > 0) {
          setSelectedBranch(uniqueBranches[0]);
        }
        
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0].toString());
        }
        
        if (batchData.length > 0) {
          setSelectedBatch(batchData[0].id);
        }
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

    const getSubjects = async () => {
      try {
        const { data, error } = await fetchSubjects();
        
        if (error) {
          console.error('Error fetching subjects:', error);
          toast({
            title: 'Error',
            description: 'Failed to load subjects. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        setSubjects(data as Subject[]);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchBatches();
    getSubjects();
  }, [toast]);

  useEffect(() => {
    if (selectedBranch && selectedYear) {
      const filteredBatches = batches.filter(
        batch => batch.branch === selectedBranch && batch.year === parseInt(selectedYear)
      );
      
      if (filteredBatches.length > 0 && !filteredBatches.some(b => b.id === selectedBatch)) {
        setSelectedBatch(filteredBatches[0].id);
      }
    }
  }, [selectedBranch, selectedYear, batches, selectedBatch]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedBatch) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('batch_id', selectedBatch);
        
        if (error) {
          console.error('Error fetching schedules:', error);
          toast({
            title: 'Error',
            description: 'Failed to load schedules. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        let schedules: Schedule[] = [];
        
        if (data && data.length > 0) {
          schedules = data.map(item => {
            let parsedSlots: TimeSlot[];
            if (typeof item.slots === 'string') {
              try {
                parsedSlots = JSON.parse(item.slots);
              } catch (e) {
                console.error('Error parsing slots:', e);
                parsedSlots = [];
              }
            } else {
              parsedSlots = item.slots as unknown as TimeSlot[];
            }
            
            return {
              id: item.id,
              day: item.day,
              slots: parsedSlots,
              batch_id: item.batch_id
            };
          });
        }
        
        weekdays.forEach(day => {
          if (!schedules.find(s => s.day === day)) {
            schedules.push({
              id: `temp-${day}`,
              day: day,
              slots: generateDefaultTimeSlots(),
              batch_id: selectedBatch
            });
          }
        });
        
        schedules.sort((a, b) => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          return days.indexOf(a.day) - days.indexOf(b.day);
        });
        
        setScheduleData(schedules);
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

    fetchSchedules();
  }, [selectedBatch, toast]);
  
  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const generateDefaultTimeSlots = (): TimeSlot[] => {
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

  const handleEditSlot = (day: string, slot: TimeSlot) => {
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
        
        return {
          ...schedule,
          slots: updatedSlots
        };
      }
      return schedule;
    });
    
    setScheduleData(updatedScheduleData);
    setIsSlotDialogOpen(false);
    
    try {
      const scheduleToUpdate = updatedScheduleData.find(s => s.day === editingDay);
      
      if (!scheduleToUpdate) return;
      
      if (scheduleToUpdate.id.startsWith('temp-')) {
        const { data, error } = await supabase
          .from('schedules')
          .insert({
            day: scheduleToUpdate.day,
            batch_id: selectedBatch,
            slots: scheduleToUpdate.slots as unknown as Json
          })
          .select();
        
        if (error) {
          console.error('Error creating schedule:', error);
          toast({
            title: 'Error',
            description: 'Failed to save schedule. Please try again.',
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
            slots: scheduleToUpdate.slots as unknown as Json
          })
          .eq('id', scheduleToUpdate.id);
        
        if (error) {
          console.error('Error updating schedule:', error);
          toast({
            title: 'Error',
            description: 'Failed to update schedule. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      toast({
        title: 'Success',
        description: 'Timetable updated successfully!',
      });
    } catch (error) {
      console.error('Error saving slot:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving.',
        variant: 'destructive',
      });
    }
  };

  const renderTimeSlots = (day: string, slots: TimeSlot[]) => {
    return slots.map((slot) => (
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
            <div className="text-sm text-gray-600">
              {slot.startTime} - {slot.endTime}
            </div>
            {slot.teacher && (
              <div className="text-sm text-gray-600">
                {slot.teacher}
              </div>
            )}
            {slot.room && (
              <div className="text-sm text-gray-600">
                Room: {slot.room}
              </div>
            )}
          </>
        )}
        {user && (
          <div className="mt-1 text-xs text-blue-500">
            Click to edit
          </div>
        )}
      </div>
    ));
  };

  const selectedBatchData = batches.find(batch => batch.id === selectedBatch);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Timetable</h1>
      <p className="text-lg mb-8">View class schedules for different batches and courses.</p>
      
      {loading && !selectedBatchData ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Batch</CardTitle>
              <CardDescription>Choose the branch, year and batch to view its timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <Select value={selectedBranch} onValueChange={handleBranchChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Batch</label>
                  <Select 
                    value={selectedBatch} 
                    onValueChange={handleBatchChange}
                    disabled={batches.filter(b => 
                      b.branch === selectedBranch && 
                      b.year === parseInt(selectedYear || '0')
                    ).length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches
                        .filter(batch => 
                          batch.branch === selectedBranch && 
                          batch.year === parseInt(selectedYear || '0')
                        )
                        .map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name} - Section {batch.section}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedBatchData && (
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">
                      {selectedBatchData.branch} - Year {selectedBatchData.year}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Batch:</span> {selectedBatchData.name}
                      </div>
                      <div>
                        <span className="font-medium">Section:</span> {selectedBatchData.section}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedBatchData && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Timetable for {selectedBatchData.branch} {selectedBatchData.year} Year - {selectedBatchData.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <Tabs defaultValue="grid-view">
                    <TabsList className="mb-4">
                      <TabsTrigger value="grid-view">Grid View</TabsTrigger>
                      <TabsTrigger value="day-view">Day View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="grid-view">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>Monday</TableHead>
                              <TableHead>Tuesday</TableHead>
                              <TableHead>Wednesday</TableHead>
                              <TableHead>Thursday</TableHead>
                              <TableHead>Friday</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Array.from({ length: 8 }).map((_, slotIndex) => {
                              const startHour = 8 + slotIndex;
                              const endHour = 9 + slotIndex;
                              const timeStr = `${startHour.toString().padStart(2, '0')}:00-${endHour.toString().padStart(2, '0')}:00`;
                              
                              return (
                                <TableRow key={timeStr}>
                                  <TableCell className="font-medium">{timeStr}</TableCell>
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                                    const daySchedule = scheduleData.find(schedule => schedule.day === day);
                                    const slot = daySchedule?.slots[slotIndex];
                                    
                                    return (
                                      <TableCell 
                                        key={`${day}-${slotIndex}`}
                                        className={`hover:bg-gray-50 ${user ? 'cursor-pointer' : ''} ${
                                          slot?.type === 'class' ? 'bg-blue-50' : 
                                          slot?.type === 'lab' ? 'bg-green-50' : ''
                                        }`}
                                        onClick={() => user && slot && handleEditSlot(day, slot)}
                                      >
                                        {slot ? (
                                          <div className="text-xs">
                                            <div className="font-medium">{slot.subject}</div>
                                            {slot.type !== 'free' && (
                                              <>
                                                {slot.teacher && <div>{slot.teacher}</div>}
                                                {slot.room && <div>Room: {slot.room}</div>}
                                              </>
                                            )}
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="day-view">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scheduleData.map((schedule) => (
                          <Card key={schedule.day}>
                            <CardHeader className="pb-2">
                              <CardTitle>{schedule.day}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {schedule.slots.length > 0 ? 
                                renderTimeSlots(schedule.day, schedule.slots) : 
                                <p className="text-gray-500">No classes scheduled</p>
                              }
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              {user && (
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    Click on any slot to edit the schedule. Changes will be saved automatically.
                  </p>
                </CardFooter>
              )}
            </Card>
          )}
        </>
      )}

      <Dialog open={isSlotDialogOpen} onOpenChange={setIsSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
            <DialogDescription>
              {editingDay && `Update this slot for ${editingDay}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Subject</label>
              <div className="col-span-3">
                <Select 
                  value={editedSlot.subject || ''}
                  onValueChange={(value) => setEditedSlot({ ...editedSlot, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free Period">Free Period</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name} {subject.code ? `(${subject.code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Teacher</label>
              <Input
                className="col-span-3"
                value={editedSlot.teacher || ''}
                onChange={(e) => setEditedSlot({ ...editedSlot, teacher: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Room</label>
              <Input
                className="col-span-3"
                value={editedSlot.room || ''}
                onChange={(e) => setEditedSlot({ ...editedSlot, room: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Type</label>
              <Select 
                value={editedSlot.type || 'class'} 
                onValueChange={(value) => setEditedSlot({ ...editedSlot, type: value as 'class' | 'lab' | 'free' })}
              >
                <SelectTrigger className="col-span-3">
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
            <Button onClick={handleSaveSlot}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
