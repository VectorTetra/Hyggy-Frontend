"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Box, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Authorize, getDecodedToken } from '@/pages/api/TokenApi';
import { toast } from 'react-toastify';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false); // Стан для видимості пароля
	const router = useRouter();
	/*
	showPassword: Цей стан контролює видимість пароля. Якщо showPassword дорівнює true, 
	поле TextField відображає пароль у вигляді звичайного тексту (type="text"), інакше як прихований (type="password").

	IconButton: Додається до TextField у властивості InputProps з InputAdornment, дозволяючи додати іконку ока
	для зміни видимості.

	handleClickShowPassword: Використовується для перемикання значення showPassword.
	*/
	const handleSubmit = async (e) => {
		e.preventDefault();

		Authorize({ Email: email, Password: password }).then((response) => {
			if (response.isAuthSuccessfull) {
				router.push('/AdminPanel');
				toast.success('Ви успішно увійшли в систему!');
				const decodedToken = getDecodedToken();
				if (decodedToken) {
					toast.info(`Токен діє до: ${new Date(decodedToken.exp * 1000).toLocaleString()}`);
				}
			}
		});
	};

	// Функція для перемикання видимості пароля
	const handleClickShowPassword = () => setShowPassword(!showPassword);

	return (
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
			<a href="/" >
				<Button
					variant="contained"
					color="primary"
					fullWidth
					sx={{ padding: '10px 90px', fontSize: '1rem', marginTop: "30px" }}
				>
					Перейти на сайт HYGGY
				</Button>
			</a>
		</Box>
	);
}
