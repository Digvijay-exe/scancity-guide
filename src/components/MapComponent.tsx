import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const createCustomIcon = (color: string) => new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div class="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center" 
         style="background-color: ${color};">
      <div class="w-2 h-2 rounded-full bg-white"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const startIcon = createCustomIcon('#22c55e'); // green
const endIcon = createCustomIcon('#ef4444'); // red

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface MapComponentProps {
  startLocation: Location | null;
  endLocation: Location | null;
  routeCoordinates?: Array<[number, number]>;
}

const MapController = ({ startLocation, endLocation, routeCoordinates }: MapComponentProps) => {
  const map = useMap();

  useEffect(() => {
    if (startLocation && endLocation) {
      const group = new L.FeatureGroup([
        L.marker([startLocation.lat, startLocation.lng]),
        L.marker([endLocation.lat, endLocation.lng])
      ]);
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else if (startLocation) {
      map.setView([startLocation.lat, startLocation.lng], 13);
    } else if (endLocation) {
      map.setView([endLocation.lat, endLocation.lng], 13);
    }
  }, [map, startLocation, endLocation]);

  return null;
};

export const MapComponent = ({ startLocation, endLocation, routeCoordinates }: MapComponentProps) => {
  // Default center on India
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController
          startLocation={startLocation}
          endLocation={endLocation}
          routeCoordinates={routeCoordinates}
        />

        {startLocation && (
          <Marker
            position={[startLocation.lat, startLocation.lng]}
            icon={startIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-green-600">Start</div>
                <div className="text-sm">{startLocation.name}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {endLocation && (
          <Marker
            position={[endLocation.lat, endLocation.lng]}
            icon={endIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-red-600">Destination</div>
                <div className="text-sm">{endLocation.name}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates as Array<[number, number]>}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        India Map Data
      </div>
    </div>
  );
};