"use client";
import React from 'react';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';
import useMainPageMenuStore from "@/store/mainPageMenu";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import BlockMenu from './BlockMenu';
import BlockShops from './BlockShops';

export interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Определение типа хедера
  footerType?: 'footer1' | 'footer2'; // Определение типа футера
  pageMetadata?: {
    title: string;
    description: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1', pageMetadata }) => {
  const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();
  const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();

  React.useEffect(() => {
    if (pageMetadata) {
      document.title = pageMetadata.title;
    }
  }, [pageMetadata]);

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
