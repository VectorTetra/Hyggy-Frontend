import React from 'react';
import MainPageFooter from '../MainPageFiles/jsx/jsx-Footer/MainPageFooter.jsx';
import footerData from '../MainPageFiles/json/mainPageFooter.json';
import RecentWares from './RecentWares';
const Footer2 = () => {
    return (
        <footer className='footer2'>
            <RecentWares />
            <MainPageFooter footerData={footerData.footerData} />
        </footer>
    );
};

export default Footer2;
