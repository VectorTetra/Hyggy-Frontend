"use client";
import React from 'react';
import { Metadata } from 'next';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';
import useMainPageMenuStore from "@/store/mainPageMenu";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import BlockMenu from './BlockMenu';
import BlockShops from './BlockShops';
import { useWareCategories1 } from '@/pages/api/WareCategory1Api';
import useWarePageMenuShops from '@/store/warePageMenuShops';
import BlockShopsByWare from './BlockShopsByWare';

export interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Визначення типу хедера
  footerType?: 'footer1' | 'footer2' | 'null'; // Визначення типу футера
  // pageMetadata?: {    // Додайте цей блок
  //   title: string;
  //   description: string;
  // };
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1' }) => {
  const { isMainPageMenuOpened } = useMainPageMenuStore();
  const { isMainPageMenuShopsOpened } = useMainPageMenuShops();

  // const { data: foundWareCategories = [], isLoading: isWareCategories1Loading } = useWareCategories1({
  //   SearchParameter: "Query",
  //   //QueryAny: query,
  //   PageNumber: 1,
  //   PageSize: 1000,
  //   Sorting: "NameAsc"
  // });
  // React.useEffect(() => {
  //   if (pageMetadata) {
  //     document.title = pageMetadata.title;
  //   }
  // }, [pageMetadata]);

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
