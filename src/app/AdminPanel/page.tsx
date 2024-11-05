// Page: AdminPanel
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './tsx/Sidebar';
import Content from './tsx/Content';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import StoreIcon from '@mui/icons-material/Store';
import "react-toastify/dist/ReactToastify.css";
import './css/AdminPanel.css';
import { validateToken } from '@/pages/api/TokenApi';

export default function Admin() {
	const [authenticated, setAuthenticated] = useState(validateToken().status === 200);
	const router = useRouter();

	// useEffect для перевірки автентифікації в режимі реального часу
	useEffect(() => {
		if (!authenticated) {
			router.push('/AdminPanelLogin');
		}
	}, [authenticated, router]);

	// Перевірка валідності токена у фоновому режимі
	useEffect(() => {
		const intervalId = setInterval(() => {
			const tokenStatus = validateToken();
			if (tokenStatus.status !== 200) {
				setAuthenticated(false);
				clearInterval(intervalId); // Зупиняємо перевірку, якщо токен недійсний
				toast.warn('Сесія закінчилася, будь ласка, увійдіть знову.', { autoClose: false, closeOnClick: true });
				router.push('/AdminPanelLogin');
			}
		}, 10 * 1000); // Перевірка кожні 10 секунд

		return () => clearInterval(intervalId); // Очищення інтервалу при демонтажі компонента
	}, [router]);

	return (
		authenticated ? (
			<div>
				<div style={{ display: "flex" }}>
					<Sidebar />
					<Content />
					{/* <ToastContainer
						autoClose={5000}
						position='bottom-right'
						pauseOnHover={false}
						theme='colored'
						transition={Bounce}
						closeOnClick={true}
						hideProgressBar={false}
						limit={3}
					/> */}
				</div>
			</div>
		) : null
	);
}
