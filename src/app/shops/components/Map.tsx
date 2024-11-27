import { ShopGetDTO } from "@/pages/api/ShopApi"; // Переконайтеся, що ShopGetDTO є валідним
import useLocalStorageStore from "@/store/localStorage";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Стилі Leaflet
import { useRouter } from "next/navigation"; // Використання useRouter з коректним шляхом
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Іконка для маркерів
export const customIcon = new L.Icon({
  iconUrl: "/images/marker-icon.png", // Використання локального шляху до картинки
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/images/marker-shadow.png", // Локальний шлях
  shadowSize: [41, 41],
});

export const Map = ({ places }: { places: ShopGetDTO[] }) => {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState<ShopGetDTO | undefined>(undefined);
  const { setShopToViewOnShopPage } = useLocalStorageStore();
  const { setIsMainPageMenuShopsOpened } = useMainPageMenuShops();

  const handleMarkerClick = (place: ShopGetDTO) => {
    setShopToViewOnShopPage(place);
    setIsMainPageMenuShopsOpened(false);
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
      {places && places.length > 0 && (
        <MarkerClusterGroup>
          {places.map((place, index) => (
            <Marker
              key={index}
              position={[place.latitude ?? 0, place.longitude ?? 0]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedPlace(place), // Вибір місця
              }}
            >
              {selectedPlace && selectedPlace.name === place.name && (
                <Popup
                  position={[place.latitude ?? 0, place.longitude ?? 0]}
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

