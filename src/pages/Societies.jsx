import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { useWeb3 } from '../providers/Web3Provider';
import contractService, { Society } from '../services/contractService';
import { Loader2, Plus, Users, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const Societies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account, signer, isConnected, chainId } = useWeb3();
  
  const [societies, setSocieties] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  
  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = 80001;
  
  // Initialize contract and load data
  useEffect(() => {
    const initializeAndLoad = async () => {
      if (isConnected && signer && chainId === MUMBAI_CHAIN_ID) {
        try {
          setIsLoading(true);
          
          // Initialize contract with signer
          await contractService.initializeContract(signer);
          
          // Check if user is admin
          if (account) {
            const adminStatus = await contractService.isAdmin(account);
            setIsAdmin(adminStatus);
          }
          
          // Load societies
          const allSocieties = await contractService.getAllSocieties();
          setSocieties(allSocieties);
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
  }, [isConnected, signer, account, chainId]);
  
  // Redirect to auth if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/wallet-auth');
    }
  }, [isConnected, navigate]);
  
  const handleCreateSociety = async (e.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Use a default image if none provided
      const finalImageURL = imageURL || 'https://via.placeholder.com/300?text=Society+Image';
      
      // Create society on blockchain
      const societyId = await contractService.createSociety(name, description);
      
      if (societyId !== null) {
        toast({
          title: 'Society Created',
          description: `Successfully created society "${name}"`,
        });
        
        // Refresh societies list
        const allSocieties = await contractService.getAllSocieties();
        setSocieties(allSocieties);
        
        // Reset form and close dialog
        setName('');
        setDescription('');
        setImageURL('');
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error creating society:', error);
      toast({
        title: 'Transaction Failed',
        description: 'Failed to create society. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const viewSocietyEvents = (societyId) => {
    navigate(`/events/${societyId}`);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading societies...</p>
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
            
              Please connect your wallet to view societies.
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
            
              Please switch to Polygon Mumbai Testnet to view societies.
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
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        
          <h1 className="text-3xl font-bold tracking-tight">Societies</h1>
          <p className="text-muted-foreground mt-1">
            Browse and join college societies on the blockchain
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              
                <Plus className="mr-2 h-4 w-4" />
                Create Society
              </Button>
            </DialogTrigger>
            
              
                Create New Society</DialogTitle>
                
                  Create a new society on the blockchain. This will require a transaction.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateSociety}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Society Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Computer Science Society"
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
                      placeholder="Describe the purpose and activities of this society..."
                      disabled={isCreating}
                      required
                      rows={4}
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
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use a default image
                    </p>
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
                      'Create Society'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {societies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No Societies Found</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            {isAdmin 
              ? "No societies have been created yet. Create the first one by clicking the 'Create Society' button above."
              "No societies have been created yet. Please check back later."}
          </p>
        </div>
      ) (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {societies.map((society, index) => (
            <Card key={index} className={society.isActive ? '' 'opacity-60'}>
              
                <div className="flex justify-between items-start">
                  
                    {society.name}</CardTitle>
                    
                      Created {format(new Date(society.createdAt * 1000), 'PPP')}
                    </CardDescription>
                  </div>
                  {!society.isActive && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md">
                      Inactive
                    </span>
                  )}
                </div>
              </CardHeader>
              
                <div className="aspect-video mb-4 overflow-hidden rounded-md bg-muted">
                  <img 
                    src={society.imageURI} 
                    alt={society.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Society+Image';
                    }}
                  />
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {society.description: }
                </p>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span className="truncate font-mono">
                    Created by{society.creator.substring(0, 6)}...{society.creator.substring(38)}
                  </span>
                  <a 
                    href={`https://mumbai.polygonscan.com/address/${society.creator}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
              
                <Button 
                  onClick={() => viewSocietyEvents(index)}
                  className="w-full"
                  disabled={!society.isActive}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Events
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Societies;
