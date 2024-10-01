import React from 'react';
import Header1 from './Header1';
import Header2 from './Header2';
import Footer1 from './Footer1';

interface LayoutProps {
  children: React.ReactNode;
  headerType?: 'header1' | 'header2' | 'null'; // Додайте тип для вибору шапки
  footerType?: 'footer1' | 'footer2'; // Додайте тип для вибору футера
}

const Layout: React.FC<LayoutProps> = ({ children, headerType = 'header1', footerType = 'footer1' }) => {
  return (
    <>
      {headerType === 'header1' && <Header1 />}
      {headerType === 'header2' && <Header2 />}
      {headerType === 'null' && null}
      <main>{children}</main>
      {footerType === 'footer1' && <Footer1 />}
    </>
  );
};

export default Layout;
