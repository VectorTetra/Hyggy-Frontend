"use client";
import { resetPassword } from "@/pages/api/resetpassword";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import styles from '../css/passwordResetStyle.module.css';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

export default function PasswordChange({ passwordResetData }) {
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');
    const email = searchParams?.get('email');
    const navigate = useRouter();
    const router = useRouter();

    // Получаем userId из параметра запроса
    const userId = new URLSearchParams(window.location.search).get('reset');
    const user = passwordResetData.Users.find(user => user.userId === userId);

    // Проверка на корректность пароля
    const isPasswordValid = (password) => {
        // Минимум 8 символов, хотя бы одна заглавная буква и хотя бы одна цифра
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка на заполненность обоих полей
        if (!newPassword || !confirmPassword) {
            setMessage('');
            toast.error("Всі поля повинні бути заповнені");;
            return;
        }

        // Проверка совпадения паролей
        if (newPassword !== confirmPassword) {
            setMessage('');
            toast.error("Паролі не збігаються");
            return;
        }

        // Проверка валидности нового пароля
        if (!isPasswordValid(newPassword)) {
            setMessage('');
            toast.error("Пароль повинен містити мінімум 8 символів, включати хоча б одну заглавну букву і одну цифру.");
            return;
        }

        // Проверка наличия пользователя и обновление пароля
        // if (user) {
        //     user.newPassword = newPassword;
        //     setMessage('');
        //     alert("Ваш пароль успішно оновлено!");
        // } else {
        //     setMessage('');
        //     alert("Неправильне посилання для скидання паролю.");
        // }
        const response = await resetPassword(newPassword, confirmPassword, email, token);
        if (response) {
            toast.success(response);
            navigate.push('/PageAuthentication')
        } else {
            console.log("Щось пішло не так")
        }
    };

    // Обработка отмены
    // const handleCancel = () => {
    //     setNewPassword('');
    //     setConfirmPassword('');
    //     setMessage('');
    // };

    return (
        <div className={styles.maincontainer}>
            <div className={styles.formcontainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.caption}>Введіть новий пароль</div>
                    <div className="relative">
                        <input className={styles.formInput}
                            type={showPwd ? "text" : "password"}
                            placeholder="Введіть новий пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button className={styles.showPassword}
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}>
                            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                        </button>
                    </div>


                    <div className="relative">
                        <input className={styles.formInput}
                            type={showMatch ? "text" : "password"}
                            placeholder="Повторіть новий пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className={styles.showPassword}
                            type="button"
                            onClick={() => setShowMatch(!showMatch)}>
                            <FontAwesomeIcon icon={showMatch ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <div>
                        <button type="submit" className={styles.submitbutton}>Підтвердити</button>
                    </div>
                    <button type="button" className={styles.submitbutton2} onClick={() => router.back()}>Скасувати</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
