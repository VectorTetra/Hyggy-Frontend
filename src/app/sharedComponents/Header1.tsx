import React from 'react';
import MainPageHeader from '../mainPageJsx/jsx-Header/MainPageHeader.jsx';
import headerData from '../mainPageJson/mainPageHeaderInfo.json';
const Header1 = () => {
  console.log(headerData);
  return (
    <header>
      
      <MainPageHeader headerData={headerData.headerData}/>
      
    </header>
  );
};

export default Header1;
