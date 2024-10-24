import React from 'react';
import MainPageHeader from '../MainPageFiles/jsx/jsx-Header/MainPageHeader.jsx';
import headerData from '../MainPageFiles/json/mainPageHeaderInfo.json';

const Header1 = () => {
  console.log(headerData);
  return (
    <header>
      <MainPageHeader headerData={headerData.headerData} />
    </header>
  );
};

export default Header1;

