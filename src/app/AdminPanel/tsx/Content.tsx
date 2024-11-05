import { lazy, Suspense } from 'react';
import { Box, Collapse, CircularProgress, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Button } from '@mui/material';
const WarehouseFrame = lazy(() => import('./FrameWarehouse'));
const AllShops = lazy(() => import('./AllShops'));
const NewShop = lazy(() => import('./NewShop'));
const WarehouseAddEditFrame = lazy(() => import('./FrameWarehouseAddEdit'));
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs

import Clients from './Clients';


const drawerWidth = 240;

export default function Content() {
	const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "products", scroll: false, history: "push", shallow: true });
	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				p: 3,
				//overflowX: "auto",
				//width: { sm: `calc(100% - ${drawerWidth}px)` },
			}}
		>
			<Suspense fallback={<CircularProgress />}>
				{activeTab === 'products' && <div>Товари</div>}
				{activeTab === 'warehousesList' && <WarehouseFrame />}
				{activeTab === 'addEditWarehouse' && <WarehouseAddEditFrame />}
				{activeTab === 'remains' && <div>Залишки</div>}
				{activeTab === 'supplies' && <div>Поставки</div>}
				{activeTab === 'transfers' && <div>Переміщення</div>}
				{activeTab === 'writeOffs' && <div>Списання</div>}
				{activeTab === 'stores' && <AllShops />}
				{activeTab === 'addNewShop' && <NewShop />}
				{activeTab === 'employees' && <div>Співробітники</div>}
				{activeTab === 'clients' && <Clients />}
				{activeTab === 'orders' && <div>Замовлення</div>}
				{activeTab === 'blog' && <div>Блоги</div>}
				{activeTab === 'reviews' && <div>Відгуки</div>}
			</Suspense>
		</Box>)
}