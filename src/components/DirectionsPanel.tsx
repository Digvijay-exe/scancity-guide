import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Route, ArrowRight, Navigation2 } from "lucide-react";

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
}

interface DirectionsPanelProps {
  routeData: RouteData;
  startLocation: Location | null;
  endLocation: Location | null;
}

export const DirectionsPanel = ({ routeData, startLocation, endLocation }: DirectionsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Route Summary */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Route className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Route Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{routeData.distance}</div>
            <div className="text-sm text-muted-foreground">Total Distance</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-secondary">{routeData.duration}</div>
            <div className="text-sm text-muted-foreground">Est. Time</div>
          </div>
        </div>

        {/* Route Path */}
        <div className="flex items-center gap-2 text-sm bg-background/50 rounded-lg p-3">
          <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="truncate flex-1">{startLocation?.name}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="truncate flex-1">{endLocation?.name}</span>
        </div>
      </div>

      {/* Turn-by-Turn Directions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Navigation2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Turn-by-Turn Directions</h3>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {routeData.steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-1">{step.instruction}</div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {step.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tips */}
      <Card className="bg-gradient-accent/10 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Navigation2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium mb-1">Navigation Tips</div>
              <ul className="text-muted-foreground space-y-1">
                <li>• Check traffic conditions before starting</li>
                <li>• Keep your phone charged for GPS</li>
                <li>• Have backup routes ready</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};