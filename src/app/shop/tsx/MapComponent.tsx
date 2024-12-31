// // import { useEffect, useRef } from "react";
//  import dynamic from "next/dynamic";
// import { ShopGetDTO } from "@/pages/api/ShopApi";
// //import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// //import L from "leaflet";
// import "leaflet/dist/leaflet.css"; // Стилі Leaflet 
// const MapContainer = dynamic(
//     () => import("react-leaflet").then((mod) => mod.MapContainer),
//     { ssr: false }
// );
// const TileLayer = dynamic(
//     () => import("react-leaflet").then((mod) => mod.TileLayer),
//     { ssr: false }
// );
// const Marker = dynamic(
//     () => import("react-leaflet").then((mod) => mod.Marker),
//     { ssr: false }
// );
// const Popup = dynamic(
//     () => import("react-leaflet").then((mod) => mod.Popup),
//     { ssr: false }
// );



// interface MapProps {
//     place: ShopGetDTO | null;
// }
// export const customIcon = new L.Icon({
//     iconUrl: "/images/marker-icon.png", // Використання локального шляху до картинки
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowUrl: "/images/marker-shadow.png", // Локальний шлях
//     shadowSize: [41, 41],
// });
// const MapComponent: React.FC<MapProps> = ({ place }) => {
//     // const mapRef = useRef<any>(null);

//     // useEffect(() => {
//     //     if (mapRef.current && place) {
//     //         mapRef.current.setView([place.latitude, place.longitude], 15);
//     //     }
//     // }, [place]);

//     const openGoogleMaps = () => {
//         if (!place) return;
//         const url = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
//         window.open(url, "_blank");
//     };

//     return (
//         <div className="bg-gray-500 h-[500px] mt-4">
//             {place != null ? (
//                 <MapContainer
//                     center={[place.latitude ?? 0, place.longitude ?? 0]}
//                     zoom={5.5}
//                     style={{ width: "100%", height: "100%" }}
//                     //ref={mapRef}
//                     maxZoom={18}
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <Marker position={[place.latitude, place.longitude]}
//                         icon={customIcon}
//                     >
//                         <Popup>
//                             <div>
//                                 <h2>{place.name}</h2>
//                                 <p>{place.street}</p>
//                                 <button onClick={openGoogleMaps}>Відкрити у Google Maps</button>
//                             </div>
//                         </Popup>
//                     </Marker>
//                 </MapContainer>
//             ) : (
//                 <div>Loading...</div>
//             )}
//         </div>
//     );
// };

// export default MapComponent;

"use client";

import dynamic from "next/dynamic";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import "leaflet/dist/leaflet.css"; // Стилі Leaflet

// Динамічно імпортуємо L (Leaflet)
//const L = dynamic(() => import("leaflet").then(mod => mod.default), { ssr: false });
import L from "leaflet";
// Динамічно імпортуємо компоненти з react-leaflet
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface MapProps {
    place: ShopGetDTO | null;
}

const MapComponent: React.FC<MapProps> = ({ place }) => {
    const openGoogleMaps = () => {
        if (!place) return;
        const url = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
        window.open(url, "_blank");
    };

    // Створюємо іконку, коли L завантажено
    const customIcon = L
        ? new L.Icon({
            iconUrl: "/images/marker-icon.png", // Використання локального шляху до картинки
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "/images/marker-shadow.png", // Локальний шлях
            shadowSize: [41, 41],
        })
        : undefined;

    return (
        <div className="bg-gray-500 h-[500px] mt-4">
            {place != null ? (
                <MapContainer
                    center={[place.latitude ?? 0, place.longitude ?? 0]}
                    zoom={5.5}
                    style={{ width: "100%", height: "100%" }}
                    maxZoom={18}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[place.latitude ?? 0, place.longitude ?? 0]} icon={customIcon}>
                        <Popup>
                            <div>
                                <h2>{place.name}</h2>
                                <p>{place.street}</p>
                                <button style={{ color: "#00AAAD" }} onClick={openGoogleMaps}>Відкрити у Google Maps</button>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default MapComponent;

