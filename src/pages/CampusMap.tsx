import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp, MapPin, School, Home, Utensils, Building } from 'lucide-react';
import MapboxMap from '../components/MapboxMap';
import EnhancedThreeDMap from '../components/EnhancedThreeDMap';
import { supabase } from '../integrations/supabase/client';

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
  // Auto-load Mapbox token from env if available
  const envMapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const [mapboxToken, setMapboxToken] = useState<string>(envMapboxToken || '');
  const [mapType, setMapType] = useState('3d');
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="mx-auto max-w-7xl px-2 lg:px-6 py-8">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-thapar-maroon to-purple-700">Campus Map</h1>
      <p className="text-lg mb-8">Explore the campus with our interactive 3D map.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <Card className="mb-4 flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Map View</CardTitle>
              <CardDescription>Select your preferred map type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
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
                      className="w-full p-2 border rounded-md text-sm"
                      placeholder="Enter your Mapbox access token"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get a token at <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
                    </p>
                  </div>
                )}
                <TabsContent value="3d">
                  <div className="w-full h-[450px]">
                    <EnhancedThreeDMap 
                      onBuildingClick={handleBuildingClick}
                      selectedBuildingId={selectedBuildingId}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="mapbox">
                  {mapboxToken ? (
                    <div className="w-full h-[450px]">
                      <MapboxMap 
                        locations={locations}
                        accessToken={mapboxToken}
                        onMarkerClick={handleBuildingClick}
                        selectedLocationId={selectedBuildingId}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[450px] bg-gray-100 rounded-lg">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Please enter a Mapbox access token to view the map</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        {/* Directory Section */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Building Directory</CardTitle>
              <input
                type="text"
                placeholder="Search buildings..."
                className="mt-2 w-full border rounded-md px-2 py-1 text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search buildings"
              />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[500px] pr-2">
              <div className="space-y-2">
                {locations
                  .filter(location =>
                    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    location.type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(location => (
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
        {/* Legend Section */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="h-full flex flex-col">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default CampusMap;
