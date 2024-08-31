import React from 'react';
import MainPageFooter from '../mainPageJsx/jsx-Footer/MainPageFooter.jsx';
import footerData from '../mainPageJson/mainPageFooter.json';
const Footer1 = () => {
  return (
    <footer>
      
      <MainPageFooter footerData={footerData.footerData}/>
      
    </footer>
  );
};

export default Footer1;
