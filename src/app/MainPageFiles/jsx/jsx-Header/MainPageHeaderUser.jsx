"use client";
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/MainPageHeader-styles.module.css';
import { validateToken, isUser } from '@/pages/api/TokenApi';

function MainPageHeaderUser(props) {

    const router = useRouter();
    const isAuthorized = validateToken().status === 200 && isUser();
    return (
        <Link prefetch={true} href={isAuthorized ? "../PageProfileUser" : "/PageAuthentication"} className={styles.mainPageHeaderItem}>
            <img id={styles.mainPageHeaderUserPhoto} src={props.userPhotoUrl} alt="logo" />
            <div className={styles.disappearOnAdapt}>
                {isAuthorized ? "Моя сторінка" : "Вхід"}
            </div>
        </Link>
    );
}
export default MainPageHeaderUser;