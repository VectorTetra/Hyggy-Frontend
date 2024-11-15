

import React, { useEffect } from 'react'
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі Leaflet
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getShops, useShops } from '@/pages/api/ShopApi';

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
  id: number;
  photoUrl: string,
  name: string;
  street: string;
  houseNumber: string;
  addressId: number,
  storageId: number,
  orderIds: number[],
  shopEmployeeIds: number[],
  postalCode: string;
  city: string;
  state: string;
  workHours: string;
  latitude: number;
  longitude: number;
  executedOrdersSum: number;
};

export
  const Map = () => {

    //const [places, setPlaces] = useState<Place[]>([]);
    const { data: places = [] } = useShops({ SearchParameter: "Query", PageNumber: 1, PageSize: 150 });
    // useEffect(() => {
    //   const fetchShops = async () => {
    //     try {
    //       const data = await getShops({
    //         SearchParameter: "Query",
    //         PageNumber: 1,
    //         PageSize: 150
    //       }); // Передай параметри, якщо необхідно
    //       setPlaces(data);
    //       console.log(data);
    //     } catch (error) {
    //       console.error('Error fetching shops:', error);
    //     }
    //   };

    //   fetchShops();
    // }, []);

    // const [position, setPosition] = useState({
    //   lat: places[0].latitude,
    //   lon: places[0].longitude,
    // });

    const router = useRouter();
    const handleMarkerClick = (place: Place) => {
      console.log(place.photoUrl);
      sessionStorage.setItem('shop', JSON.stringify(place));
      router.push('/shop');
    }
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);
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
      </MapContainer>
    )
  }

export default Map