import Link from 'next/link';
import React from 'react';
import styles from '../../styles/MainPageHeader-styles.module.css';

export default function MainPageHeaderFavoriteButton(props: any) {
    console.log("Favorite button clicked with props:", props);
    return (
        <Link href={{ pathname: "../PageProfileUser", query: { tab: 'favorites' } }} className={styles.mainPageHeaderItem}>
            <img id={styles.mainPageHeaderUserPhoto} src={props.favoritePhotoUrl} alt="logo" />
            <div className={styles.disappearOnAdapt}>Обране</div>
        </Link>
    );
}