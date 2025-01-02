"use client";
import { resetPassword } from "@/pages/api/resetpassword";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import styles from '../css/passwordResetStyle.module.css';

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

        const response = await resetPassword(newPassword, confirmPassword, email, token);
        if (response) {
            toast.success(response);
            navigate.push('/PageAuthentication')
        } else {
            console.log("Щось пішло не так")
        }
    };

    return (
        <div className={styles.maincontainer}>
            <div className={styles.formcontainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.caption}>Введіть новий пароль</div>

                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 'clamp(400px,42vmax,800px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >

                        <TextField className={styles.formInput}
                            type={showPwd ? "text" : "password"}
                            label="Введіть новий пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                // Додаємо іконку для перемикання видимості пароля
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPwd(!showPwd)}
                                            edge="end"
                                        >
                                            {showPwd ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />


                        <TextField className={styles.formInput}
                            type={showMatch ? "text" : "password"}
                            label="Повторіть новий пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                // Додаємо іконку для перемикання видимості пароля
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowMatch(!showMatch)}
                                            edge="end"
                                        >
                                            {showMatch ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

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
