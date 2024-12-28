// Page: AdminPanel
"use client";
import { getRolePermissions, isGuest, isTokenValid, isUser } from '@/pages/api/TokenApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './css/AdminPanel.css';
import Content from './tsx/Content';
import Sidebar from './tsx/Sidebar';

export default function Admin() {
	const [authenticated, setAuthenticated] = useState(isTokenValid() && !isUser() && !isGuest());
	const router = useRouter();
	const rolePermissions = getRolePermissions();
	// useEffect для перевірки автентифікації в режимі реального часу
	useEffect(() => {
		if (!authenticated) {
			router.push('/AdminPanelLogin');
		}
	}, [authenticated, router]);

	// Перевірка валідності токена у фоновому режимі
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!isTokenValid()) {
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
					<Sidebar rolePermissions={rolePermissions} />
					<Content rolePermissions={rolePermissions} />
				</div>
			</div>
		) : null
	);
}