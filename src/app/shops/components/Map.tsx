

import React from 'react'
import { useState } from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі Leaflet
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// // Налаштування іконок для маркерів
export const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});
export type Place = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  workHours: string[];
  latitude: number;
  longitude: number;
};
const Map = () => {

  const [places, setPlaces] = useState<Place[]>([
    {
      name: "Hyggy Odessa",
      address: "вул. Харківська 2/2",
      postalCode: "40024",
      city: "Odessa",
      phoneNumber: " +380442470786",
      workHours: ["10:00 - 20:00", "10:00 - 20:00"],
      latitude: 46.482526, 
      longitude: 30.7233095,
    },
    {
      name: "Hyggy Odessa",
      address: "вул. Харківська 2/2",
      postalCode: "40024",
      city: "Odessa",
      phoneNumber: " +380442470786",
      workHours: ["10:00 - 20:00", "10:00 - 20:00"],
      latitude: 46.482526, 
      longitude: 30.8233095,
    },
    {
      name: "Hyggy Mykolaiv",
      address: "вул. Харківська 2/2",
      postalCode: "40024",
      city: "Odessa",
      phoneNumber: " +380442470786",
      workHours: ["10:00 - 20:00", "10:00 - 20:00"],
      latitude: 46.96591, 
      longitude: 31.9974
    },
    {
      name: "Hyggy Kharkiv",
      address: "вул. Харківська 2/2",
      postalCode: "40024",
      city: "Odessa",
      phoneNumber: " +380442470786",
      workHours: ["10:00 - 20:00", "10:00 - 20:00"],
      latitude: 49.988358, 
      longitude: 36.232845
    },
  ]);
      const [position, setPosition] = useState({
        lat: places[0].latitude,
        lon: places[0].longitude,
      });
      const router = useRouter();
      const handleMarkerClick = (place:Place) =>{
       sessionStorage.setItem('shop', JSON.stringify(place));

       router.push('/shop');
      }
      const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
  return (
    <MapContainer
      center={[position.lat, position.lon]} // Центр карти
      zoom={5.5}
      style={{ width: "100%", height: "100%" }} // Розмір контейнера для карти
    >
      {/* Використання OpenStreetMap як джерела тайлів */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Маркери для всіх місць */}
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
          Інфо-вікно для вибраного місця
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
    </MapContainer>
  )
}

export default Map