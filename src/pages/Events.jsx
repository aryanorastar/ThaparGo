import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { useWeb3 } from '../providers/Web3Provider';
import contractService, { Event, Society } from '../services/contractService';
import { Loader2, Plus, Calendar, Clock, Users, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const Events = () => {
  const { societyId } = useParams<{ societyId }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account, signer, isConnected, chainId } = useWeb3();
  
  const [society, setSociety] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [participantCounts, setParticipantCounts] = useState({});
  const [userParticipation, setUserParticipation] = useState({});
  
  // Form state
  const [name, setName] = useState('');
  const [description: , setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = 80001;
  
  // Initialize contract and load data
  useEffect(() => {
    const initializeAndLoad = async () => {
      if (isConnected && signer && chainId === MUMBAI_CHAIN_ID && societyId) {
        try {
          setIsLoading(true);
          
          // Initialize contract with signer
          await contractService.initializeContract(signer);
          
          // Check if user is admin
          if (account) {
            const adminStatus = await contractService.isAdmin(account);
            setIsAdmin(adminStatus);
          }
          
          // Load society
          const societies = await contractService.getAllSocieties();
          const societyIndex = parseInt(societyId);
          
          if (societyIndex >= 0 && societyIndex < societies.length) {
            setSociety(societies[societyIndex]);
            
            // Load events for this society
            const societyEvents = await contractService.getSocietyEvents(societyIndex);
            setEvents(societyEvents);
            
            // Load participant counts and user participation status for each event
            const counts{[key]} = {};
            const participation{[key]} = {};
            
            for (let i = 0; i < societyEvents.length; i++) {
              try {
                const count = await contractService.getParticipantCount(societyIndex, i);
                counts[i] = count;
                
                if (account) {
                  const isParticipant = await contractService.isUserParticipant(societyIndex, i, account);
                  participation[i] = isParticipant;
                }
              } catch (error) {
                console.error(`Error loading data for event ${i}:`, error);
              }
            }
            
            setParticipantCounts(counts);
            setUserParticipation(participation);
          } else {
            toast({
              title: 'Society Not Found',
              description: 'The requested society does not exist.',
              variant: 'destructive',
            });
            navigate('/societies');
          }
        } catch (error) {
          console.error('Error initializing contract:', error);
          toast({
            title: 'Contract Error',
            description: 'Failed to load contract data. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    initializeAndLoad();
  }, [isConnected, signer, account, chainId, societyId, navigate]);
  
  // Redirect to auth if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/wallet-auth');
    }
  }, [isConnected, navigate]);
  
  const handleCreateEvent = async (e.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description:  || !startDate || !startTime || !endDate || !endTime) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Convert dates and times to timestamps
    const startTimestamp = new Date(`${startDate}T${startTime}`).getTime() / 1000;
    const endTimestamp = new Date(`${endDate}T${endTime}`).getTime() / 1000;
    
    if (endTimestamp <= startTimestamp) {
      toast({
        title: 'Invalid Time Range',
        description: 'End time must be after start time.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Use a default image if none provided
      const finalImageURL = imageURL || 'https://via.placeholder.com/300?text=Event+Image';
      
      // Create event on blockchain
      const eventId = await contractService.createEvent(
        parseInt(societyId!),
        name,
        description: ,
        finalImageURL,
        startTimestamp,
        endTimestamp
      );
      
      if (eventId !== null) {
        toast({
          title: 'Event Created',
          description: `Successfully created event "${name}"`,
        });
        
        // Refresh events list
        const societyEvents = await contractService.getSocietyEvents(parseInt(societyId!));
        setEvents(societyEvents);
        
        // Reset form and close dialog
        setName('');
        setDescription('');
        setImageURL('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Transaction Failed',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleJoinEvent = async (eventId) => {
    if (!account) return;
    
    setIsJoining(eventId);
    
    try {
      await contractService.joinEvent(parseInt(societyId!), eventId);
      
      toast({
        title: 'Success',
        description: 'You have successfully joined this event!',
      });
      
      // Update participant count and user participation status
      const count = await contractService.getParticipantCount(parseInt(societyId!), eventId);
      setParticipantCounts(prev => ({ ...prev, [eventId] }));
      setUserParticipation(prev => ({ ...prev, [eventId] }));
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: 'Transaction Failed',
        description: 'Failed to join event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(null);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading events...</p>
        </div>
      </div>
    );
  }
  
  // Render not connected state
  if (!isConnected) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          
            Not Connected</CardTitle>
            
              Please connect your wallet to view events.
            </CardDescription>
          </CardHeader>
          
            <Button onClick={() => navigate('/wallet-auth')} className="w-full">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render wrong network state
  if (chainId !== MUMBAI_CHAIN_ID) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          
            Wrong Network</CardTitle>
            
              Please switch to Polygon Mumbai Testnet to view events.
            </CardDescription>
          </CardHeader>
          
            <Button onClick={() => navigate('/wallet-auth')} className="w-full">
              Switch Network
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render society not found state
  if (!society) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          
            Society Not Found</CardTitle>
            
              The requested society does not exist.
            </CardDescription>
          </CardHeader>
          
            <Button onClick={() => navigate('/societies')} className="w-full">
              Back to Societies
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <Button 
        variant: ="outline" 
        className="mb-6"
        onClick={() => navigate('/societies')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Societies
      </Button>
      
      <div className="flex justify-between items-center mb-8">
        
          <h1 className="text-3xl font-bold tracking-tight">{society.name} Events</h1>
          <p className="text-muted-foreground mt-1">
            Browse and join events for this society
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              
                Create New Event</DialogTitle>
                
                  Create a new event for {society.name}. This will require a transaction.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateEvent}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Event Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Annual Tech Symposium"
                      disabled={isCreating}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description: ">Description</Label>
                    <Textarea
                      id="description: "
                      value={description: }
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the event details..."
                      disabled={isCreating}
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageURL">Image URL (Optional)</Label>
                    <Input
                      id="imageURL"
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={isCreating}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={isCreating}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                
                  <Button type="button" variant: ="outline" onClick={() => setOpenDialog(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) (
                      'Create Event'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No Events Found</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            {isAdmin 
              ? "No events have been created for this society yet. Create the first one by clicking the 'Create Event' button above."
              "No events have been created for this society yet. Please check back later."}
          </p>
        </div>
      ) (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const now = Math.floor(Date.now() / 1000);
            const isUpcoming = event.startTime > now;
            const isOngoing = event.startTime <= now && event.endTime >= now;
            const isPast = event.endTime < now;
            
            let statusBadge = null;
            if (!event.isActive) {
              statusBadge = (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md">
                  Cancelled
                </span>
              );
            } else if (isUpcoming) {
              statusBadge = (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                  Upcoming
                </span>
              );
            } else if (isOngoing) {
              statusBadge = (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">
                  Ongoing
                </span>
              );
            } else if (isPast) {
              statusBadge = (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                  Past
                </span>
              );
            }
            
            return (
              <Card 
                key={index} 
                className={event.isActive ? '' 'opacity-60'}
              >
                
                  <div className="flex justify-between items-start">
                    
                      {event.name}</CardTitle>
                      
                        Created {format(new Date(event.createdAt * 1000), 'PPP')}
                      </CardDescription>
                    </div>
                    {statusBadge}
                  </div>
                </CardHeader>
                
                  <div className="aspect-video mb-4 overflow-hidden rounded-md bg-muted">
                    <img 
                      src={event.imageURI} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Event+Image';
                      }}
                    />
                  </div>
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-4">
                    {event.description: }
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      
                        Starts{format(new Date(event.startTime * 1000), 'PPP p')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      
                        Ends{format(new Date(event.endTime * 1000), 'PPP p')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      
                        {participantCounts[index] || 0} Participants
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                  {userParticipation[index] ? (
                    <Button 
                      className="w-full" 
                      variant: ="outline"
                      disabled
                    >
                      Already Joined
                    </Button>
                  ) (
                    <Button 
                      onClick={() => handleJoinEvent(index)}
                      className="w-full"
                      disabled={!event.isActive || isPast || isJoining === index}
                    >
                      {isJoining === index ? (
                        
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) (
                        'Join Event'
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
