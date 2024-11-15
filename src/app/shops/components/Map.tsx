import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Стилі Leaflet
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { useShops } from "@/pages/api/ShopApi";

// Іконка для маркерів
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
  photoUrl: string;
  name: string;
  street: string;
  houseNumber: string;
  addressId: number;
  storageId: number;
  orderIds: number[];
  shopEmployeeIds: number[];
  postalCode: string;
  city: string;
  state: string;
  workHours: string;
  latitude: number;
  longitude: number;
  executedOrdersSum: number;
};

export const Map = ({ places }) => {
  const router = useRouter();
  // const { data: places = [] } = useShops({
  //   SearchParameter: "Query",
  //   PageNumber: 1,
  //   PageSize: 150,
  // });
  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined);

  const handleMarkerClick = (place: Place) => {
    console.log(place.photoUrl);
    sessionStorage.setItem("shop", JSON.stringify(place));
    router.push("/shop");
  };

  return (
    <MapContainer
      center={[50.45466, 30.5238]} // Центр карти
      zoom={5.5}
      style={{ width: "100%", height: "100%" }} // Розмір контейнера
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {places.length > 0 && (
        <MarkerClusterGroup>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={[place.latitude, place.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedPlace(place), // Вибір місця
              }}
            >
              {selectedPlace && selectedPlace.name === place.name && (
                <Popup
                  position={[place.latitude, place.longitude]}
                  eventHandlers={{
                    popupclose: () => setSelectedPlace(undefined), // Закриття вікна
                  }}
                >
                  <div>
                    <h3>{place.name}</h3>
                    <p>{place.street}, {place.houseNumber}</p>
                    <button onClick={() => handleMarkerClick(place)}>Деталі</button>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default Map;
