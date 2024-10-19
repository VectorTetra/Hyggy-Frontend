'use client'

import  { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Place } from '@/app/shops/components/Map';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NewShop from './NewShop';
import AllShops from './AllShops';
import Header from './Header';
import Search from './Search';

const columns: GridColDef[] = [
    {field: 'col0', headerName: 'Id', width: 150},
    { field: 'col1', headerName: 'Назва', width: 150 },
    { field: 'col2', headerName: 'Адреса', width: 150 },
    { field: 'col3', headerName: 'Почтовий індекс', width: 150 },
    { field: 'col4', headerName: 'Місто', width: 150 },
    { field: 'col5', headerName: 'Телефоний номер', width: 150 },
  ];
export default function Shops() {
    const [places, setPlaces] = useState<Place[]>([
      {
        id: "1",
        photoUrl: "/images/Shops/OdessaHyggy.png",
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
        id: "2",
        photoUrl: "/images/Shops/HyggyЮжне.png",
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
        id: "3",
        photoUrl: "/images/Shops/JYSK Миколаїв.png",
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
        id: "4",
        photoUrl: "/images/Shops/Магазин,Суми.png",
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
    const [redirect, setRedirect] = useState<Boolean>(true);
    const router = useRouter();

   if(!places){
    return (
      <div className="text-center"> 
        Магазини не знайдено
      </div>
    )
   }
   
  

  return  (
    <>
    {redirect ? ( 
    <div className="flex flex-col">
    {/* Header */}
    <Header onChange={redirect => setRedirect(redirect)}/>
    {/* Пошук */}
    <Search />
    {/* Лист магазинів */}
    <AllShops places={places} />
    </div>) : (
      // Створення нового магазину
      <NewShop />
    )}
    </>
    )
  
 }