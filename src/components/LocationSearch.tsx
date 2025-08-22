import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation, MapPin, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface LocationSearchProps {
  onGetDirections: (start: Location, end: Location) => void;
  isLoading: boolean;
  onClear: () => void;
}

// Mock geocoding function - in real app, this would use MapMyIndia API
const mockGeocode = async (query: string): Promise<Location | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for common Indian cities
  const mockPlaces: Record<string, Location> = {
    "delhi": { lat: 28.6139, lng: 77.2090, name: "New Delhi, India" },
    "mumbai": { lat: 19.0760, lng: 72.8777, name: "Mumbai, Maharashtra" },
    "bangalore": { lat: 12.9716, lng: 77.5946, name: "Bangalore, Karnataka" },
    "chennai": { lat: 13.0827, lng: 80.2707, name: "Chennai, Tamil Nadu" },
    "kolkata": { lat: 22.5726, lng: 88.3639, name: "Kolkata, West Bengal" },
    "hyderabad": { lat: 17.3850, lng: 78.4867, name: "Hyderabad, Telangana" },
    "pune": { lat: 18.5204, lng: 73.8567, name: "Pune, Maharashtra" },
    "ahmedabad": { lat: 23.0225, lng: 72.5714, name: "Ahmedabad, Gujarat" },
  };
  
  const lowerQuery = query.toLowerCase();
  const match = Object.keys(mockPlaces).find(key => 
    lowerQuery.includes(key) || key.includes(lowerQuery)
  );
  
  if (match) {
    return mockPlaces[match];
  }
  
  // Return a random location in India for unknown places
  return {
    lat: 20 + Math.random() * 15, // Roughly between 20-35°N (India's latitude range)
    lng: 70 + Math.random() * 25, // Roughly between 70-95°E (India's longitude range)
    name: query
  };
};

export const LocationSearch = ({ onGetDirections, isLoading, onClear }: LocationSearchProps) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { toast } = useToast();

  const handleGetDirections = async () => {
    if (!startInput.trim() || !endInput.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and end locations.",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    
    try {
      const [startLocation, endLocation] = await Promise.all([
        mockGeocode(startInput.trim()),
        mockGeocode(endInput.trim())
      ]);

      if (startLocation && endLocation) {
        onGetDirections(startLocation, endLocation);
        toast({
          title: "Route Found",
          description: "Calculating the best route for you.",
        });
      } else {
        toast({
          title: "Location Error",
          description: "Could not find one or both locations. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get directions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleClear = () => {
    setStartInput("");
    setEndInput("");
    onClear();
    toast({
      title: "Cleared",
      description: "Route cleared successfully.",
    });
  };

  const isProcessing = isLoading || isGeocoding;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Get Directions</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start" className="text-sm font-medium">
            From
          </Label>
          <Input
            id="start"
            placeholder="Enter starting location..."
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            disabled={isProcessing}
            className="bg-input/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end" className="text-sm font-medium">
            To
          </Label>
          <Input
            id="end"
            placeholder="Enter destination..."
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
            disabled={isProcessing}
            className="bg-input/50"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleGetDirections}
          disabled={!startInput.trim() || !endInput.trim() || isProcessing}
          className="flex-1 bg-gradient-primary glow-primary"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isGeocoding ? "Finding Locations..." : "Getting Route..."}
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Get Directions
            </>
          )}
        </Button>

        {(startInput || endInput) && (
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={isProcessing}
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        <p>💡 Try popular cities: Delhi, Mumbai, Bangalore, Chennai</p>
      </div>
    </div>
  );
};