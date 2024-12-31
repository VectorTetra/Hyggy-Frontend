// import { ShopGetDTO } from "@/pages/api/ShopApi";
// import useLocalStorageStore from "@/store/localStorage";
// import useMainPageMenuShops from "@/store/mainPageMenuShops";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster"; // Імпортуємо MarkerClusterGroup
// import 'leaflet/dist/leaflet.css';
// import L from "leaflet";

// // Іконка для маркерів
// export const customIcon = new L.Icon({
//   iconUrl: "/images/marker-icon.png", // Використання локального шляху до картинки
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "/images/marker-shadow.png", // Локальний шлях
//   shadowSize: [41, 41],
// });

// export const Map = ({ places }: { places: ShopGetDTO[] }) => {
//   const router = useRouter();
//   const { setShopToViewOnShopPage } = useLocalStorageStore();
//   const { setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
//   const [selectedStore, setSelectedStore] = useState<ShopGetDTO | null>(null);

//   const handleMarkerClick = (place: ShopGetDTO) => {
//     setShopToViewOnShopPage(place);
//     setIsMainPageMenuShopsOpened(false);
//     router.push("/shop");
//   };
//   const [mapCenter, setMapCenter] = useState([places[0]?.latitude || 48.482526, places[0]?.longitude || 30.7233095]);

//   const MapViewUpdater = () => {
//     const map = useMap();

//     useEffect(() => {
//       if (selectedStore) {
//         if (selectedStore.latitude !== undefined && selectedStore.longitude !== undefined) {
//           map.flyTo([selectedStore.latitude, selectedStore.longitude], 17);
//         }
//       }
//     }, [selectedStore, map]);

//     return null;
//   };

//   return (
//     <MapContainer
//       center={mapCenter} // Центр карти
//       zoom={5.5}
//       style={{ width: "100%", height: "100%" }} // Розмір контейнера
//       maxZoom={18}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       <MarkerClusterGroup> {/* Обгортаємо маркери в MarkerClusterGroup */}
//         {places.map((place, index) => (
//           <Marker
//             key={index}
//             position={[place.latitude ?? 0, place.longitude ?? 0]}
//             icon={customIcon}
//             eventHandlers={{
//               click: () => setSelectedStore(place),
//             }}
//           >
//             <Popup>
//               <div>
//                 <h3>{place.name}</h3>
//                 <p>{place.street}, {place.houseNumber}</p>
//                 <button style={{ color: "#00AAAD" }} onClick={() => handleMarkerClick(place)}>
//                   Деталі
//                 </button>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MarkerClusterGroup>
//       <MapViewUpdater />
//     </MapContainer>
//   );
// };

// export default Map;

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

  const MapViewUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedShop) {
        map.flyTo([selectedShop.latitude, selectedShop.longitude], 17);
      }
    }, [selectedShop, map]);

    return null;
  };

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
                <p>{shopp.street}, {shopp.houseNumber}</p>
                <Link style={{ color: "#00AAAD" }} href={`/shop/${shopp.id}`}>
                  Деталі
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      <MapViewUpdater />
    </MapContainer>
  );
};

export default Map;
