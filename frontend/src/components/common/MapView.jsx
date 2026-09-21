import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom stylish SVG DivIcons so Leaflet never suffers from broken default icon URLs
const createCustomIcon = (emoji, bgColor = '#ff5238') => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: ${bgColor};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

const restaurantIcon = createCustomIcon('🏬', '#ff5238');
const customerIcon = createCustomIcon('🏠', '#3b82f6');
const riderIcon = createCustomIcon('🛵', '#10b981');

// Helper to auto-fit map view bounds around all active coordinates
const MapBoundsAdjuster = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
};

export const MapView = ({
  restaurantCoords = [12.9719, 77.6412],
  customerCoords = [12.9784, 77.6408],
  riderCoords = [12.9745, 77.6410],
  restaurantName = 'Restaurant',
  customerAddress = 'Customer Destination',
  height = '320px',
  showRider = true
}) => {
  // Collect coordinates for route line
  const routePoints = showRider
    ? [restaurantCoords, riderCoords, customerCoords]
    : [restaurantCoords, customerCoords];

  const bounds = [restaurantCoords, customerCoords];

  return (
    <div style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={riderCoords || restaurantCoords}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Restaurant Pin */}
        <Marker position={restaurantCoords} icon={restaurantIcon}>
          <Popup>
            <div style={{ color: '#111827', fontWeight: 'bold' }}>
              🏬 {restaurantName}
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Pickup Point</div>
            </div>
          </Popup>
        </Marker>

        {/* Customer Pin */}
        <Marker position={customerCoords} icon={customerIcon}>
          <Popup>
            <div style={{ color: '#111827', fontWeight: 'bold' }}>
              🏠 Drop-off Location
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{customerAddress}</div>
            </div>
          </Popup>
        </Marker>

        {/* Delivery Rider Pin */}
        {showRider && (
          <Marker position={riderCoords} icon={riderIcon}>
            <Popup>
              <div style={{ color: '#111827', fontWeight: 'bold' }}>
                🛵 Delivery Partner On Route
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: '#ff5238',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.85
          }}
        />

        <MapBoundsAdjuster bounds={bounds} />
      </MapContainer>
    </div>
  );
};
