import { lazy, Suspense } from 'react';
import { Box, Collapse, CircularProgress, CssBaseline, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Button } from '@mui/material';
const FrameStorage = lazy(() => import('./FrameStorage'));
const AllShops = lazy(() => import('./AllShops'));
const NewShop = lazy(() => import('./NewShop'));
const FrameStorageAddEdit = lazy(() => import('./FrameStorageAddEdit'));
const FrameWare = lazy(() => import('./FrameWare'));
const WareAddEditFrame = lazy(() => import('./FrameWareAddEdit'));
const FrameBlog = lazy(() => import('./FrameBlog'));
const FrameBlogAddEdit = lazy(() => import('./FrameBlogAddEdit'));
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs

import Clients from './Clients';

import ShopEmployees from './Employees/ShopEmployees';
import NewShopEmployee from './Employees/NewShopEmployee';
import StorageEmployees from './Employees/StorageEmployees';
import NewStorageEmployee from './Employees/NewStorageEmployee';
import FrameWriteoff from './FrameWriteoff';
import FrameRemaining from './FrameRemaining';

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
				{activeTab === 'products' && <FrameWare />}
				{activeTab === 'addEditWare' && <WareAddEditFrame />}
				{activeTab === 'warehousesList' && <FrameStorage />}
				{activeTab === 'addEditWarehouse' && <FrameStorageAddEdit />}
				{activeTab === 'remains' && <FrameRemaining />}
				{activeTab === 'supplies' && <div>Поставки</div>}
				{activeTab === 'transfers' && <div>Переміщення</div>}
				{activeTab === 'writeOffs' && <FrameWriteoff />}
				{activeTab === 'stores' && <AllShops />}
				{activeTab === 'addNewShop' && <NewShop />}
				{activeTab === 'shopEmployees' && <ShopEmployees />}
				{activeTab === 'addShopEmployee' && <NewShopEmployee />}
				{activeTab === 'storageEmployees' && <StorageEmployees />}
				{activeTab === 'addStorageEmployee' && <NewStorageEmployee />}
				{activeTab === 'clients' && <Clients />}
				{activeTab === 'orders' && <div>Замовлення</div>}
				{activeTab === 'blog' && <FrameBlog />}
				{activeTab === 'addEditBlog' && <FrameBlogAddEdit />}
				{activeTab === 'reviews' && <div>Відгуки</div>}
			</Suspense>
		</Box>)
}