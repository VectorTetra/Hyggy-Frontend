import React from 'react';
import MainPageFooter from '../MainPageFiles/jsx/jsx-Footer/MainPageFooter.jsx';
import footerData from '../MainPageFiles/json/mainPageFooter.json';
const Footer1 = () => {
  return (
    <footer>
      <MainPageFooter footerData={footerData.footerData} />
    </footer>
  );
};

export default Footer1;
