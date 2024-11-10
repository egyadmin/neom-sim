import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLng, Icon, DivIcon } from 'leaflet';
import { X, Loader2, MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pulseIcon = new DivIcon({
  className: 'pulse-icon',
  html: '<div class="pulse-dot"></div><div class="pulse-ring"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

interface LocationPickerProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (location: LatLng) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

function CurrentLocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={pulseIcon} />
  );
}

function SearchControl({ onSearch }: { onSearch: (query: string) => Promise<void> }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      await onSearch(query);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 left-4 z-[1000]">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="ابحث عن موقع..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          بحث
        </button>
      </div>
    </div>
  );
}

export function LocationPicker({ onSelect, onClose }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const handleLocationSelect = async (location: LatLng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json&accept-language=ar`
      );
      const data = await response.json();
      
      setSelectedLocation({
        lat: location.lat,
        lng: location.lng,
        address: data.display_name || 'العنوان غير متوفر',
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      setSelectedLocation({
        lat: location.lat,
        lng: location.lng,
        address: 'العنوان غير متوفر',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!map) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&accept-language=ar`
      );
      const data = await response.json();

      if (data && data[0]) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 16);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleCurrentLocation = () => {
    if (!map) return;
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">تحديد الموقع</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[400px] relative">
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={8}
            className="w-full h-full"
            whenCreated={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
            <CurrentLocationMarker />
            <SearchControl onSearch={handleSearch} />
          </MapContainer>

          <button
            onClick={handleCurrentLocation}
            className="absolute bottom-4 right-4 z-[1000] px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <MapPin className="w-5 h-5" />
            موقعي الحالي
          </button>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          {selectedLocation && (
            <p className="mb-4 text-sm text-gray-600">
              العنوان المحدد: {selectedLocation.address}
            </p>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => selectedLocation && onSelect(selectedLocation)}
              disabled={!selectedLocation}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تأكيد الموقع
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}