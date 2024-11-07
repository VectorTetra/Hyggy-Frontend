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



	return (
		(
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
		)
	);
}