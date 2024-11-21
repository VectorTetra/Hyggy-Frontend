"use client";
import React from 'react';
import { Metadata } from 'next';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';
import useMainPageMenuStore from "@/store/mainPageMenu";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
// import BlockMenu from './BlockMenu';
// import BlockShops from './BlockShops';
import dynamic from 'next/dynamic';
const DynamicBlockMenu = dynamic(() => import('./BlockMenu'));
const DynamicBlockShops = dynamic(() => import('./BlockShops'));
import { useWareCategories1 } from '@/pages/api/WareCategory1Api';
import useWarePageMenuShops from '@/store/warePageMenuShops';
import BlockShopsByWare from './BlockShopsByWare';
import { useRouter } from 'next/router';

export interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Визначення типу хедера
  footerType?: 'footer1' | 'footer2' | 'null'; // Визначення типу футера
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1' }) => {

  return (
    <div>
      {headerType === 'header1' && <Header1 />}
      {headerType === 'header2' && <Header2 />}
      {headerType === 'null' && null}
      <DynamicBlockMenu />
      <DynamicBlockShops />

      <main>{children}</main>
      {footerType === 'footer1' && <Footer1 />}
      {footerType === 'null' && null}
    </div>
  );
};

export default Layout;
