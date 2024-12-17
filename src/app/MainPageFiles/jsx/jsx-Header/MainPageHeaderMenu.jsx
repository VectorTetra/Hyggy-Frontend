"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from '../../styles/MainPageHeader-styles.module.css';
import useMainPageMenuStore from "@/store/mainPageMenu";


export default function MainPageHeaderMenu({ photoUrl, photoWidth, photoHeight }) {
  const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();
  const handleMenuClick = () => {
    if (!isMainPageMenuOpened) {
      setIsMainPageMenuOpened(true); // Вызываем переданную функцию
    }
  };

  return (
    <div onClick={handleMenuClick} className={styles.mainPageHeaderMenuItem}>
      <Image
        id={styles.mainPageHeaderMenu}
        src={photoUrl}
        alt="logo"
        style={{
          cursor: "pointer"
        }}
        width={photoWidth}
        height={photoHeight}
        priority
      />

      <div className={styles.disappearOnAdapt} style={{ cursor: "pointer" }}>Меню</div>
    </div>
  );
}
