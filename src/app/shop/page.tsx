"use client"

import {useEffect, useState, useRef} from 'react'
import Image from "next/image";
import Layout from '../sharedComponents/Layout';
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі Leaflet
import L from "leaflet";
import { useRouter } from 'next/navigation';
import { Place, customIcon } from '../shops/components/Map';
import Link from 'next/link';

export default function Shop() {
    
    const[place, setPlace] = useState<Place | undefined>();
    const markerRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const storedShop = sessionStorage.getItem('shop');
        if(storedShop){
            console.log(storedShop);
            setPlace(JSON.parse(storedShop));
            // if(markerRef.current)
            // {
            //     markerRef.current.openPopup();
            // }
            console.log(place?.name);
        }
    },[])
    const openGoogleMaps = () => {
        // Construct the URL for Google Maps
      const url = `https://www.google.com/maps?q=${place?.latitude},${place?.longitude}`;
      
      // Open the URL in a new tab
      window.open(url, '_blank');
    }
  return (
    <Layout>
    <div className="mx-6 md:mx-24 lg:mx-24">
        <div className="flex gap-4 mt-10">
            <a className="text-[12px] text-gray-400" href="#">Домашня сторінка</a>
            <a className="text-[12px] text-gray-400" href="#">Магазини</a>
            <a className="text-[12px] text-gray-400" href="#">{place?.name}</a>
        </div>
        <div className="flex flex-col lg:flex-row mt-20 mb-20 gap-10">
            <div className="flex flex-col lg:w-2/3">
                <h1 className="text-3xl font-semibold">{place?.name}</h1>
                <h3 className="mt-2 text-[14px]">{place?.address}</h3> 
                <a href="#workhours" className="text-gray-500 text-[14px] mt-5 flex gap-2 
                hover:underline lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>

                    Робочі години</a>
                <Link  href='/shops' className="cursor-pointer text-gray-500 text-[14px] mt-5 flex gap-2
                hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Обрати інший магазин</Link>
                <div className="bg-gray-500 h-[500px] mt-4">
               {place ? (
                <MapContainer
                     center={[place.latitude, place.longitude]} // Центр карти
                     zoom={20}
                     style={{ width: "100%", height: "100%" }} // Розмір контейнера для карти
                 >
                 {/* Використання OpenStreetMap як джерела тайлів */}
                 <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; < href="https://www.openstreetmap.org/copyright">OpenStreetMap</ a> contributors'
                  />
                  <Marker
                    key={place.name}
                    position={[place.latitude, place.longitude]}
                    icon={customIcon}
                    ref = {markerRef}
                >
                    {/* Інфо-вікно для вибраного місця */}
                    {place && 
                 <Popup 
                    eventHandlers={{
                     popupclose: () => setPlace(undefined) }}>
                    <div className="h-52 w-60 pb-2 mt-20">
                        <h2 className="mt-20 text-xl font-bold text-black">{place.name}</h2>
                        <div className="flex flex-col mt-2 text-[13px] gap-1">
                        <div>{place.address}</div>
                            <div>{place.postalCode} {place.city}</div>
                             <div>Тел: {place.phoneNumber}</div>
                             <a className="text-[14px] font-extralight cursor-pointer" onClick={() => openGoogleMaps()}>Як знайти магазин</a>
                        </div>
                        <div className="mt-2">
                            <div className="font-bold text-[15px] text-black">Робочі години</div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                    Сьогодні
                                </div>
                                <div>
                                    {place.workHours[0]}
                                </div>
                                <div>
                                    Завтра
                                </div>
                                <div>
                                    {place.workHours[1]}
                                </div>
                            </div>
                        </div>
                     </div>
                 </Popup>
}
        </Marker>
    </MapContainer>
               ) : (
                <div>Loading...</div>
               )}
                </div>

            </div>
            <div className="p-3 bg-gray-100 flex flex-col  lg:w-1/3">
                <Image className="h-56" src={place?.photoUrl as string} alt="Магазин,Суми" width={450} 
                height={500}></Image>
                <h1 id="workhours" className="mt-10 text-2xl font-semibold">Робочі години</h1>
                <ul className="list-none mt-2 font-light text-[14px] space-y-2 flex flex-col">
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Четвер</h4>
                            <h4>26.09</h4>
                            <h4 className="">10:00 - 20:00</h4>
                    </li> 
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>П'ятнинця</h4>
                            <h4>27.09</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Субота</h4>
                            <h4>28.09</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Неділя</h4>
                            <h4>29.09</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Понеділок</h4>
                            <h4>30.09</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>

                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Вівторок</h4>
                            <h4>01.10</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>
                    <li className="grid grid-cols-[1fr_1fr_auto]">
                            <h4>Середа</h4>
                            <h4>02.10</h4>
                            <h4>10:00 - 20:00</h4>
                    </li>

                </ul>
                <div className="flex flex-col text-center mt-10 font-light">
                    <p className="text-[14px]">
                    Термін зберігання товару за послугою «Замов та забери» становить 4 дні, не рахуючи дня створення. Можлива доставка замовлення з магазину і оплата на адресі (банківською картою). Вартість доставки в межах міста 350 грн, більше 3 000 грн – безкоштовно. Магазин НЕ працює під час повітряної тривоги
                    </p>
                </div>
            </div>
        </div>
    </div>
    </Layout>
  )
}
