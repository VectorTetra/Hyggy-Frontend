import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

export const customIcon = new L.Icon({
  iconUrl: "/images/marker-icon.png", // Використання локального шляху до картинки
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/images/marker-shadow.png", // Локальний шлях
  shadowSize: [41, 41],
});

const Map = ({ selectedShop, setSelectedShop, shops }) => {
  const [mapCenter, setMapCenter] = useState([shops[0]?.latitude || 48.482526, shops[0]?.longitude || 30.7233095]);
  const handleMarkerClick = (store) => {
    setSelectedShop(store);
  };

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ width: "100%", height: "100%" }} maxZoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {shops.map((shopp, index) => (
          <Marker
            key={index}
            position={[shopp.latitude, shopp.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(shopp),
            }}
          >
            <Popup>
              <div>
                <h3>{shopp.name}</h3>
                <p>{shopp?.city}, {shopp?.street}, {shopp?.houseNumber}, {shopp?.postalCode}</p>
                <Link style={{ color: "#00AAAD", textDecoration: "none" }} href={`/shop/${shopp.id}`}>
                  Деталі
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
