import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route, Zap, Shield, Leaf, Cloud, Navigation, Star, Clock, Car } from "lucide-react";

interface RouteOption {
  id: string;
  distance_km: number;
  travel_time: number;
  safety_score: number;
  weather_risk: number;
  co2: number;
  traffic_level: number;
  deterministic_score: number;
}

export const ScanInterface = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [preference, setPreference] = useState<"FASTEST" | "SAFEST" | "ECO">("FASTEST");
  const [isSearching, setIsSearching] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [weather, setWeather] = useState({ desc: "Clear", temp: 22, risk: 0.1 });

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call with mock data
    setTimeout(() => {
      setRoutes([
        {
          id: "1",
          distance_km: 12.5,
          travel_time: 28,
          safety_score: 85,
          weather_risk: 0.1,
          co2: 2.6,
          traffic_level: 0.3,
          deterministic_score: 82
        },
        {
          id: "2", 
          distance_km: 15.2,
          travel_time: 25,
          safety_score: 78,
          weather_risk: 0.1,
          co2: 3.2,
          traffic_level: 0.2,
          deterministic_score: 75
        },
        {
          id: "3",
          distance_km: 11.8,
          travel_time: 32,
          safety_score: 92,
          weather_risk: 0.1,
          co2: 2.5,
          traffic_level: 0.4,
          deterministic_score: 88
        }
      ]);
      setIsSearching(false);
    }, 2000);
  };

  const getPreferenceIcon = (pref: string) => {
    switch (pref) {
      case "FASTEST": return <Zap className="w-4 h-4" />;
      case "SAFEST": return <Shield className="w-4 h-4" />;
      case "ECO": return <Leaf className="w-4 h-4" />;
      default: return <Route className="w-4 h-4" />;
    }
  };

  const getPreferenceColor = (pref: string) => {
    switch (pref) {
      case "FASTEST": return "bg-gradient-primary";
      case "SAFEST": return "bg-gradient-secondary";
      case "ECO": return "bg-gradient-accent";
      default: return "bg-gradient-primary";
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "destructive";
  };

  const bestRoute = routes.length > 0 ? routes.reduce((best, current) => 
    current.deterministic_score > best.deterministic_score ? current : best
  ) : null;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-primary glow-primary animate-pulse-glow">
            <Navigation className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SCAN
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Smart City Assistant & Navigation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered route planning with real-time safety scoring, weather integration, and intelligent recommendations for smart city navigation.
        </p>
      </div>

      {/* Search Interface */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Plan Your Journey
          </CardTitle>
          <CardDescription>
            Enter your start and end locations to get AI-optimized route recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Location</label>
              <Input
                placeholder="Enter starting point..."
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input
                placeholder="Enter destination..."
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="bg-input/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Route Preference</label>
            <div className="flex gap-3">
              {(["FASTEST", "SAFEST", "ECO"] as const).map((pref) => (
                <Button
                  key={pref}
                  variant={preference === pref ? "default" : "outline"}
                  onClick={() => setPreference(pref)}
                  className={preference === pref ? getPreferenceColor(pref) : ""}
                >
                  {getPreferenceIcon(pref)}
                  {pref}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!startLocation || !endLocation || isSearching}
            className="w-full bg-gradient-primary glow-primary"
            size="lg"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Analyzing Routes...
              </>
            ) : (
              <>
                <Route className="w-4 h-4" />
                Find Smart Routes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Weather Card */}
      {startLocation && endLocation && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Destination Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">{weather.temp}°C</div>
                <div>
                  <div className="font-medium capitalize">{weather.desc}</div>
                  <div className="text-sm text-muted-foreground">Updated 5 min ago</div>
                </div>
              </div>
              <Badge variant={weather.risk > 0.5 ? "warning" : "success"}>
                Risk: {(weather.risk * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Routes Results */}
      {routes.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Route Options</h3>
            <p className="text-muted-foreground">
              AI-analyzed routes optimized for your {preference.toLowerCase()} preference
            </p>
          </div>

          {/* Best Route Highlight */}
          {bestRoute && (
            <Card className="border-primary glow-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  AI Recommended Route
                  <Badge variant="ai">BEST MATCH</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{Math.round(bestRoute.travel_time)}</div>
                    <div className="text-sm text-muted-foreground">minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{bestRoute.safety_score}</div>
                    <div className="text-sm text-muted-foreground">safety score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{bestRoute.distance_km}</div>
                    <div className="text-sm text-muted-foreground">km</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{bestRoute.deterministic_score}</div>
                    <div className="text-sm text-muted-foreground">overall score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Routes */}
          <div className="grid gap-4">
            {routes.map((route) => (
              <Card key={route.id} className={route === bestRoute ? "opacity-75" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gradient-primary">
                        <Car className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">Route {route.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {route.distance_km} km • {Math.round(route.travel_time)} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSafetyColor(route.safety_score)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {route.safety_score}/100
                      </Badge>
                      <Badge variant="outline">
                        Score: {route.deterministic_score}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Traffic: {Math.round(route.traffic_level * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-muted-foreground" />
                      <span>CO₂: {route.co2}kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-muted-foreground" />
                      <span>Weather Risk: {Math.round(route.weather_risk * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};