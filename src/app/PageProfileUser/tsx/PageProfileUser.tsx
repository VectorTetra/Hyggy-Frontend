"use client";
import React, { useState, useEffect } from "react";
import styles from '../page.module.css';
import data from '../PageProfileUser.json';
import { useRouter } from 'next/navigation';
import EditProfileUser from "./EditProfileUser";
import OrdersUser from './OrdersUser';
import CompletedOrdersUser from './CompletedOrdersUser';
import ReviewsUser from './ReviewsUser';
import { getDecodedToken, removeToken, validateToken } from '@/pages/api/TokenApi';
import { Customer, useCustomers, useUpdateCustomer } from "@/pages/api/CustomerApi";
import { useWares } from "@/pages/api/WareApi";
import { CircularProgress } from "@mui/material";
import { getPhotoByUrlAndDelete, uploadPhotos } from "@/pages/api/ImageApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryState } from "nuqs";
import FavoriteWaresUser from "./FavoriteWaresUser";
import ConfirmationDialog from "@/app/sharedComponents/ConfirmationDialog";

export default function PageProfileUser(props) {

    const [isEditing, setIsEditing] = useState(false);
    const [isExitingDialogOpen, setIsExitingDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(data.profile.urlphoto || null);
    const router = useRouter();
    const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'orders' });
    let [customer, setCustomer] = useState<Customer | null>(null);
    const { mutateAsync: updateCustomer } = useUpdateCustomer();


    const { data: customers = [], isLoading: customerLoading, isSuccess: customerSuccess } = useCustomers({
        SearchParameter: "Query",
        Id: getDecodedToken()?.nameid
    });

    const { data: favoriteWares = [], isLoading: favoriteWaresLoading, isSuccess: favoriteWaresSuccess } = useWares({
        SearchParameter: "GetFavoritesByCustomerId",
        CustomerId: getDecodedToken()?.nameid
    });

    const isAuthorized = validateToken().status === 200;

    const handleEdit = () => {
        setIsEditing(true); // Устанавливаем состояние редактирования
    };

    const handleSaveChanges = () => {
        setIsEditing(false); // Закрываем форму редактирования
        setActiveTab('orders'); // Переходим на вкладку «Мої замовлення»
    };

    useEffect(() => {
        if (!isAuthorized) {
            router.push('/'); // Переход на главную страницу, если не авторизован
        }

    }, []);
    useEffect(() => {
        if (customerSuccess && customers.length > 0) {
            setCustomer(customers[0]); // Оновлюємо клієнта, якщо успішно завантажено
            console.log(customers[0]);
        }
    }, [customerSuccess, customers]); // Залежність від customers та customerSuccess

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && customer !== null && customer.favoriteWareIds && customer.orderIds) {
            if (customer.avatarPath) { getPhotoByUrlAndDelete(customer.avatarPath); }
            uploadPhotos(files).then(async (urls) => {
                await updateCustomer(
                    {
                        Name: customer!.name,
                        Surname: customer!.surname,
                        Email: customer!.email,
                        Id: getDecodedToken()?.nameid || "",
                        PhoneNumber: customer!.phoneNumber,
                        AvatarPath: urls[0],
                        FavoriteWareIds: customer!.favoriteWareIds,
                        OrderIds: customer!.orderIds
                    },
                    {
                        onSuccess: () => {
                            console.log("Дані оновлено, починаємо рефетчинг...");
                            queryClient.invalidateQueries({ queryKey: ['customers'] });
                            toast.success("Фото профілю успішно оновлено!");
                        },
                        onError: (error) => {
                            toast.error("Помилка при оновленні фото профілю!");
                            console.error("Помилка оновлення:", error);
                        }
                    }
                );
            });
        }
    };

    // const uploadImage = async (file: File) => {
    //     // Удаление старого изображения на ImageKit, если оно существует
    //     if (data.profile.urlphoto) {
    //         await deleteOldImage(data.profile.urlphoto);
    //     }

    //     // Загрузка нового изображения на ImageKit
    //     const formData = new FormData();
    //     formData.append('photos', file);
    //     formData.append('fileName', file.name);

    //     try {
    //         const response = await fetch('https://api.imagekit.io/v1/files/upload', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Basic ${btoa('public_M7rp5a+A03bMXqAwHwTbXJozb2Q=')}`,
    //             },
    //             body: formData,
    //         });

    //         const data = await response.json();
    //         if (data.profile.urlphoto) {
    //             // Обновляем URL изображения в JSON
    //             updateProfilePhotoUrl(data.profile.urlphoto);
    //         }
    //     } catch (error) {
    //         console.error("Ошибка загрузки изображения:", error);
    //     }
    // };

    // const deleteOldImage = async (imageUrl: string) => {
    //     const imageId = imageUrl.split('/').pop(); // Извлечение ID изображения из URL
    //     try {
    //         await fetch(`https://api.imagekit.io/v1/files/${imageId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Basic ${btoa('private_XDeaQHKGVMyTnXaAJfkHZuGc+nQ=')}`,
    //             },
    //         });
    //     } catch (error) {
    //         console.error("Ошибка удаления старого изображения:", error);
    //     }
    // };

    // const updateProfilePhotoUrl = (newUrl: string) => {
    //     data.profile.urlphoto = newUrl;
    // };

    // Функция для выхода

    const handleConfirmedLogout = () => {
        removeToken();
        router.push("/");
    };



    const renderActiveTabContent = () => {
        // Если мы редактируем профиль, то отображаем форму редактирования
        if (isEditing && customer != null) {
            return <EditProfileUser onSave={handleSaveChanges} user={customer} />
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
                    <FavoriteWaresUser />
                );
            default:
                return null;
        }
    };
    const allSuccess = customerSuccess && favoriteWaresSuccess;
    return (
        <div>
            {!allSuccess && <CircularProgress />}
            {allSuccess && <div className={styles.pageBackground}>
                <h2 className={styles.pageTitle}>Профіль</h2>
                <div className={styles.profileContainer}>
                    <div className={styles.profileBlock}>
                        <div className={styles.profileInfo}>
                            <div
                                className={imagePreviewUrl ? styles.profileImageContainerOrange : styles.profileImageContainerMustard}
                            >
                                {imagePreviewUrl ? (
                                    <img src={customer?.avatarPath ? customer.avatarPath : imagePreviewUrl} className={styles.profileImage} alt="profile" />
                                ) : (
                                    <div className={styles.placeholder}>Фото</div>
                                )}
                            </div>
                            <div className={styles.profileText}>
                                <h3 className={styles.h3}>{customer?.name} {customer?.surname}</h3>
                                <label htmlFor="uploadPhoto" className={styles.uploadLink}>Завантажити фото</label>
                                <input type="file" accept="image/*" id="uploadPhoto" className={styles.fileInput} onChange={handleImageChange} />
                            </div>
                        </div>
                        <ul className={styles.profileDetails}>
                            <li><strong>Електронна пошта:</strong> {customer?.email}</li>
                            <li><strong>Номер телефону:</strong> {customer?.phoneNumber ? customer.phoneNumber : "Не призначено"}</li>
                        </ul>
                        <div className={styles.deleteAccountButtonContainer}>
                            <button className={styles.deleteAccountButton} onClick={handleEdit}>Редагувати</button>
                            <button className={styles.deleteAccountButton} onClick={() => { setIsExitingDialogOpen(true) }}>Вийти</button>
                        </div>
                    </div>
                    <div className={styles.profileBlock}>
                        <ul className={styles.actionList}>
                            <li onClick={() => { setIsEditing(false); setActiveTab('orders'); }}>Мої замовлення <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('completedOrders'); }}>Виконані замовлення <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('reviews'); }}>Мої відгуки <span>&rarr;</span></li>
                            <li onClick={() => { setIsEditing(false); setActiveTab('favorites'); }}>Обране <span>&rarr;</span></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.tabContent}>
                    {renderActiveTabContent()}
                </div>
                <ConfirmationDialog
                    title="Вийти?"
                    contentText={`Ви дійсно бажаєте вийти з власного кабінету?`}
                    onConfirm={handleConfirmedLogout}
                    onCancel={() => setIsExitingDialogOpen(false)}
                    confirmButtonBackgroundColor='#00AAAD'
                    cancelButtonBackgroundColor='#fff'
                    cancelButtonBorderColor='#be0f0f'
                    cancelButtonColor='#be0f0f'
                    open={isExitingDialogOpen}
                />

            </div>}
        </div>
    )
}
