// "use client";
// import { useState, useEffect } from "react";
// import Layout from "../sharedComponents/Layout";
// import Map from "./components/Map";
// import { getShops, ShopDTO, ShopGetDTO } from '@/pages/api/ShopApi';
// import { faCheck } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// export type Place = {
//   id: number;
//   photoUrl: string,
//   name: string;
//   street: string;
//   houseNumber: string;
//   addressId: number,
//   storageId: number,
//   orderIds: number[],
//   shopEmployeeIds: number[],
//   postalCode: string;
//   city: string;
//   state: string;
//   workHours: string;
//   latitude: number;
//   longitude: number;
//   executedOrdersSum: number;
// };
// export default function Shops() {

//   const pageMetadata = {
//     title: "Магазини HYGGY",
//     description: "Магазини HYGGY",
//   };

//   const [places, setPlaces] = useState<ShopGetDTO[]>([]);
//   const [filteredPlaces, setFilteredPlaces] = useState<ShopGetDTO[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isCheckOpen, setIsCheckOpen] = useState(false);

//   useEffect(() => {
//     const fetchShops = async () => {
//       try {
//         const data = await getShops({
//           SearchParameter: "Query",
//           PageNumber: 1,
//           PageSize: 150
//         }); // Передай параметри, якщо необхідно
//         setPlaces(data);
//         setFilteredPlaces(data);
//         console.log(data);
//       } catch (error) {
//         console.error('Error fetching shops:', error);
//       }
//     };

//     fetchShops();
//   }, []);

//   const isOpenNow = (workHours: string): boolean => {
//     const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];

//     const now = new Date();
//     const currentDay = daysOfWeek[now.getDay()]; // Отримуємо поточний день тижня
//     const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

//     // Знаходимо графік роботи для поточного дня
//     const todaySchedule = workHours
//       .split('|')
//       .find(schedule => schedule.startsWith(currentDay));

//     if (!todaySchedule) return false; // Якщо графік для цього дня не вказаний

//     const hours = todaySchedule.split(',')[1]?.split(' - ') || [];
//     if (hours.length !== 2) return false; // Якщо не вдалося розділити час роботи на інтервали

//     const [openTime, closeTime] = hours;

//     // Створюємо Date-об'єкти для порівняння часу
//     const openDate = new Date();
//     const closeDate = new Date();
//     const currentDate = new Date();

//     // Встановлюємо години та хвилини для openTime і closeTime
//     const [openHours, openMinutes] = openTime.split(':').map(Number);
//     const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

//     openDate.setHours(openHours, openMinutes, 0, 0);
//     closeDate.setHours(closeHours, closeMinutes, 0, 0);

//     // Перевірка, чи поточний час знаходиться в межах годин роботи
//     return currentDate >= openDate && currentDate <= closeDate;
//   };

//   useEffect(() => {
//     SearchShop();
//   }, [isCheckOpen])

//   const SearchShop = () => {

//     let searchPlaces = places;

//     // Створюємо регулярний вираз для пошуку, якщо `search` не порожній
//     const searchPattern = search ? new RegExp(search, 'i') : null;

//     // Якщо є текст пошуку, відфільтровуємо `places` за `name`, `street` або `city`
//     if (searchPattern) {
//       searchPlaces = searchPlaces.filter(
//         place => place.name && searchPattern.test(place.name) ||
//           place.street && searchPattern.test(place.street) ||
//           place.city && searchPattern.test(place.city)
//       );
//     }

//     // Якщо ввімкнено фільтр за відкритими магазинами, додатково фільтруємо `searchPlaces`
//     if (isCheckOpen) {
//       searchPlaces = searchPlaces.filter(place => place.workHours && isOpenNow(place.workHours));
//     }

//     // Оновлюємо список відфільтрованих магазинів
//     setFilteredPlaces(searchPlaces);
//   }

//   return (
//     <Layout headerType='header1'>

//       <div className="mt-16 mx-8 md:mx-24 lg:mx-24">
//         <div className="flex justify-center">

//           <h1 className="text-3xl">Знайти найближчий магазин</h1>
//         </div>
//         <div className="flex flex-wrap mt-10 gap-4">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="
//             bg-[#E0E0E0] mb-3 text-2xl text-[#00000080] 
//             grow h-10 border border-[#00000080] rounded-md 
//              shadow focus:shadow-[#00AAAD] focus:outline-none focus:border-none
//             "></input>
//           <button className="bg-[#00AAAD] text-white text-[18px] whitespace-nowrap font-bold px-8 h-10 border rounded-md xs:w-full lg:w-auto" onClick={SearchShop}>Шукати магазини</button>
//           <button className={!isCheckOpen ? "font-light whitespace-nowrap bg-[#E0E0E0] h-10 px-8" : "flex gap-2 items-center justify-center font-bold whitespace-nowrap bg-[#E0E0E0] h-10 px-8 text-[#00AAAD]"} onClick={() => setIsCheckOpen(!isCheckOpen)}>{isCheckOpen && (<span>
//             <FontAwesomeIcon icon={faCheck} />
//           </span>)}Зараз відчинено</button>
//         </div>
//         <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
//           <div className="bg-gray-500 shrink-0 lg:w-2/3 h-[500px]">
//             <Map places={filteredPlaces} />
//           </div>
//           <div className="flex flex-col lg:w-1/3 text-center shadow-md h-fit py-4 px-8">
//             <h3 className="text-2xl">Виберіть магазин</h3>
//             <p className="mt-2 text-gray-500">
//               Щоб вибрати магазин, натисніть відповідний значок на карті. Після вибору значка магазина масштаб карти збільшується на цій ділянці.
//             </p>
//           </div>
//         </div>
//       </div>
//     </Layout>

//   )
// }


"use client";
import { getShops, ShopGetDTO } from '@/pages/api/ShopApi';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import Layout from "../sharedComponents/Layout";

// Оголошуємо типи для ShopDTO та ShopGetDTO, якщо їх ще немає
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
const DynamicMap = dynamic(
  () => import('./components/Map'),
  { ssr: false }
)
export default function Shops() {
  const pageMetadata = {
    title: "Магазини HYGGY",
    description: "Магазини HYGGY",
  };

  const [places, setPlaces] = useState<ShopGetDTO[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<ShopGetDTO[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isCheckOpen, setIsCheckOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getShops({
          SearchParameter: "Query",
          PageNumber: 1,
          PageSize: 150
        });
        setPlaces(data);
        setFilteredPlaces(data);
        setLoading(false); // після завантаження даних знімаємо loading
        console.log(data);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setLoading(false); // якщо сталася помилка, знімаємо loading
      }
    };

    fetchShops();
  }, []); // цей useEffect викликається один раз після монтування компонента

  const isOpenNow = (workHours: string): boolean => {
    const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];

    const now = new Date();
    const currentDay = daysOfWeek[now.getDay()];
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const todaySchedule = workHours
      .split('|')
      .find(schedule => schedule.startsWith(currentDay));

    if (!todaySchedule) return false;

    const hours = todaySchedule.split(',')[1]?.split(' - ') || [];
    if (hours.length !== 2) return false;

    const [openTime, closeTime] = hours;
    const openDate = new Date();
    const closeDate = new Date();
    const currentDate = new Date();

    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

    openDate.setHours(openHours, openMinutes, 0, 0);
    closeDate.setHours(closeHours, closeMinutes, 0, 0);

    return currentDate >= openDate && currentDate <= closeDate;
  };

  useEffect(() => {
    SearchShop();
  }, [isCheckOpen, search]); // додано search в залежності від змін

  const SearchShop = () => {
    let searchPlaces = places;

    const searchPattern = search ? new RegExp(search, 'i') : null;

    if (searchPattern) {
      searchPlaces = searchPlaces.filter(
        place => place.name && searchPattern.test(place.name) ||
          place.street && searchPattern.test(place.street) ||
          place.city && searchPattern.test(place.city)
      );
    }

    if (isCheckOpen) {
      searchPlaces = searchPlaces.filter(place => place.workHours && isOpenNow(place.workHours));
    }

    setFilteredPlaces(searchPlaces);
  };

  return (
    <Layout headerType='header1'>
      <div className="mt-16 mx-8 md:mx-24 lg:mx-24">
        <div className="flex justify-center">
          <h1 className="text-3xl">Знайти найближчий магазин</h1>
        </div>
        <div className="flex flex-wrap mt-10 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#E0E0E0] pl-2 mb-3 text-2xl text-[#00000080] grow h-10 border border-[#00000080] rounded-md  focus:shadow-[#00AAAD] focus:outline-none focus:border-none"
            placeholder="Місто, вулиця"
          />
          <button
            className="bg-[#00AAAD] text-white text-2xl whitespace-nowrap  px-8 h-10 border rounded-md xs:w-full lg:w-auto"
            onClick={SearchShop}
          >
            Шукати магазини
          </button>
          <button
            className={!isCheckOpen ? "font-light whitespace-nowrap bg-[#E0E0E0] h-10 px-8" : "flex gap-2 items-center justify-center font-bold whitespace-nowrap bg-[#00AAAD] h-10 px-8 text-white"}
            onClick={() => setIsCheckOpen(!isCheckOpen)}
          >
            {isCheckOpen && <span><FontAwesomeIcon icon={faCheck} /></span>}
            Зараз відчинено
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-10">
          <div className="bg-gray-500 shrink-0 lg:w-2/3 h-[500px]">
            <DynamicMap places={filteredPlaces} />
          </div>
          <div className="flex flex-col lg:w-1/3 text-center shadow-md h-fit py-4 px-8">
            <h3 className="text-2xl">Виберіть магазин</h3>
            <p className="mt-2 text-gray-500">
              Щоб вибрати магазин, натисніть відповідний значок на карті. Після вибору значка магазина масштаб карти збільшується на цій ділянці.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

