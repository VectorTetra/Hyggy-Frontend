import useAdminPanelStore from '@/store/adminPanel'; // Імпортуємо Zustand
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import {
	Box,
	Button,
	Collapse, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton,
	ListItemIcon, ListItemText, Toolbar
} from '@mui/material';
import Image from 'next/image';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useState } from 'react';
import hyggyIcon from '/public/images/AdminPanel/hyggyIcon.png';
import { removeToken, getDecodedToken } from '@/pages/api/TokenApi';
import Link from 'next/link';

const drawerWidth = 240;
const token = getDecodedToken(); // Отримуємо дані токена
const MenuItem = ({
	icon,
	text,
	value, // Додаємо значення вкладки
	open = false,
	onClick,
	children,
}: {
	icon: React.ReactNode;
	text: string;
	value: string; // Значення вкладки
	open?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
}) => {
	// Використовуємо Zustand для отримання активної вкладки
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	// Перевірка, чи ця вкладка є активною
	const isActive = activeTab === value;

	// Логіка для відкриття/закриття підменю
	const handleClick = () => {
		// Якщо є дочірні елементи, потрібно змінити їх стан
		if (onClick) onClick();
		else setActiveTab(value); // Зберігаємо вибрану вкладку
	};

	// Перевірка, чи є дочірні елементи
	const hasChildren = !!children;

	// Логіка для визначення кольору тексту та іконки
	const iconColor = hasChildren || !isActive ? '#ffffff' : '#ffd700';
	const textColor = hasChildren || !isActive ? '#ffffff' : '#ffd700';

	return (
		<>
			<ListItem disablePadding>
				<ListItemButton
					onClick={handleClick} // Викликаємо функцію для зміни стану
					sx={{
						backgroundColor: isActive ? '#008b8d' : 'inherit', // Темніший фон, якщо активна
						'&:hover': { backgroundColor: '#007a7d' }, // Темніший фон при наведенні
					}}
				>
					<ListItemIcon sx={{ color: iconColor }}> {/* Білий або контрастний текст */}
						{icon}
					</ListItemIcon>
					<ListItemText
						primary={text}
						primaryTypographyProps={{ fontWeight: 'bold' }}
						sx={{ color: textColor }} // Білий або контрастний текст
					/>
					{/* Якщо є дочірні елементи, показуємо стрілки */}
					{children && (open ? <ExpandLessIcon sx={{ color: 'white' }} /> : <ExpandMoreIcon sx={{ color: 'white' }} />)}
				</ListItemButton>
			</ListItem>

			{/* Якщо є дочірні елементи, розкриваємо їх */}
			{children && (
				<Collapse in={open} timeout={200} unmountOnExit>
					<List component="div" disablePadding>{children}</List>
				</Collapse>
			)}
		</>
	);
};

// Компонент для вторинного пункту меню
const SubMenuItem = ({
	text,
	value,
	onBlur,
}: {
	text: string;
	value: string;
	onBlur?: () => void; // onBlur є опціональним
}) => {
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	const isActive = activeTab === value;

	return (
		<ListItemButton
			sx={{
				pl: 9,
				backgroundColor: isActive ? '#008b8d' : 'inherit', // Темніший фон, якщо активна
				'&:hover': { backgroundColor: '#007a7d' }, // Темніший фон при наведенні
			}}
			onClick={() => { setActiveTab(value); onBlur && onBlur() }} // Зберігаємо вибрану вкладку
		>
			<ListItemText
				primary={text}
				sx={{ color: isActive ? '#ffd700' : '#ffffff', fontWeight: 400 }} // Контрастний текст для підпунктів
			/>
		</ListItemButton>
	);
};

export default function Sidebar(props) {
	const [openWarehouses, setOpenWarehouses] = useState(false);
	const [openEmployees, setEmployees] = useState(false);
	const { setFrameRemainsSidebarVisibility } = useAdminPanelStore();

	const { window, rolePermissions } = props;

	const toggleWarehouses = () => {
		setOpenWarehouses(!openWarehouses);
	};
	const toggleEmployees = () => {
		setEmployees(!openEmployees)
	};
	const drawer = (
		<div>
			<Toolbar
				sx={{
					padding: '8px 16px',
					position: 'fixed',
					top: 0,
					width: drawerWidth,
					backgroundColor: '#00AAAD',
					boxSizing: 'border-box',
				}}
			>
				<Button
					variant="contained"
					sx={{
						backgroundColor: 'white',
						color: '#00AAAD',
						fontWeight: 'bold',
						textTransform: 'none',
						display: 'flex',
						alignItems: 'center',
						'&:hover': {
							backgroundColor: '#e0f7f8',
						},
					}}
				>

					<Link prefetch={true} href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#00AAAD' }}>
						<Image
							src={hyggyIcon}
							alt="<"
							width={72}
							height={36}
						/>
						<span style={{ marginLeft: '8px' }}>Перейти на сайт</span>
					</Link>
				</Button>
			</Toolbar>
			<Divider sx={{ mt: 8 }} /> {/* Відступ, щоб розділювач не накладався на кнопку */}
			<Box sx={{
				overflowY: 'auto',
				height: 'calc(100vh - 128px)',
				'&::-webkit-scrollbar': {
					width: '8px',
				},
				'&::-webkit-scrollbar-track': {
					backgroundColor: '#01cace', // Колір фону треку скролу
					borderRadius: '4px',
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: '#005557', // Колір самого скроллбару
					borderRadius: '4px',
				},
				'&::-webkit-scrollbar-thumb:hover': {
					backgroundColor: '#000000', // Колір при наведенні на скроллбар
				},
			}}>
				{/* Відступ зверху і прокручування */}
				<List>
					{rolePermissions.IsFrameWare_Available && <MenuItem icon={<CategoryIcon />} text="Товари" value="products" />}
					{rolePermissions.IsTabStorage_Available && <MenuItem icon={<WarehouseIcon />} text="Склади" value="warehouses" open={openWarehouses} onClick={toggleWarehouses}>
						{rolePermissions.IsFrameStorage_Available && <SubMenuItem text="Склади" value="warehousesList" />}
						{rolePermissions.IsFrameRemaining_Available && <SubMenuItem text="Залишки" value="remains" onBlur={() => { setFrameRemainsSidebarVisibility(false); console.log("Set to false") }} />}
						{rolePermissions.IsFrameSupply_Available && <SubMenuItem text="Поставки" value="supplies" />}
						{rolePermissions.IsFrameTransfer_Available && <SubMenuItem text="Переміщення" value="transfers" />}
						{rolePermissions.IsFrameWriteoff_Available && <SubMenuItem text="Списання" value="writeOffs" />}
					</MenuItem>}
					{rolePermissions.IsFrameShops_Available && <MenuItem icon={<StoreIcon />} text="Магазини" value="stores" />}
					{rolePermissions.IsTabEmployees_Available && <MenuItem icon={<PeopleIcon />} text="Співробітники" value="employees" open={openEmployees} onClick={toggleEmployees}>
						{rolePermissions.IsFrameShopEmployees_Available && <SubMenuItem text="Магазини" value="shopEmployees" />}
						{rolePermissions.IsFrameStorageEmployees_Available && <SubMenuItem text="Склади" value="storageEmployees" />}
					</MenuItem>}

					{rolePermissions.IsFrameClients_Available && <MenuItem icon={<PersonIcon />} text="Клієнти" value="clients" />}
					{rolePermissions.IsFrameOrders_Available && <MenuItem icon={<ShoppingCartIcon />} text="Замовлення" value="orders" />}
					{rolePermissions.IsFrameBlog_Available && <MenuItem icon={<ArticleIcon />} text="Блог" value="blog" />}
					{/* {rolePermissions.IsFrameReviews_Available && <MenuItem icon={<RateReviewIcon />} text="Відгуки" value="reviews" />} */}
					<Link prefetch={true} href="../AdminPanelLogin" style={{ textDecoration: "none" }} onClick={() => {
						removeToken();
					}}>
						<MenuItem
							icon={<LogoutIcon />}
							text="Вихід"
							value="exit"
						/>
					</Link>
				</List>
			</Box>
			<Box
				sx={{
					padding: '8px 16px',
					position: 'fixed',
					bottom: 0,
					width: drawerWidth,
					backgroundColor: '#00AAAD',
					boxSizing: 'border-box',
				}}
			>
				<Box
					sx={{
						backgroundColor: 'white',
						color: '#00AAAD',
						fontWeight: 'bold',
						textTransform: 'none',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '8px',
					}}
				>
					<Box>{token?.email}</Box>
					<Box>{rolePermissions.translateRole(token?.role)}</Box>
				</Box>
			</Box>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ zIndex: 10000 }}>
			<CssBaseline />
			<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="menu folders">
				<Drawer
					container={container}
					variant="permanent"
					open
					sx={{
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							backgroundColor: '#00AAAD',
							color: 'white',
						},
					}}
				>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	);
}

