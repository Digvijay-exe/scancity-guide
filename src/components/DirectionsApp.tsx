import { useState, useCallback } from "react";
import { MapComponent } from "./MapComponent";
import { LocationSearch } from "./LocationSearch";
import { DirectionsPanel } from "./DirectionsPanel";
import { Card } from "@/components/ui/card";
import { Navigation, MapPin } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface RouteData {
  distance: string;
  duration: string;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
  coordinates: Array<[number, number]>;
}

export const DirectionsApp = () => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const handleGetDirections = useCallback(async (start: Location, end: Location) => {
    setIsLoadingRoute(true);
    setStartLocation(start);
    setEndLocation(end);

    // Mock route data - in real implementation, this would call MapMyIndia API
    setTimeout(() => {
      const mockRoute: RouteData = {
        distance: "24.5 km",
        duration: "32 min",
        steps: [
          { instruction: "Head north on Main Street", distance: "0.5 km", duration: "2 min" },
          { instruction: "Turn right onto Highway 1", distance: "15.2 km", duration: "18 min" },
          { instruction: "Take exit 45 toward City Center", distance: "2.3 km", duration: "3 min" },
          { instruction: "Continue straight on Central Avenue", distance: "4.8 km", duration: "6 min" },
          { instruction: "Turn left onto Destination Road", distance: "1.2 km", duration: "2 min" },
          { instruction: "Arrive at your destination", distance: "0.5 km", duration: "1 min" }
        ],
        coordinates: [
          [start.lat, start.lng],
          [start.lat + 0.01, start.lng + 0.01],
          [start.lat + 0.02, start.lng + 0.02],
          [end.lat - 0.01, end.lng - 0.01],
          [end.lat, end.lng]
        ]
      };
      
      setRouteData(mockRoute);
      setIsLoadingRoute(false);
    }, 1500);
  }, []);

  const clearRoute = useCallback(() => {
    setStartLocation(null);
    setEndLocation(null);
    setRouteData(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-primary glow-primary">
              <Navigation className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                India Directions
              </h1>
              <p className="text-sm text-muted-foreground">
                Get driving directions anywhere in India
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Search and Directions Panel */}
          <div className="space-y-4 overflow-auto">
            <Card className="p-4">
              <LocationSearch 
                onGetDirections={handleGetDirections}
                isLoading={isLoadingRoute}
                onClear={clearRoute}
              />
            </Card>

            {routeData && (
              <Card className="p-4">
                <DirectionsPanel 
                  routeData={routeData}
                  startLocation={startLocation}
                  endLocation={endLocation}
                />
              </Card>
            )}

            {!routeData && !isLoadingRoute && (
              <Card className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Ready to Navigate</h3>
                <p className="text-muted-foreground">
                  Enter your starting location and destination to get turn-by-turn directions.
                </p>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-full overflow-hidden">
              <MapComponent
                startLocation={startLocation}
                endLocation={endLocation}
                routeCoordinates={routeData?.coordinates}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};