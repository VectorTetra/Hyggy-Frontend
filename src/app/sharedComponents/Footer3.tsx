import React from 'react';
import MainPageFooter from '../MainPageFiles/jsx/jsx-Footer/MainPageFooter.jsx';
import footerData from '../MainPageFiles/json/mainPageFooter.json';
import MainPageBodyAboutUs from '@/app/MainPageFiles/jsx/jsx-Body/MainPageBodyAboutUs';
import MainPageBodySubscriptionForm from '@/app/MainPageFiles/jsx/jsx-Body/MainPageBodySubscriptionForm';
import bodyData from "@/app/MainPageFiles/json/mainPageBody.json";
const Footer3 = () => {
	return (
		<footer>
			<MainPageBodyAboutUs aboutus={bodyData.bodyData.aboutus} />
			<MainPageBodySubscriptionForm caption={bodyData.bodyData.formmail.caption}
				forminfo={bodyData.bodyData.formmail.forminfo} />
			<MainPageFooter footerData={footerData.footerData} />
		</footer>
	);
};

export default Footer3;
