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
import { jwtDecode } from "jwt-decode";
import { validateToken } from '@/pages/api/TokenApi';
// import { JwtPayload } from 'jwt-decode';

export default function Admin() {
	const [authenticated, setAuthenticated] = useState(validateToken().status === 200);
	const router = useRouter();
	// useEffect для перевірки автентифікації
	useEffect(() => {
		if (!authenticated) {
			router.push('/AdminPanelLogin');
		}
	}, [authenticated]);

	return (
		authenticated ? (
			<div>
				<div style={{ display: "flex" }}>
					<Sidebar />
					<Content />
					{/* <ToastContainer
						stacked={true}
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