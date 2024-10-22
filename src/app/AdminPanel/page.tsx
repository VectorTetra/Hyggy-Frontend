"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Імпорт із next/navigation
import Sidebar from './tsx/Sidebar'; // Імпорт Sidebar
import Content from './tsx/Content'; // Імпорт Content

export default function Admin() {
	const [authenticated, setAuthenticated] = useState(true);
	// const [loading, setLoading] = useState(true);
	const router = useRouter();

	// useEffect(() => {
	// 	// Викликаємо ваш API для перевірки автентифікації
	// 	const checkAuth = async () => {
	// 		try {
	// 			const response = await fetch('/api/check-auth'); // API route для перевірки автентифікації
	// 			if (response.ok) {
	// 				setAuthenticated(true);
	// 			} else {
	// 				router.push('/AdminPanelLogin'); // Перенаправляємо на сторінку логіну, якщо неавторизований
	// 			}
	// 		} catch (error) {
	// 			router.push('/AdminPanelLogin');
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	checkAuth();
	// }, [router]);

	// if (loading) {
	// 	return <p>Завантаження...</p>;
	// }

	return (
		authenticated ? (
			<div style={{ display: "flex" }}>
				<Sidebar />
				<Content />
			</div>
		) : null
	);
}
