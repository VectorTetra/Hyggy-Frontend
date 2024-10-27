"use client";
import React from 'react';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';
import useMainPageMenuStore from "@/store/mainPageMenu";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import BlockMenu from './BlockMenu';
import BlockShops from './BlockShops';
interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Определение типа хедера
  footerType?: 'footer1' | 'footer2'; // Определение типа футера
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1' }) => {
  const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();
  const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();

  return (
    <>
      {headerType === 'header1' && <Header1 />}
      {headerType === 'header2' && <Header2 />}
      {headerType === 'null' && null}
      {isMainPageMenuOpened && <BlockMenu />}
      {isMainPageMenuShopsOpened && <BlockShops />}
      <main>{children}</main>
      {footerType === 'footer1' && <Footer1 />}
    </>
  );
};

export default Layout;
