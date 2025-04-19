import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { useWeb3 } from '../providers/Web3Provider';
import contractService, { Society } from '../services/contractService';
import { Loader2, Plus, Users, Calendar, ExternalLink, Search } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Define categories for societies
const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Literary',
  'Social',
  'Professional',
  'Academic'
];

// Extended Society type with additional fields from Societies Hub
interface ExtendedSociety extends Society {
  id?: string;
  category?: string;
  members?: number;
  establishedYear?: number;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  isBlockchain: boolean;
}

const SocietiesHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { account, signer, isConnected, chainId } = useWeb3();
  
  const [societies, setSocieties] = useState<ExtendedSociety[]>([]);
  const [filteredSocieties, setFilteredSocieties] = useState<ExtendedSociety[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Mumbai Testnet Chain ID
  const MUMBAI_CHAIN_ID = 80001;
  
  // Mock data for societies from Thapar Societies Hub
  const mockSocietiesHubData = [
    {
      id: 'saturnalia',
      name: 'Saturnalia',
      description: 'The annual cultural fest of Thapar Institute of Engineering and Technology.',
      imageURI: 'https://media.licdn.com/dms/image/C4D0BAQHvxzKF6v_Rvw/company-logo_200_200/0/1630649937281/saturnalia_tiet_logo?e=2147483647&v=beta&t=Ww_ixeWFKyEV-5e_YoEzNzKBRX8GWvghd_TJeHvZ_QY',
      creator: '0x0000000000000000000000000000000000000000',
      isActive: true,
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 365, // 1 year ago
      category: 'Cultural',
      members: 120,
      establishedYear: 1998,
      socialLinks: {
        instagram: 'https://www.instagram.com/saturnalia_tiet/',
        linkedin: 'https://www.linkedin.com/company/saturnalia-tiet/',
        website: 'https://saturnalia.in/'
      },
      isBlockchain: false
    },
    {
      id: 'creative-computing-society',
      name: 'Creative Computing Society',
      description: 'CCS is a student-run organization that aims to foster a community of tech enthusiasts and innovators.',
      imageURI: 'https://media.licdn.com/dms/image/C560BAQHaaqJnwr1Vdw/company-logo_200_200/0/1630999581718/creative_computing_society_tiet_logo?e=2147483647&v=beta&t=Iq0uPBTuDTqKH5dKgGQYGgH_3ZQjO2HaXvGgWKQgGQs',
      creator: '0x0000000000000000000000000000000000000000',
      isActive: true,
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 730, // 2 years ago
      category: 'Technical',
      members: 85,
      establishedYear: 2010,
      socialLinks: {
        instagram: 'https://www.instagram.com/ccs_tiet/',
        linkedin: 'https://www.linkedin.com/company/creative-computing-society/',
        website: 'https://ccs-tiet.github.io/'
      },
      isBlockchain: false
    },
    {
      id: 'microsoft-learn-student-chapter',
      name: 'Microsoft Learn Student Chapter',
      description: 'MLSC is a technical society that aims to create a community of student developers and tech enthusiasts.',
      imageURI: 'https://media.licdn.com/dms/image/C4D0BAQGi3Ug8sRnWYg/company-logo_200_200/0/1630642829631/microsoft_learn_student_chapter_tiet_logo?e=2147483647&v=beta&t=lDfZlEJZvOQVOYQQE1t9yCnkCPqRXyGCV-LNgaQQh_c',
      creator: '0x0000000000000000000000000000000000000000',
      isActive: true,
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 500, // ~1.5 years ago
      category: 'Technical',
      members: 70,
      establishedYear: 2015,
      socialLinks: {
        instagram: 'https://www.instagram.com/mlsc_tiet/',
        linkedin: 'https://www.linkedin.com/company/microsoft-learn-student-chapter-tiet/',
        website: 'https://mlsctiet.co.in/'
      },
      isBlockchain: false
    }
  ];
  
  // Initialize contract and load data
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setIsLoading(true);
        
        // Start with mock data from Thapar Societies Hub
        let allSocieties: ExtendedSociety[] = [...mockSocietiesHubData];
        
        // If connected to Web3, add blockchain societies
        if (isConnected && signer && chainId === MUMBAI_CHAIN_ID) {
          try {
            // Initialize contract with signer
            await contractService.initializeContract(signer);
            
            // Load societies from blockchain
            const blockchainSocieties = await contractService.getAllSocieties();
            
            // Mark these societies as blockchain-based and add to the list
            const extendedBlockchainSocieties: ExtendedSociety[] = blockchainSocieties.map(society => ({
              ...society,
              category: 'Web3',
              isBlockchain: true
            }));
            
            allSocieties = [...allSocieties, ...extendedBlockchainSocieties];
          } catch (error) {
            console.error('Error loading blockchain societies:', error);
            // Continue with just the mock data
          }
        }
        
        setSocieties(allSocieties);
        setFilteredSocieties(allSocieties);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load societies. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAndLoad();
  }, [isConnected, signer, chainId, toast]);
  
  // Filter societies based on search query and category
  useEffect(() => {
    let filtered = [...societies];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(society => 
        society.name.toLowerCase().includes(query) || 
        society.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'blockchain') {
        filtered = filtered.filter(society => society.isBlockchain);
      } else {
        filtered = filtered.filter(society => society.category === activeCategory);
      }
    }
    
    setFilteredSocieties(filtered);
  }, [searchQuery, activeCategory, societies]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleViewSociety = (societyId: string, isBlockchain: boolean) => {
    if (isBlockchain) {
      // For blockchain societies, use the existing route
      const index = societies.findIndex(s => s.isBlockchain && s.id === societyId);
      if (index !== -1) {
        navigate(`/events/${index}`);
      }
    } else {
      // For regular societies, we could navigate to a detail page
      navigate(`/societies-hub/${societyId}`);
      // For now, just show a toast since we haven't implemented the detail page
      toast({
        title: 'Coming Soon',
        description: 'Detailed view for traditional societies will be available soon.',
      });
    }
  };
  
  const handleCreateSociety = () => {
    // Navigate to the blockchain societies page to create a new society
    navigate('/societies');
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
  
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Thapar Societies Hub</h1>
          <p className="text-muted-foreground">
            Discover and join student societies at Thapar University
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search societies..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button onClick={handleCreateSociety} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Create Society
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex flex-wrap h-auto mb-6">
            <TabsTrigger 
              value="all" 
              onClick={() => handleCategoryChange('all')}
              className={activeCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </TabsTrigger>
            {CATEGORIES.map(category => (
              <TabsTrigger 
                key={category} 
                value={category.toLowerCase()} 
                onClick={() => handleCategoryChange(category)}
                className={activeCategory === category ? 'bg-primary text-primary-foreground' : ''}
              >
                {category}
              </TabsTrigger>
            ))}
            <TabsTrigger 
              value="blockchain" 
              onClick={() => handleCategoryChange('blockchain')}
              className={activeCategory === 'blockchain' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 mr-1">Web3</Badge>
              Blockchain
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSocieties.length > 0 ? (
                filteredSocieties.map((society, index) => (
                  <Card key={society.id || index} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={society.imageURI} 
                        alt={society.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Society+Image';
                        }}
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{society.name}</CardTitle>
                        {society.isBlockchain && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                            Web3
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {society.category || 'General'} • {society.establishedYear ? `Est. ${society.establishedYear}` : 'New Society'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {society.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{society.members || 'Unknown'} members</span>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleViewSociety(society.id || index.toString(), society.isBlockchain)}
                      >
                        View Society
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold">No Societies Found</h2>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    No societies match your search criteria. Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* We only need one TabsContent since we're handling filtering in the component state */}
          {[...CATEGORIES, 'blockchain'].map(category => (
            <TabsContent key={category} value={category.toLowerCase()} className="mt-0">
              {/* Content is the same as "all" since filtering is handled in state */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SocietiesHub;
