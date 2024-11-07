import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Map = ({ selectedStore, setSelectedStore, stores }) => {
  const [mapCenter, setMapCenter] = useState([stores[0]?.latitude || 48.482526, stores[0]?.longitude || 30.7233095]);

  const MapViewUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedStore) {
        map.flyTo([selectedStore.latitude, selectedStore.longitude], 17);
      }
    }, [selectedStore, map]);

    return null;
  };

  const handleMarkerClick = (store) => {
    setSelectedStore(store);
  };

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {stores.map((store, index) => (
          <Marker
            key={index}
            position={[store.latitude, store.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(store),
            }}
          >
            <Popup>{store.name}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      <MapViewUpdater />
    </MapContainer>
  );
};

export default Map;
