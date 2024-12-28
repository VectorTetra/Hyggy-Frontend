"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from '../../styles/MainPageHeader-styles.module.css';
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import { CircularProgress } from "@mui/material";
import useLocalStorageStore from "@/store/localStorage";

export default function MainPageHeaderGeo(props) {
  const { selectedShop, setSelectedShop } = useLocalStorageStore();  // Використовуємо useLocalStorage
  const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
  const [shopName, setShopName] = useState(null);
  const handleMenuClick = () => {
    if (!isMainPageMenuShopsOpened) {
      // setTimeout(
      //   setTimeout(() => {
      //     setIsMainPageMenuShopsOpened(true)
      //   }, 300));
      setIsMainPageMenuShopsOpened(true)
    }
  };
  useEffect(() => {
    if (selectedShop) {
      setShopName(selectedShop.name);
    }
  }, [selectedShop]);
  return (
    <div onClick={handleMenuClick} className={styles.geoblock}>
      <img
        className={styles.mainPageHeaderGeoPhoto}
        src={props.GeoPhotoUrl}
        alt="GeoPhoto"
      />
      <Link prefetch={true} className={styles.geoText} href="#">
        {shopName || "Виберіть магазин Hyggy"}
      </Link>
      <img
        className={styles.mainPageHeaderGeoKursor}
        src={props.GeoKursorUrl}
        alt="GeoPhoto"
      />
    </div>
  );
}
