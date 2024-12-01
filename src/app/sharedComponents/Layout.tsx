"use client";
import React from 'react';
import Footer1 from './Footer1';
import Footer2 from './Footer2';
import Header1 from './Header1';
import Header2 from './Header2';
import dynamic from 'next/dynamic';
const DynamicBlockMenu = dynamic(() => import('./BlockMenu'));
const DynamicBlockShops = dynamic(() => import('./BlockShops'));

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
      {footerType === 'footer2' && <Footer2 />}
    </div>
  );
};

export default Layout;
