"use client"
import React, { useState } from "react";
import Layout from "../sharedComponents/Layout";
import BlockMenu from "./jsx-mainblockmenu/BlockMenu";
import blockData from "./blockmenu.json";
import MainPageHeaderMenu from "../MainPageFiles/jsx/jsx-Header/MainPageHeaderMenu"; // Импортируем вашу кнопку меню

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Создаем состояние для управления меню

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Переключаем состояние меню
  };

  return (
    <Layout headerType="header1" footerType="footer1">
      <div>
        <MainPageHeaderMenu
          onMenuClick={toggleMenu} // Передаем функцию для открытия/закрытия меню
        />
        {isMenuOpen && <BlockMenu blockData={blockData} />} {/* Показываем меню, если оно открыто */}
      </div>
    </Layout>
  );
}



