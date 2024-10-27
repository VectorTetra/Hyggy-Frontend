"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch('/api/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (response.ok) {
			// Зберігаємо токен або статус сесії
			localStorage.setItem('token', data.token);
			router.push('/admin'); // Перенаправляємо до адмін-панелі
		} else {
			setError(data.message || 'Помилка аутентифікації');
		}
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
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					fullWidth
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
					type="submit"
					color="primary"
					fullWidth
					sx={{ padding: '10px 90px 10px 90px ', fontSize: '1rem', marginTop: "30px" }}
				>
					Перейти на сайт HYGGY
				</Button>
			</a>
		</Box>

	);
}
