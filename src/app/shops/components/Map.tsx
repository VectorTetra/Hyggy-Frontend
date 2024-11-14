import React, { useEffect } from 'react'
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі Leaflet
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Place } from '../page';
// // Налаштування іконок для маркерів
export const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});


export const Map = ({ places }: { places: Place[] }) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
  const router = useRouter();
  const handleMarkerClick = (place: Place) => {
    sessionStorage.setItem('shop', JSON.stringify(place));

    router.push('/shop');
  }
  useEffect(() => {
    if (places.length === 1) {
      handleMarkerClick(places[0]);
    }
  }, [places.length])
  return (
    <MapContainer
      center={[50.4546600, 30.5238000]} // Центр карти
      zoom={5.5}
      style={{ width: "100%", height: "100%" }} // Розмір контейнера для карти
      maxZoom={18}
    >
      {/* Використання OpenStreetMap як джерела тайлів */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Маркери для всіх місць */}
      {places &&
        <MarkerClusterGroup>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={[place.latitude, place.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(place)
              }}
            >
              {/* Інфо-вікно для вибраного місця */}
              {selectedPlace && selectedPlace.name === place.name && (
                <Popup
                  position={[place.latitude, place.longitude]}
                  eventHandlers={{
                    popupclose: () => setSelectedPlace(undefined), // Закриття вікна
                  }}
                >
                </Popup>
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
      }
    </MapContainer>
  )
}

export default Map