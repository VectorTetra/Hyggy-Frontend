"use client"
import React, { useState } from "react";
import styles from '../page.module.css';
import data from '../PageProfileUser.json';
//import FavoritesUser from './FavoritesUser';
import WareGrid from "@/app/search/tsx/WareGrid";

export default function PageProfileUser(props: any) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(data.profile.urlphoto || null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.pageBackground}>
            <h2 className={styles.pageTitle}>Профіль</h2>
            <div className={styles.profileContainer}>
                <div className={styles.profileBlock}>
                    <div className={styles.profileInfo}>
                        <div
                            // Если фото не загружено, то пустой круг с оранжевой окантовкой
                            className={imagePreviewUrl ? styles.profileImageContainerOrange : styles.profileImageContainerMustard}
                        >
                            {imagePreviewUrl ? (
                                <img src={imagePreviewUrl} className={styles.profileImage} alt="profile" />
                            ) : (
                                <div className={styles.placeholder}>Фото</div>
                            )}
                        </div>
                        <div className={styles.profileText}>
                            <h3 className={styles.h3}>{data.profile.Name} {data.profile.Surname}</h3>
                        </div>
                    </div>
                    <label htmlFor="uploadPhoto" className={styles.uploadLink}>Завантажити фото</label>
                    <input type="file" id="uploadPhoto" className={styles.fileInput} onChange={handleImageChange} />
                    <ul className={styles.profileDetails}>
                        <li>Електронна пошта: {data.profile.email}</li>
                        <li>Країна: {data.profile.country}</li>
                        <li>Номер телефону: {data.profile.numberphone}</li>
                    </ul>
                    <div className={styles.deleteAccountButtonContainer}>
                        <button className={styles.deleteAccountButton}>Видалити</button>
                        <button className={styles.deleteAccountButton}>Редагувати</button>
                    </div>
                </div>

                <div className={styles.profileBlock}>
                    <ul className={styles.actionList}>
                        <li>Мої замовлення(1) <span>&rarr;</span></li>
                        <li>Виконані замовлення(26) <span>&rarr;</span></li>
                        <li>Мої відгуки(5) <span>&rarr;</span></li>
                        <li>Мої способи платежу(2) <span>&rarr;</span></li>
                    </ul>
                </div>
            </div>
            <div style={{ margin: "25px 3vw 0 3vw" }}>
                <h2 className={styles.pageTitle2}>Обране</h2>
                <WareGrid wares={data.favorites} itemsPerPage={8} />
            </div>
        </div>
    );
}