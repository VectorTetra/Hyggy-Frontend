import { Box, CircularProgress } from '@mui/material';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { lazy, Suspense } from 'react';
import Clients from './Clients';
import NewShopEmployee from './Employees/NewShopEmployee';
import NewStorageEmployee from './Employees/NewStorageEmployee';
import ShopEmployees from './Employees/ShopEmployees';
import StorageEmployees from './Employees/StorageEmployees';
import FrameRemaining from './FrameRemaining';
import FrameWriteoff from './FrameWriteoff';
const FrameStorage = lazy(() => import('./FrameStorage'));
const FrameShop = lazy(() => import('./FrameShop'));
const NewShop = lazy(() => import('./FrameShopAddEdit'));
const FrameStorageAddEdit = lazy(() => import('./FrameStorageAddEdit'));
const FrameWare = lazy(() => import('./FrameWare'));
const WareAddEditFrame = lazy(() => import('./FrameWareAddEdit'));
const FrameBlog = lazy(() => import('./FrameBlog'));
const FrameBlogAddEdit = lazy(() => import('./FrameBlogAddEdit'));
const FrameSupply = lazy(() => import('./FrameSupply'));
const FrameTransfer = lazy(() => import('./FrameTransfer'));

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
				{activeTab === 'supplies' && <FrameSupply />}
				{activeTab === 'transfers' && <FrameTransfer />}
				{activeTab === 'writeOffs' && <FrameWriteoff />}
				{activeTab === 'stores' && <FrameShop />}
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
		</Box>
	);
}