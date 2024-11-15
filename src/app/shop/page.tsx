"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Layout from '../sharedComponents/Layout';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { customIcon } from '../shops/components/Map';
import Link from 'next/link';

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
export default function Shop() {
    const [place, setPlace] = useState<Place | undefined>();
    const markerRef = useRef(null);
    const router = useRouter();
    const daysOfWeek = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];

    // Отримуємо індекс сьогоднішнього дня з урахуванням, що 0 - це понеділок
    const todayIndex = (new Date().getDay() + 6) % 7;
    const tomorrowIndex = (todayIndex + 1) % 7;

    useEffect(() => {
        const storedShop = sessionStorage.getItem('shop');
        if (storedShop) {
            setPlace(JSON.parse(storedShop));
        }
    }, []);

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps?q=${place?.latitude},${place?.longitude}`;
        window.open(url, '_blank');
    };


    return (
        <Layout>
            <div className="md:mx-24 lg:mx-20 xs:mx-4">
                {/* Додатковий контент */}
                <div className="flex flex-col lg:flex-row mt-16 mb-20 gap-10">
                    <div className="flex flex-col lg:w-2/3 mt-6">
                        <h1 className="text-3xl font-semibold">{place?.name}</h1>
                        <h3 className="mt-2 text-[14px]">{place?.street}</h3>

                        <Link href="#workhours" className="text-gray-500 text-[14px] mt-5 flex gap-2 

                hover:underline lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>


                            Робочі години</Link>
                        <Link href='/shops' className="cursor-pointer text-gray-500 text-[14px] mt-5 flex gap-2

                hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Обрати інший магазин</Link>
                        {/* Карта */}
                        <div className="bg-gray-500 h-[500px] mt-4">
                            {place ? (
                                <MapContainer
                                    center={[place.latitude, place.longitude]}
                                    zoom={20}
                                    style={{ width: '100%', height: '100%' }}
                                    maxZoom={18}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    <Marker
                                        key={place.name}
                                        position={[place.latitude, place.longitude]}
                                        icon={customIcon}
                                        ref={markerRef}
                                    >
                                        <Popup
                                            eventHandlers={{
                                                popupclose: () => setPlace(undefined),
                                            }}
                                        >
                                            <div className="h-52 w-60 pb-2 mt-20 mb-10">
                                                <h2 className="mt-20 text-xl font-bold text-black">
                                                    {place.name}
                                                </h2>
                                                <div className="flex flex-col mt-2 text-[13px] gap-1">
                                                    <div>{place.street} {place.houseNumber}</div>
                                                    <div>{place.postalCode} {place.city}</div>
                                                    <div>Тел: +380978654671</div>
                                                    <Link
                                                        className="text-[14px] font-extralight cursor-pointer"
                                                        onClick={openGoogleMaps} href={''}                                                    >
                                                        Як знайти магазин
                                                    </Link>
                                                    <div className="mt-2">
                                                        <div className="font-bold text-[15px] text-black">Робочі години</div>
                                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                                            <div>
                                                                Сьогодні
                                                            </div>
                                                            <div>
                                                                {place?.workHours.split('|')[todayIndex].split(',')[1]}
                                                            </div>
                                                            <div>
                                                                Завтра
                                                            </div>
                                                            <div>
                                                                {place?.workHours.split('|')[tomorrowIndex].split(',')[1]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                    <div className="p-3 mt-0 bg-gray-100 flex flex-col lg:w-1/3">
                        <Image
                            className="h-56"
                            src={place?.photoUrl as string}
                            alt="Магазин, Суми"
                            width={450}
                            height={500}
                        />
                        <div className="flex flex-col">
                            <h1 id="workhours" className="mt-10 text-2xl font-semibold">
                                Робочі години
                            </h1>
                            <ul className="mt-1 font-[400] space-y-0 pl-0">
                                {place?.workHours.split('|').map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex justify-between text-sm mb-0 ${index === todayIndex ? 'bg-yellow-200' : ''
                                            }`}
                                    >
                                        <p className="py-1 mb-0">{item.split(',')[0]}</p>
                                        <p className="py-1 mb-0">{item.split(',')[1]}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col text-center mt-2 font-light">
                            <p className="text-[14px]">
                                Термін зберігання товару за послугою «Замов та забери» становить 4 дні, не рахуючи дня створення. Можлива доставка замовлення з магазину і оплата на адресі (банківською картою). Вартість доставки в межах міста 350 грн, більше 3 000 грн – безкоштовно. Магазин НЕ працює під час повітряної тривоги.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
}
