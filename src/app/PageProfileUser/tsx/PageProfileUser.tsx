"use client";
import React, { useState, useEffect } from "react";
import styles from '../page.module.css';
import data from '../PageProfileUser.json';
import { useRouter } from 'next/navigation';
import WareGrid from "@/app/search/tsx/WareGrid";
import EditProfileUser from "./EditProfileUser";
import OrdersUser from './OrdersUser';
import CompletedOrdersUser from './CompletedOrdersUser';
import ReviewsUser from './ReviewsUser';

export default function PageProfileUser() {

    const [isEditing, setIsEditing] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(data.profile.urlphoto || null);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('orders');

    const handleEdit = () => {
        setIsEditing(true); // Устанавливаем состояние редактирования
    };

    const handleSaveChanges = () => {
        setIsEditing(false); // Закрываем форму редактирования
        setActiveTab('orders'); // Переходим на вкладку «Мої замовлення»
    };

    useEffect(() => {
        const isAuthorized = localStorage.getItem('isAuthorized') === 'true';
        if (!isAuthorized) {
            router.push('/'); // Переход на главную страницу, если не авторизован
        }
    }, []);

    // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreviewUrl(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Загрузка нового изображения на ImageKit
            await uploadImage(file);
        }
    };

    const uploadImage = async (file: File) => {
        // Удаление старого изображения на ImageKit, если оно существует
        if (data.profile.urlphoto) {
            await deleteOldImage(data.profile.urlphoto);
        }

        // Загрузка нового изображения на ImageKit
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        try {
            const response = await fetch('https://api.imagekit.io/v1/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa('public_M7rp5a+A03bMXqAwHwTbXJozb2Q=')}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.profile.urlphoto) {
                // Обновляем URL изображения в JSON
                updateProfilePhotoUrl(data.profile.urlphoto);
            }
        } catch (error) {
            console.error("Ошибка загрузки изображения:", error);
        }
    };

    const deleteOldImage = async (imageUrl: string) => {
        const imageId = imageUrl.split('/').pop(); // Извлечение ID изображения из URL
        try {
            await fetch(`https://api.imagekit.io/v1/files/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${btoa('private_XDeaQHKGVMyTnXaAJfkHZuGc+nQ=')}`,
                },
            });
        } catch (error) {
            console.error("Ошибка удаления старого изображения:", error);
        }
    };

    const updateProfilePhotoUrl = (newUrl: string) => {
        // Обновите URL в вашем состоянии или JSON
        data.profile.urlphoto = newUrl; // Или сохраните его в состоянии с помощью setState
    };




    // Функция для выхода
    const handleLogout = () => {
        const userConfirmed = window.confirm("Ви дійсно бажаєте вийти з власного кабінету");
        if (userConfirmed) {
            localStorage.setItem('isAuthorized', 'false');
            router.push("/");
        }
    };

    // Функция для удаления аккаунта
    const handleDeleteAccount = () => {
        const userConfirmed = window.confirm("Ви дійсно бажаєте видалити свій акаунт?");
        if (userConfirmed) {
            localStorage.setItem('isAuthorized', 'false');
            router.push("/");
        }
    };

    const renderActiveTabContent = () => {
        // Если мы редактируем профиль, то отображаем форму редактирования
        if (isEditing) {
            return <EditProfileUser onSave={handleSaveChanges} />
        }

        // В противном случае, отображаем контент для активной вкладки
        switch (activeTab) {
            case 'orders':
                return (
                    <div><OrdersUser /></div>
                );
            case 'completedOrders':
                return (
                    <div><CompletedOrdersUser /></div>
                );
            case 'reviews':
                return (
                    <div><ReviewsUser /></div>
                );
            case 'favorites':
                return (
                    <div>
                        <h2 className={styles.h2}>Обране</h2>
                        <WareGrid wares={data.favorites} itemsPerPage={8} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={styles.pageBackground}>
                <h2 className={styles.pageTitle}>Профіль</h2>
                <div className={styles.profileContainer}>
                    <div className={styles.profileBlock}>
                        <div className={styles.profileInfo}>
                            <div
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
                            <li>Номер телефону: {data.profile.numberphone}</li>
                        </ul>
                        <div className={styles.deleteAccountButtonContainer}>
                            <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>Видалити</button>
                            <button className={styles.deleteAccountButton} onClick={handleEdit}>Редагувати</button>
                        </div>
                    </div>

                    <div className={styles.profileBlock}>
                        <ul className={styles.actionList}>
                            <li onClick={() => { setIsEditing(false); setActiveTab('orders'); }}>Мої замовлення <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('completedOrders'); }}>Виконані замовлення <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('reviews'); }}>Мої відгуки <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('favorites'); }}>Обране <span>&rarr;</span></li>
                            <li onClick={handleLogout}>Вийти <span>&rarr;</span></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.tabContent}>
                    {renderActiveTabContent()}
                </div>
            </div>
        </div>
    )
}
