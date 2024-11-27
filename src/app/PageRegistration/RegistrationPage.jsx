"use client";
import { RegisterAsClient } from "@/pages/api/TokenApi";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import styles from "./css/RegistrationStyles.module.css";

export default function RegistrationPage(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checkboxStates, setCheckboxStates] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Добавлено состояние для показа пароля
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Добавлено состояние для показа пароля


    // Функция для проверки пароля
    const isPasswordValid = (password) => {
        // Минимум 8 символов, хотя бы одна заглавная буква и хотя бы одна цифра
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };



    // Очищаем форму, если нажата кнопка "Скасувати"
    const handleReset = () => {
        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setCheckboxStates({});
        setErrorMessage('');
    };

    // Проверки
    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверка, что все поля заполнены
        if (!name || !surname || !email || !password || !confirmPassword) {
            setErrorMessage('');
            toast.error('Всі поля обов\'язкові для заповнення');
            return;
        }

        // Проверка паролей
        if (password !== confirmPassword) {
            setErrorMessage('');
            toast.error('Паролі не збігаються');
            return;
        }

        if (!isPasswordValid(password)) {
            setErrorMessage('');
            toast.error('Пароль повинен містити мінімум 8 символів, включати хоча б одну заглавну букву і одну цифру.');
            return;
        }

        // Проверка всех чекбоксов
        const allChecked = props.registration.label.every(item => checkboxStates[item.name]);
        if (!allChecked) {
            setErrorMessage('');
            toast.error('Необхідно прийняти умови та підписатися на новини');
            return;
        }

        try {
            RegisterAsClient({
                Email: email,
                Name: name,
                Surname: surname,
                Password: password,
                ConfirmPassword: confirmPassword,
                Role: "User"
            })
        } catch (error) {
            console.log(error);
            return;
        }
    };

    // Обработчик изменения состояния чекбоксов
    const handleCheckboxChange = (name) => {
        setCheckboxStates(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    return (
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
            <Typography variant="div" component="h1" gutterBottom sx={{}}>
                Створити обліковий запис
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
                <TextField sx={{

                    backgroundColor: 'rgb(227, 223, 223)', boxsizing: 'border-box', border: '2px solid #bab8b8', borderradius: '6px'
                }}
                    label="Ім'я"
                    variant="outlined"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                />

                <TextField sx={{ backgroundColor: 'rgb(227, 223, 223)', boxsizing: 'border-box', border: '2px solid #bab8b8', borderradius: '6px' }}
                    type="text"
                    label="Прізвище"
                    variant="outlined"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    fullWidth
                />
                <TextField sx={{ backgroundColor: 'rgb(227, 223, 223)', boxsizing: 'border-box', border: '2px solid #bab8b8', borderradius: '6px' }}
                    type="email"
                    label="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="^[A-Za-z.-_]{3,}@[A-Za-z]+\.[A-Za-z]+$"
                    required
                    fullWidth
                />
                <TextField sx={{ backgroundColor: 'rgb(227, 223, 223)', boxsizing: 'border-box', border: '2px solid #bab8b8', borderradius: '6px' }}
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    value={password}
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    InputProps={{
                        // Додаємо іконку для перемикання видимості пароля
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField sx={{ backgroundColor: 'rgb(227, 223, 223)', boxsizing: 'border-box', border: '2px solid #bab8b8', borderradius: '6px' }}
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Підтвердіть пароль"
                    value={confirmPassword}
                    variant="outlined"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                    InputProps={{
                        // Додаємо іконку для перемикання видимості пароля
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <div className={styles.checkboxesTableContainer}>
                    <table className={styles.checkboxesTable}>
                        <tbody>
                            {props.registration.label.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input className={styles.formCheckbox}
                                            type="checkbox"
                                            checked={checkboxStates[item.name] || false}
                                            onChange={() => handleCheckboxChange(item.name)}
                                        />
                                    </td>
                                    <td>
                                        <label style={{ "margin": "0", "padding": "0", "fontSize": "14px" }}
                                            onClick={() => handleCheckboxChange(item.name)}> {item.name} </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {errorMessage && <div className={styles.errormessage}>{errorMessage}</div>}
                    </table >
                </div>

                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    fullWidth
                    sx={{
                        backgroundColor: '#00AAAD',
                        padding: '0.75rem',
                        fontSize: '1rem',

                        color: 'white', // Цвет текста
                        textTransform: 'none',
                        ':hover': {
                            backgroundColor: '#008C8D', // Цвет при наведении
                        },
                    }}
                >
                    Створити обліковий запис
                </Button>

                <Button
                    // variant="outlined"
                    // type="div"
                    // component="div"
                    color="primary"
                    fullWidth
                    onClick={handleReset}
                    sx={{
                        backgroundColor: '#f3f3f3',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        color: '#00AAAD', // Цвет текста
                        textDecoration: 'underline',
                        textTransform: 'none',
                    }}
                >
                    Скасувати
                </Button>
            </Box>
        </Box >
    );
}