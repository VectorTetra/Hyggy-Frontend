"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from '../../styles/MainPageHeader-styles.module.css';
import useMainPageMenuShops from "@/store/mainPageMenuShops";

export default function MainPageHeaderGeo(props) {
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    const savedShop = localStorage.getItem('selectedShop'); // Чтение из localStorage
    if (savedShop) {
      setSelectedShop(JSON.parse(savedShop)); // Если данные есть, обновляем состояние
    }
  }, [])

  const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
  const handleMenuClick = () => {
    if (!isMainPageMenuShopsOpened) {
      setIsMainPageMenuShopsOpened(true); // Вызываем переданную функцию
    }
  };


  console.log('Передаём выбранный магазин', selectedShop);


  return (
    <div onClick={handleMenuClick} className={styles.geoblock} >
      <img
        className={styles.mainPageHeaderGeoPhoto}
        src={props.GeoPhotoUrl}
        alt="GeoPhoto"
      />
      <Link className={styles.geoText} href="#">
        {selectedShop
          ? `${selectedShop.captioncity}, ${selectedShop.geoposition}`
          : "Виберіть магазин Hyggy"}
      </Link>
      <img
        className={styles.mainPageHeaderGeoKursor}
        src={props.GeoKursorUrl}
        alt="GeoPhoto"
      />
    </div>
  );
}
