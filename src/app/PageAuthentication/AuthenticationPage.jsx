"use client";
import { Authorize, isUser } from "@/pages/api/TokenApi";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, TextField, ThemeProvider, Typography } from '@mui/material';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import styles from "./styles/AuthenticationStyles.module.css";
import themeFrame from "../AdminPanel/tsx/ThemeFrame";

export default function AuthenticationPage(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Добавлено состояние для показа пароля
    const router = useRouter();
    const searchParams = useSearchParams(); // Отримуємо всі параметри запиту
    const ecs = searchParams ? searchParams.get("ecs") : null; // Отримуємо значення параметра ecs
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Неправильний E-mail або пароль!")
        }
        Authorize({ Email: email, Password: password }).then((response) => {
            if (response.isAuthSuccessfull && isUser()) {
                router.push("../PageProfileUser");
                toast.success('Ви успішно увійшли в особистий кабінет!');
            }
            else {
                toast.error("Неправильний E-mail або пароль!");
            }
        });
    };
    useEffect(() => {
        if (ecs && ecs.toString() === "true") {
            toast.dismiss();
            toast.success('Ви успішно підтвердили обліковий запис!');
        }
    }, [ecs]);

    // Функція для перемикання видимості пароля
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <ThemeProvider theme={themeFrame}>
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Вхід
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: '100%',
                        maxWidth: 'clamp(400px,42vmax,800px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '2rem',
                    }}
                >
                    <TextField
                        sx={{ backgroundColor: '#E0E0E0' }}
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pattern="^[A-Za-z.-_]{3,}@[A-Za-z]+\.[A-Za-z]+$"
                        fullWidth
                    />
                    <TextField
                        sx={{ backgroundColor: '#E0E0E0' }}
                        label="Пароль"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'} // Перемикаємо тип поля
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        InputProps={{
                            // Додаємо іконку для перемикання видимості пароля
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        fullWidth
                        sx={{
                            backgroundColor: '#00AAAD',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            fontFamily: "inherit",
                            textTransform: 'none',
                        }}
                    >
                        Увійти
                    </Button>
                    <div className={styles.forgotpasswordlink}>
                        <a href="../PagePasswordReset">Забули пароль?</a>
                    </div>
                    <div>
                        <h2 className={styles.h2}>Створити новий обліковий запис</h2>
                        <div className={styles.features}>
                            <ul className={styles.featuresul}>
                                <li className={styles.featuresil}>Відстежуйте ваші посилки від замовлення до доставки</li>
                                <li className={styles.featuresil}>Зберігайте історію замовлень</li>
                                <li className={styles.featuresil}>Додавайте товари до списку бажань</li>
                                <li className={styles.featuresil}>Зберігайте інформацію для майбутніх покупок</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <button
                            className={styles.submitbutton2}
                            onClick={() => window.location.href = '../PageRegistration'}>
                            Створити новий обліковий запис
                        </button>
                    </div>
                </Box>


            </Box>

        </ThemeProvider>
    );
}