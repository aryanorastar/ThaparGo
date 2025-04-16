
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin, School, Home, Utensils, Building } from 'lucide-react';
import MapboxMap from '@/components/MapboxMap';
import ThreeDMap from '@/components/ThreeDMap';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  coordinates: [number, number];
}

const CampusMap = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapType, setMapType] = useState('3d');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
        
        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }
        
        // Convert coordinates from array to tuple
        const formattedLocations = data.map(location => ({
          ...location,
          coordinates: location.coordinates as unknown as [number, number]
        }));
        
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleBuildingClick = (id: string) => {
    setSelectedBuildingId(id);
    setShowInfo(true);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleMapTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  const selectedBuilding = selectedBuildingId 
    ? locations.find(building => building.id === selectedBuildingId) 
    : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Academic':
        return <School className="h-5 w-5 text-blue-500" />;
      case 'Residence':
        return <Home className="h-5 w-5 text-green-500" />;
      case 'Dining':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      default:
        return <Building className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Campus Map</h1>
      <p className="text-lg mb-8">Explore the campus with our interactive 3D map.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Map View</CardTitle>
              <CardDescription>Select your preferred map type</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={mapType} onValueChange={setMapType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="3d">3D Model View</TabsTrigger>
                  <TabsTrigger value="mapbox">Mapbox View</TabsTrigger>
                </TabsList>
                
                {mapType === 'mapbox' && (
                  <div className="mb-4">
                    <label htmlFor="mapbox-token" className="block text-sm font-medium mb-1">
                      Mapbox Access Token
                    </label>
                    <input
                      id="mapbox-token"
                      type="text"
                      value={mapboxToken}
                      onChange={handleMapTokenChange}
                      placeholder="Enter your Mapbox access token"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Get a token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mapbox</a>
                    </p>
                  </div>
                )}
                
                <div className="h-[60vh] relative rounded-lg overflow-hidden">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : mapType === 'mapbox' ? (
                    mapboxToken ? (
                      <MapboxMap 
                        mapboxToken={mapboxToken}
                        onBuildingClick={handleBuildingClick}
                        selectedBuildingId={selectedBuildingId}
                        locations={locations}
                        center={[0, 0]}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center p-4">
                          <p className="text-lg font-medium mb-2">No Mapbox Token</p>
                          <p className="mb-4">Please enter your Mapbox access token above to view the map.</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <ThreeDMap 
                      onBuildingClick={handleBuildingClick}
                      selectedBuildingId={selectedBuildingId}
                    />
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="lg:hidden">
            <Button
              variant="outline"
              className="w-full mb-4 flex items-center justify-between"
              onClick={toggleInfo}
            >
              {showInfo ? 'Hide Building Info' : 'Show Building Info'}
              {showInfo ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className={`lg:block ${showInfo ? 'block' : 'hidden'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Building Information</CardTitle>
              <CardDescription>
                Click on a building in the map to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBuilding ? (
                <div>
                  <div className="flex items-center mb-4">
                    {getTypeIcon(selectedBuilding.type)}
                    <h3 className="text-xl font-semibold ml-2">{selectedBuilding.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p>{selectedBuilding.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p>{selectedBuilding.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Coordinates</p>
                      <p>X: {selectedBuilding.coordinates[0]}, Y: {selectedBuilding.coordinates[1]}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a building on the map to view information</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Building Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {locations.map(location => (
                  <div
                    key={location.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedBuildingId === location.id
                        ? 'bg-blue-100 border-l-4 border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleBuildingClick(location.id)}
                  >
                    <div className="flex items-center">
                      {getTypeIcon(location.type)}
                      <span className="ml-2 font-medium">{location.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-7">
                      {location.type}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center cursor-pointer">
                <CardTitle>Campus Map Legend</CardTitle>
                <ChevronDown className="h-5 w-5" />
              </div>
            </CollapsibleTrigger>
            <CardDescription>
              Understanding different building types and markers
            </CardDescription>
            
            <CollapsibleContent className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                    A
                  </div>
                  <span>Academic Buildings</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
                    R
                  </div>
                  <span>Residence Halls</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
                    D
                  </div>
                  <span>Dining Facilities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white mr-2">
                    F
                  </div>
                  <span>Other Facilities</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Navigation Tips:</span> Click on any building to view detailed information. Use mouse to rotate, zoom, and pan around the campus map.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CampusMap;
