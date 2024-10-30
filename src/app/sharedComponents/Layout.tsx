"use client";
import React, { useState } from 'react';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';
import useMainPageMenuStore from "@/store/mainPageMenu";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import BlockMenu from './BlockMenu';
import BlockShops from './BlockShops';
import { QueryClient, QueryClientProvider } from 'react-query';

export interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Определение типа хедера
  footerType?: 'footer1' | 'footer2' | 'null'; // Определение типа футера
  pageMetadata?: {    // Добавьте этот блок
    title: string;
    description: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1', pageMetadata }) => {
  const { isMainPageMenuOpened, setIsMainPageMenuOpened } = useMainPageMenuStore();
  const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
  const [queryClient] = useState(() => new QueryClient());
  React.useEffect(() => {
    if (pageMetadata) {
      document.title = pageMetadata.title;
    }
  }, [pageMetadata]);

  return (
    <QueryClientProvider client={queryClient}>
      {headerType === 'header1' && <Header1 />}
      {headerType === 'header2' && <Header2 />}
      {headerType === 'null' && null}
      {isMainPageMenuOpened && <BlockMenu />}
      {isMainPageMenuShopsOpened && <BlockShops />}
      <main>{children}</main>
      {footerType === 'footer1' && <Footer1 />}
      {footerType === 'null' && null}
    </QueryClientProvider>
  );
};

export default Layout;
