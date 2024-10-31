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
  headerType?: 'header1' | 'header2' | 'null'; // Визначення типу хедера
  footerType?: 'footer1' | 'footer2' | 'null'; // Визначення типу футера
  pageMetadata?: {    // Додайте цей блок
    title: string;
    description: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1', pageMetadata }) => {
  const { isMainPageMenuOpened } = useMainPageMenuStore();
  const { isMainPageMenuShopsOpened } = useMainPageMenuShops();

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
      {footerType === 'null' && null}
    </>
  );
};

export default Layout;
