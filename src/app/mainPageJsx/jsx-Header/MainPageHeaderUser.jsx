import Link from 'next/link';
import React from 'react';
import styles from "../../mainPageStyles/MainPageHeader-styles.module.css";
function MainPageHeaderUser(props) {
    return (
        <div id={styles.mainPageHeaderLogoContainer}> 
			<img id={styles.mainPageHeaderUserPhoto} src={props.userPhotoUrl} alt="logo" />
            <Link href="../PageAuthentication/authentication.html">
                Вхід
            </Link>
        </div>
    );
}
export default MainPageHeaderUser;