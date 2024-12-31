"use client";
import { Authorize } from '@/pages/api/TokenApi';
import { ThemeProvider } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import themeFrame from '../AdminPanel/tsx/ThemeFrame';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Стан для видимості пароля
    const router = useRouter();
    const params = useParams();
    const ecs = params?.ecs;
    const handleSubmit = async (e) => {
        e.preventDefault();

        Authorize({ Email: email, Password: password }).then((response) => {
            console.log(response);
            if (response.isAuthSuccessfull) {
                router.push('/AdminPanel');
                toast.dismiss();
                toast.success('Ви успішно увійшли в систему!');
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
                    backgroundColor: '#f5f5f5',
                    padding: '2rem',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Логін
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                    }}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
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
                        sx={{ padding: '0.75rem', fontSize: '1rem' }}
                    >
                        Увійти
                    </Button>
                </Box>
                <Link href="/" >
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ padding: '10px 90px', fontSize: '1rem', marginTop: "30px" }}
                    >
                        Перейти на сайт HYGGY
                    </Button>
                </Link>
            </Box>
        </ThemeProvider>
    );
}